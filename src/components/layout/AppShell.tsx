import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { motion, AnimatePresence } from "framer-motion";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-shell flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Spacer for fixed sidebar */}
      <div
        className="hidden md:block shrink-0 transition-all duration-300"
        style={{ width: sidebarCollapsed ? 64 : 240 }}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopNav
          onMenuClick={() => setMobileMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Nav */}
      <MobileNav open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
}
