import { useState } from "react";

export default function MemeForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const meme = {
      title,
      imageUrl: imageUrl || "https://picsum.photos/300",
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const response = await fetch(`${ import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/backend/save-memes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meme),
      });

      const data = await response.json();
      onCreate(data);
    } catch (error) {
      console.error("❌ Error submitting meme:", error);
    }

    setTitle("");
    setImageUrl("");
    setTags("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-12 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 shadow-lg rounded-2xl px-6 py-8 space-y-6 animate-fade-in"
    >
      <h2 className="text-3xl font-bold text-center text-neon-pink glitch-hover">
        🚀 Submit Your Meme
      </h2>

      <input
        type="text"
        placeholder="Meme Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-pink"
      />

      <input
        type="url"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-cyan"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
      />

      <button
        type="submit"
        className="w-full bg-neon-green text-black font-bold py-3 rounded-md hover:bg-green-400 transition"
      >
        ✨ Create Meme
      </button>
    </form>
  );
}
