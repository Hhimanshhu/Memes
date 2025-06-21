import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="fixed top-5 right-5 z-50 bg-zinc-900 text-white dark:bg-white dark:text-black border border-zinc-500 dark:border-zinc-300 px-4 py-2 rounded-lg shadow-md hover:shadow-neon-cyan transition duration-200"
    >
      {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
