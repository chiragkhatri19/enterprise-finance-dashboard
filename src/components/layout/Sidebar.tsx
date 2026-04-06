import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, LineChart, Settings, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { memo, useMemo } from "react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/insights", icon: LineChart, label: "Insights" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Memoized nav item component to prevent unnecessary re-renders
const NavItem = memo(function NavItem({ 
  item, 
  isActive, 
  collapsed 
}: { 
  item: typeof NAV_ITEMS[0]; 
  isActive: boolean; 
  collapsed: boolean;
}) {
  const navContent = (
    <NavLink to={item.to}
      className={cn("relative flex items-center rounded-lg text-[13px] font-medium transition-colors duration-150",
        collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5")}
      style={isActive
        ? { background: "var(--z-accent-muted)", color: "var(--z-accent)" }
        : { color: "var(--z-text-secondary)" }}>
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style={{ width: 3, height: 20, background: "var(--z-accent)" }} />
      )}
      <item.icon className={cn("shrink-0", collapsed ? "h-[18px] w-[18px]" : "h-[16px] w-[16px]")} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip key={item.to} delayDuration={200}>
        <TooltipTrigger asChild>{navContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-display text-xs"
          style={{ background: "var(--z-bg-surface-3)", color: "var(--z-text-primary)", border: `1px solid var(--z-border-medium)` }}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }
  return navContent;
});

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <aside
      className={cn("fixed left-0 top-0 z-40 flex h-screen flex-col transition-all duration-300 theme-transition")}
      style={{
        width: collapsed ? 64 : 240,
        background: "var(--z-bg-nav)",
        borderRight: "1px solid var(--z-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-14 items-center border-b shrink-0 transition-all duration-300"
        style={{ borderColor: "var(--z-border)" }}
      >
        {!collapsed ? (
          <div className="flex-1 px-4 flex items-center justify-center">
            <img 
              src="/zorvynfulllogolight.png" 
              alt="Zorvyn" 
              className="h-8"
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--z-accent)", color: "white" }}
            >
              Z
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-4 space-y-1", collapsed ? "px-2" : "px-3")}>
        {NAV_ITEMS.map((item) => (
          <NavItem 
            key={item.to} 
            item={item} 
            isActive={location.pathname === item.to}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={cn("shrink-0 border-t space-y-2", collapsed ? "px-2 py-3" : "px-3 py-4")}
        style={{ borderColor: "var(--z-border)" }}>

        {/* Theme Toggle */}
        {!collapsed ? (
          <button onClick={toggleTheme}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:opacity-80"
            style={{ background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)" }}>
            {theme === "dark" ? <Sun className="h-4 w-4" style={{ color: "var(--z-yellow)" }} /> : <Moon className="h-4 w-4" style={{ color: "var(--z-accent)" }} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        ) : (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg mx-auto transition-all hover:opacity-80"
                style={{ background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)" }}>
                {theme === "dark" ? <Sun className="h-4 w-4" style={{ color: "var(--z-yellow)" }} /> : <Moon className="h-4 w-4" style={{ color: "var(--z-accent)" }} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" style={{ background: "var(--z-bg-surface-3)", color: "var(--z-text-primary)", border: `1px solid var(--z-border-medium)` }}>
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Collapse Button + User Avatar */}
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
          {!collapsed && (
            <button onClick={onToggle}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:opacity-80"
              style={{ background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)" }}>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </button>
          )}
          {collapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button onClick={onToggle}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:opacity-80"
                  style={{ background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)" }}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" style={{ background: "var(--z-bg-surface-3)", color: "var(--z-text-primary)", border: `1px solid var(--z-border-medium)` }}>
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
}
