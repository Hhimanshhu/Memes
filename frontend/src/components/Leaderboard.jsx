import { useEffect, useState } from "react";

export default function Leaderboard({ refreshTrigger }) {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/backend/leaderboard")
      .then((res) => res.json())
      .then((data) => setTopMemes(data))
      .catch((err) => console.error("Leaderboard error:", err));
  }, [refreshTrigger]);

  return (
    <section className="mt-20 max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-neon-yellow glitch-hover">
          🔥 Top Hustlers
        </h2>

        <ol className="space-y-4">
          {topMemes.map((meme, idx) => (
            <li
              key={meme.id}
              className={`flex justify-between items-center px-4 py-2 rounded-md border transition ${
                idx === 0
                  ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 text-yellow-700 dark:text-yellow-300 font-bold"
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-black dark:text-white"
              }`}
            >
              <span className="text-lg">#{idx + 1}</span>
              <span className="flex-1 text-center font-medium truncate text-neon-cyan">
                {meme.title}
              </span>
              <span className="text-sm text-pink-600 dark:text-pink-400">
                🔺 {meme.upvotes} upvotes
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
