import { NavLink } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, LineChart, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/insights", icon: LineChart, label: "Insights" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-full w-64 border-r"
            style={{ background: "var(--z-bg-nav)", borderColor: "var(--z-border)" }}>
            <div className="flex h-14 items-center justify-between px-4 border-b" style={{ borderColor: "var(--z-border)" }}>
              <img src="/zorvynfulllogolight.png" alt="Zorvyn" className="h-8" />
              <button onClick={onClose} style={{ color: "var(--z-text-secondary)" }}><X className="h-5 w-5" /></button>
            </div>
            <nav className="p-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={onClose}
                  className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors")}
                  style={({ isActive }) => isActive
                    ? { background: "var(--z-accent-muted)", color: "var(--z-accent)" }
                    : { color: "var(--z-text-secondary)" }}>
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
