import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { memo } from "react";

interface AnimatedThemeTogglerProps {
  onClick?: () => void;
  className?: string;
}

export const AnimatedThemeToggler = memo(function AnimatedThemeToggler({ onClick, className = "" }: AnimatedThemeTogglerProps) {
  const { theme, toggleTheme } = useThemeStore();
  
  const handleClick = () => {
    toggleTheme();
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden ${className}`}
      style={{
        background: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
      }}
    >
      {/* Background - static */}
      <div
        className="absolute inset-0"
        style={{
          background: theme === "dark" 
            ? "rgba(42,90,214,0.15)"
            : "rgba(245,158,11,0.15)",
        }}
      />

      {/* Icon - simple fade */}
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10"
          >
            <Sun className="h-[18px] w-[18px]" style={{ color: "#F59E0B" }} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10"
          >
            <Moon className="h-[18px] w-[18px]" style={{ color: "#8B7CF8" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});
