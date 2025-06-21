const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const geminiModel = require("../utils/geminiClient");

// POST /memes
router.post("/save-memes", async (req, res) => {
  const { title, imageUrl, tags } = req.body;

  let caption = "Fallback Caption";
  let vibe = "Glitched Meme Matrix";

  try {
    const prompt = `Write a short meme caption and a cyberpunk vibe for these tags: ${tags.join(", ")}.

Format:
Caption: ...
Vibe: ...`;

    const result = await geminiModel.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const output = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const captionMatch = output.match(/Caption:\s*(.*)/i);
    const vibeMatch = output.match(/Vibe:\s*(.*)/i);

    caption = captionMatch ? captionMatch[1] : caption;
    vibe = vibeMatch ? vibeMatch[1] : vibe;
  } catch (error) {
    console.error("⚠️ Gemini API Error:", error.message);
  }

  const { data, error } = await supabase
    .from("memes")
    .insert([{ title, image_url: imageUrl, tags, upvotes: 0, caption, vibe }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: "Failed to create meme" });

  res.status(201).json({
    id: data.id,
    title: data.title,
    imageUrl: data.image_url,
    tags: data.tags || [],
    upvotes: data.upvotes,
    caption: data.caption,
    vibe: data.vibe,
  });
});



router.get("/memes", async (req, res) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching memes:", error);
    return res.status(500).json({ error: "Failed to fetch memes" });
  }

  // ✅ Use the formatted version here
  const formattedMemes = data.map((meme) => ({
    id: meme.id,
    title: meme.title,
    imageUrl: meme.image_url,
    tags: meme.tags || [], // ← ensures it's always an array
    upvotes: meme.upvotes,
    caption: meme.caption || "No caption",
    vibe: meme.vibe || "Unknown",
  }));

  res.json(formattedMemes);
});

router.post("/memes/:id/upvote", async (req, res) => {
  const memeId = req.params.id;

  // Fetch current upvotes
  const { data: memeData, error: fetchError } = await supabase
    .from("memes")
    .select("upvotes")
    .eq("id", memeId)
    .single();

  if (fetchError) {
    console.error("❌ Failed to fetch meme:", fetchError);
    return res.status(404).json({ error: "Meme not found" });
  }

  const newUpvotes = (memeData.upvotes || 0) + 1;

  // Update upvotes
  const { data, error } = await supabase
    .from("memes")
    .update({ upvotes: newUpvotes })
    .eq("id", memeId)
    .select()
    .single();

  if (error) {
    console.error("❌ Error updating upvotes:", error);
    return res.status(500).json({ error: "Upvote failed" });
  }

  res.json({ id: data.id, upvotes: data.upvotes });
});

router.get("/leaderboard", async (req, res) => {
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order("upvotes", { ascending: false })
    .limit(10);

  if (error) {
    console.error("❌ Leaderboard error:", error);
    return res.status(500).json({ error: "Failed to load leaderboard" });
  }

  const formatted = data.map((meme) => ({
    id: meme.id,
    title: meme.title,
    upvotes: meme.upvotes || 0,
  }));

  res.json(formatted);
});

// Handle incoming bids

router.post("/memes/:id/bid", async (req, res) => {
  const memeId = req.params.id;
  const { credits } = req.body;
  const userId = "cyberpunk420"; // hardcoded for now

  const { data, error } = await supabase
    .from("bids")
    .insert([{ meme_id: memeId, user_id: userId, credits }])
    .select()
    .single();

  if (error) {
    console.error("❌ Error placing bid:", error);
    return res.status(500).json({ error: "Bid failed" });
  }

  // Broadcast via Socket.IO
  io.emit("new-bid", {
    memeId,
    user: userId,
    credits,
  });

  res.status(201).json(data);
});

router.get("/bids/highest/:memeId", async (req, res) => {
  const { memeId } = req.params;

  const { data, error } = await supabase
    .from("bids")
    .select("credits")
    .eq("meme_id", memeId)
    .order("credits", { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({ error: "Failed to fetch bid" });
  }

  const highestBid = data.length > 0 ? data[0].credits : 0;
  res.json({ highestBid });
});

module.exports = router;
