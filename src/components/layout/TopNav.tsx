import { Menu, ChevronDown, UserCog, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useRoleStore } from "@/store/roleStore";
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccountStore } from "@/store/accountStore";
import { getRoleFilteredData } from "@/lib/mockData";
import { formatINR } from "@/lib/formatters";
import { useMemo, useState } from "react";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcuts";

const ROUTE_NAMES: Record<string, string> = { "/": "Dashboard", "/transactions": "Transactions", "/insights": "Insights", "/settings": "Settings" };

export function TopNav({ onMenuClick, sidebarCollapsed }: { onMenuClick: () => void; sidebarCollapsed: boolean }) {
  const location = useLocation();
  const { role, setRole } = useRoleStore();
  const { selectedAccountId, setSelectedAccountId } = useAccountStore();
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const pageName = ROUTE_NAMES[location.pathname] || "Page";

  const roleColor = role === "admin" ? "var(--z-accent)" : role === "accountant" ? "var(--z-teal)" : "var(--z-yellow)";
  
  // Get current account label for mobile dropdown
  const currentAccount = selectedAccountId === "all" 
    ? null
    : filteredData.accounts.find(a => a.id === selectedAccountId);
  const currentLabel = selectedAccountId === "all" 
    ? "All Accounts" 
    : currentAccount 
      ? `${currentAccount.bankName} ${currentAccount.accountNumberMasked.slice(-4)}`
      : "Select Account";
  const currentBalance = selectedAccountId === "all"
    ? formatINR(filteredData.accounts.reduce((s, a) => s + a.balance, 0), true)
    : currentAccount 
      ? formatINR(currentAccount.balance, true)
      : "₹0";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 lg:px-6 theme-transition"
      style={{ background: "var(--z-bg-nav)", borderColor: "var(--z-border)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="md:hidden"
          style={{ color: "var(--z-text-secondary)" }}
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* Logo - Only show when sidebar is collapsed */}
        {sidebarCollapsed && (
          <img 
            src="/zorvynfulllogolight.png" 
            alt="Zorvyn" 
            className="h-7 hidden md:block"
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        {/* Mobile: Dropdown | Desktop: Tabs */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={{ 
                  background: "var(--z-bg-surface-2)",
                  color: "var(--z-text-secondary)",
                  border: "1px solid var(--z-border)"
                }}
              >
                <span className="font-display max-w-[120px] truncate">{currentLabel}</span>
                <span className="font-mono text-[10px] opacity-70">{currentBalance}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => setSelectedAccountId("all")}
                className={selectedAccountId === "all" ? "bg-accent/10 text-accent" : ""}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-xs">All Accounts</span>
                  <span className="font-mono text-[10px] opacity-70">
                    {formatINR(filteredData.accounts.reduce((s, a) => s + a.balance, 0), true)}
                  </span>
                </div>
              </DropdownMenuItem>
              {filteredData.accounts.map((account) => (
                <DropdownMenuItem
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={selectedAccountId === account.id ? "bg-accent/10 text-accent" : ""}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span 
                        className="h-2 w-2 rounded-full" 
                        style={{ background: account.color }}
                      />
                      <span className="font-display text-xs">
                        {account.bankName} {account.accountNumberMasked.slice(-4)}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] opacity-70">
                      {formatINR(account.balance, true)}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden lg:block"><AccountSwitcher /></div>
        <AnimatedThemeToggler className="scale-75" />
        <NotificationDropdown />
        
        {/* Keyboard Shortcuts Help Button */}
        <button 
          onClick={() => setShowShortcuts(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:opacity-80"
          style={{ background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)" }}
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        
        {/* Role Switcher Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-display font-semibold uppercase tracking-wider transition-all hover:opacity-80"
              style={{ 
                background: "var(--z-accent-muted)", 
                color: roleColor, 
                border: `1px solid var(--z-border-accent)` 
              }}
            >
              <UserCog className="h-3.5 w-3.5" />
              <span>{role}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => setRole("viewer")}
              className={role === "viewer" ? "bg-accent/10 text-accent" : ""}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-xs font-semibold">Viewer</span>
                <span className="text-[10px] opacity-70">Limited access, masked data</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setRole("accountant")}
              className={role === "accountant" ? "bg-accent/10 text-accent" : ""}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-xs font-semibold">Accountant</span>
                <span className="text-[10px] opacity-70">Standard access, full transactions</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setRole("admin")}
              className={role === "admin" ? "bg-accent/10 text-accent" : ""}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-xs font-semibold">Admin</span>
                <span className="text-[10px] opacity-70">Full access, all data</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-display font-bold"
          style={{ background: "var(--z-accent-muted)", color: "var(--z-accent)" }}>ZA</div>
      </div>
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </header>
  );
}
