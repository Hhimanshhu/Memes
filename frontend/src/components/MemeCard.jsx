import React from "react";

export default function MemeCard({ meme, bidInputs, setBidInputs, onUpvote, onBid }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-md hover:shadow-neon-pink transition duration-300 p-4 flex flex-col h-full animate-fade-in">
      <img
        src={meme.imageUrl}
        alt={meme.title}
        className="w-full h-48 object-cover rounded-xl shadow-sm"
      />

      <div className="mt-4 flex flex-col justify-between flex-1">
        <h3 className="text-xl font-semibold text-neon-cyan mb-1 line-clamp-1">
          {meme.title}
        </h3>

        <p className="text-sm italic mb-2 text-gray-600 dark:text-gray-400 line-clamp-2">
          "{meme.caption || 'No caption'}"
        </p>

        <p className="text-xs mb-1 text-gray-600 dark:text-gray-400">
          🧠 Vibe: <span className="text-neon-yellow">{meme.vibe || "Unknown"}</span>
        </p>

        <p className="text-xs mb-2 text-pink-600 dark:text-pink-400">
          Tags: {Array.isArray(meme.tags) ? meme.tags.join(", ") : "none"}
        </p>

        <p className="text-sm font-medium text-yellow-600 dark:text-yellow-300">
          💰 Highest Bid: {meme.highestBid || 0} credits
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onUpvote(meme.id)}
            className="flex-1 bg-neon-green text-black font-bold py-2 rounded-md hover:bg-green-400 transition"
          >
            👍 {meme.upvotes || 0}
          </button>

          <input
            type="number"
            placeholder="Bid"
            className="w-20 text-center bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={bidInputs[meme.id] || ""}
            onChange={(e) =>
              setBidInputs({ ...bidInputs, [meme.id]: e.target.value })
            }
          />

          <button
            onClick={() => onBid(meme.id)}
            className="px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
          >
            💸
          </button>
        </div>
      </div>
    </div>
  );
}
