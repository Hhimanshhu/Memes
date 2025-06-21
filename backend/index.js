require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const memeRoutes = require("./routes/memes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/backend", memeRoutes);

// Bids & Leaderboard routes can be added here similarly...

server.listen(PORT, () => {
  console.log(`⚡ Server running at http://localhost:${PORT}`);
});











// const supabaseUrl = "https://your-project-url.supabase.co";
// const supabaseKey = "your-anon-key";
// require("dotenv").config();
// const cors = require("cors");
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow all for dev
//   },
// });
// const PORT = 5000;

// const fetch = require("node-fetch");


// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// const { createClient } = require("@supabase/supabase-js");

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// );

// // Middleware
// app.use(cors());
// app.use(express.json());

// // In-memory meme store
// let memes = [];

// // Routes
// app.post("/memes", async (req, res) => {
//   const { title, imageUrl, tags } = req.body;

//   console.log("🔁 Incoming meme:", { title, imageUrl, tags });

//   let caption = "Fallback Caption";
//   let vibe = "Glitched Meme Matrix";

//   try {
//     const geminiPrompt = `Write a short meme caption and a cyberpunk vibe for these tags: ${tags.join(", ")}.\n\nFormat:\nCaption: ...\nVibe: ...`;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: geminiPrompt }],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();

//     const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     console.log("🧠 Gemini output:", output);

//     // Parse caption and vibe
//     const captionMatch = output.match(/Caption:\s*(.*)/i);
//     const vibeMatch = output.match(/Vibe:\s*(.*)/i);
//     caption = captionMatch ? captionMatch[1] : caption;
//     vibe = vibeMatch ? vibeMatch[1] : vibe;
//   } catch (error) {
//     console.warn("⚠️ Gemini API failed:", error.message);
//   }

//   // Save to Supabase
//   const { data, error } = await supabase
//     .from("memes")
//     .insert([
//       {
//         title,
//         image_url: imageUrl,
//         tags,
//         upvotes: 0,
//         caption,
//         vibe,
//       },
//     ])
//     .select()
//     .single();

//   if (error) {
//     console.error("❌ Supabase insert error:", error);
//     return res.status(500).json({ error: "Failed to create meme" });
//   }

//   res.status(201).json({
//     id: data.id,
//     title: data.title,
//     imageUrl: data.image_url,
//     tags: data.tags,
//     upvotes: data.upvotes,
//     caption: data.caption,
//     vibe: data.vibe,
//   });
// });



// app.get("/memes", async (req, res) => {
//   const { data, error } = await supabase
//     .from("memes")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Error fetching memes:", error);
//     return res.status(500).json({ error: "Failed to fetch memes" });
//   }

//   // ✅ Use the formatted version here
//   const formattedMemes = data.map((meme) => ({
//     id: meme.id,
//     title: meme.title,
//     imageUrl: meme.image_url,
//     tags: meme.tags || [], // ← ensures it's always an array
//     upvotes: meme.upvotes,
//   }));

//   res.json(formattedMemes);
// });

// app.post("/memes/:id/upvote", async (req, res) => {
//   const memeId = req.params.id;

//   // Fetch current upvotes
//   const { data: memeData, error: fetchError } = await supabase
//     .from("memes")
//     .select("upvotes")
//     .eq("id", memeId)
//     .single();

//   if (fetchError) {
//     console.error("❌ Failed to fetch meme:", fetchError);
//     return res.status(404).json({ error: "Meme not found" });
//   }

//   const newUpvotes = (memeData.upvotes || 0) + 1;

//   // Update upvotes
//   const { data, error } = await supabase
//     .from("memes")
//     .update({ upvotes: newUpvotes })
//     .eq("id", memeId)
//     .select()
//     .single();

//   if (error) {
//     console.error("❌ Error updating upvotes:", error);
//     return res.status(500).json({ error: "Upvote failed" });
//   }

//   res.json({ id: data.id, upvotes: data.upvotes });
// });

// app.get("/leaderboard", async (req, res) => {
//   const { data, error } = await supabase
//     .from("memes")
//     .select("*")
//     .order("upvotes", { ascending: false })
//     .limit(10);

//   if (error) {
//     console.error("❌ Leaderboard error:", error);
//     return res.status(500).json({ error: "Failed to load leaderboard" });
//   }

//   const formatted = data.map((meme) => ({
//     id: meme.id,
//     title: meme.title,
//     upvotes: meme.upvotes || 0,
//   }));

//   res.json(formatted);
// });

// // Handle incoming bids

// app.post("/memes/:id/bid", async (req, res) => {
//   const memeId = req.params.id;
//   const { credits } = req.body;
//   const userId = "cyberpunk420"; // hardcoded for now

//   const { data, error } = await supabase
//     .from("bids")
//     .insert([{ meme_id: memeId, user_id: userId, credits }])
//     .select()
//     .single();

//   if (error) {
//     console.error("❌ Error placing bid:", error);
//     return res.status(500).json({ error: "Bid failed" });
//   }

//   // Broadcast via Socket.IO
//   io.emit("new-bid", {
//     memeId,
//     user: userId,
//     credits,
//   });

//   res.status(201).json(data);
// });

// app.get("/bids/highest/:memeId", async (req, res) => {
//   const { memeId } = req.params;

//   const { data, error } = await supabase
//     .from("bids")
//     .select("credits")
//     .eq("meme_id", memeId)
//     .order("credits", { ascending: false })
//     .limit(1);

//   if (error) {
//     return res.status(500).json({ error: "Failed to fetch bid" });
//   }

//   const highestBid = data.length > 0 ? data[0].credits : 0;
//   res.json({ highestBid });
// });



// server.listen(PORT, () => {
//   console.log(`⚡ Server with Socket.IO running at http://localhost:${PORT}`);
// });
