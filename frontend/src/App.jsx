import { useState, useEffect } from "react";
import socket from "./socket";
import MemeForm from "./components/MemeForm";
import Leaderboard from "./components/Leaderboard";
import MemeCard from "./components/MemeCard";
import Navbar from "./components/Navbar";

function App() {
  const [memes, setMemes] = useState([]);
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);
  const [bidInputs, setBidInputs] = useState({});

  useEffect(() => {
    const loadMemes = async () => {
      const res = await fetch("http://localhost:5000/backend/memes");
      const memes = await res.json();

      const memesWithBids = await Promise.all(
        memes.map(async (meme) => {
          try {
            const bidRes = await fetch(
              `http://localhost:5000/backend/bids/highest/${meme.id}`
            );
            const bidData = await bidRes.json();
            return { ...meme, highestBid: bidData.highestBid };
          } catch {
            return { ...meme, highestBid: 0 };
          }
        })
      );

      setMemes(memesWithBids);
    };

    loadMemes();

    socket.on("new-bid", (data) => {
      setMemes((prev) =>
        prev.map((meme) =>
          meme.id === data.memeId
            ? {
                ...meme,
                highestBid:
                  data.credits > (meme.highestBid || 0)
                    ? data.credits
                    : meme.highestBid,
              }
            : meme
        )
      );
    });

    return () => socket.off("new-bid");
  }, []);

  const handleCreate = async (meme) => {
    try {
      const bidRes = await fetch(
        `http://localhost:5000/backend/bids/highest/${meme.id}`
      );
      const bidData = await bidRes.json();
      setMemes([...memes, { ...meme, highestBid: bidData.highestBid }]);
    } catch {
      setMemes([...memes, { ...meme, highestBid: 0 }]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gradient-to-br dark:from-black dark:via-zinc-900 dark:to-black dark:text-white font-orbitron px-6 py-4 transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Meme Form */}
      <section className="py-10 bg-zinc-50 dark:bg-zinc-900 rounded-2xl shadow-inner mb-12">
        <MemeForm onCreate={handleCreate} />
      </section>

      {/* Leaderboard */}
      <section className="py-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-inner mb-16">
        <Leaderboard refreshTrigger={refreshLeaderboard} />
      </section>

      {/* Memes Grid */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {memes.map((meme) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            bidInputs={bidInputs}
            setBidInputs={setBidInputs}
            onUpvote={async (id) => {
              const res = await fetch(
                `http://localhost:5000/backend/memes/${id}/upvote`,
                {
                  method: "POST",
                }
              );
              const updated = await res.json();
              setMemes(
                memes.map((m) =>
                  m.id === id ? { ...m, upvotes: updated.upvotes } : m
                )
              );
              setRefreshLeaderboard((prev) => !prev);
            }}
            onBid={async (id) => {
              const amount = parseInt(bidInputs[id]);
              if (!amount || isNaN(amount) || amount <= 0) {
                alert("Invalid bid");
                return;
              }
              await fetch(`http://localhost:5000/backend/memes/${id}/bid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credits: amount }),
              });
            }}
          />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm text-gray-400 border-t border-zinc-600 pt-6">
        © 2025 MemeHustle — Powered by React + Tailwind + Bootstrap
      </footer>
    </div>
  );
}

export default App;
