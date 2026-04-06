import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme from localStorage before render
const stored = localStorage.getItem("zorvyn:theme");
if (stored) {
  try {
    const { state } = JSON.parse(stored);
    if (state?.theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  } catch {
    document.documentElement.classList.add("dark");
  }
} else {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
