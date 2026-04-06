import { useState, useEffect } from "react";
import { useRoleStore } from "@/store/roleStore";
import { MOCK_ACCOUNTS } from "@/lib/mockData";
import { formatINR } from "@/lib/formatters";
import { ROLE_PERMISSIONS, type UserRole } from "@/types";
import { RefreshCw } from "lucide-react";
import { glassStyle, glassHighlight } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsPage() {
  const { role, setRole } = useRoleStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton variant="text" width={150} height={32} />
        
        {/* Appearance skeleton removed - theme toggle is in sidebar only */}

        {/* Role Switcher skeleton */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <Skeleton variant="text" width={120} height={20} className="mb-1" />
          <Skeleton variant="text" width={280} height={14} className="mb-4" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={80} height={36} />
            <Skeleton variant="rectangular" width={80} height={36} />
            <Skeleton variant="rectangular" width={80} height={36} />
          </div>
        </div>

        {/* Accounts skeleton */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <Skeleton variant="text" width={80} height={20} className="mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg p-3" style={{ background: "var(--z-bg-surface-2)", border: "1px solid var(--z-border)" }}>
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={12} height={12} />
                  <div>
                    <Skeleton variant="text" width={150} height={14} />
                    <Skeleton variant="text" width={180} height={12} className="mt-1" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton variant="text" width={100} height={18} />
                  <Skeleton variant="rectangular" width={50} height={18} className="mt-1 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Reset skeleton */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <Skeleton variant="text" width={140} height={20} className="mb-1" />
          <Skeleton variant="text" width={300} height={14} className="mb-4" />
          <Skeleton variant="rectangular" width={150} height={36} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--z-text-primary)" }}>Settings</h1>

      {/* Role Switcher */}
      <div className="rounded-2xl border p-6 theme-transition relative overflow-hidden" style={glassStyle()}>
        {/* Glass highlight */}
        <div style={glassHighlight} />
        
        <h3 className="font-display text-sm font-semibold mb-1" style={{ color: "var(--z-text-primary)" }}>Role Switcher</h3>
        <p className="text-xs mb-4" style={{ color: "var(--z-text-muted)" }}>Switch roles to preview different permission levels</p>
        <div className="flex gap-2">
          {(["viewer", "accountant", "admin"] as UserRole[]).map((r) => (
            <button key={r} onClick={() => setRole(r)}
              className="rounded-lg px-4 py-2 text-xs font-display font-semibold capitalize transition-all"
              style={role === r
                ? { background: "var(--z-accent)", color: "#fff" }
                : { background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)", border: `1px solid var(--z-border)` }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Accounts */}
      <div className="rounded-2xl border p-6 theme-transition relative overflow-hidden" style={glassStyle()}>
        {/* Glass highlight */}
        <div style={glassHighlight} />
        
        <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Accounts</h3>
        <div className="space-y-3">
          {MOCK_ACCOUNTS.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between rounded-lg p-3"
              style={{ background: "var(--z-bg-surface-2)", border: `1px solid var(--z-border)` }}>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ background: acc.color }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--z-text-primary)" }}>{acc.bankName} {acc.accountType}</p>
                  <p className="font-mono text-[10px]" style={{ color: "var(--z-text-muted)" }}>{acc.accountNumberMasked} · {acc.ifsc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium" style={{ color: "var(--z-text-primary)" }}>{formatINR(acc.balance, true)}</p>
                <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: "var(--z-green-bg)", color: "var(--z-green)" }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Reset */}
      <div className="rounded-2xl border p-6 theme-transition relative overflow-hidden" style={glassStyle()}>
        {/* Glass highlight */}
        <div style={glassHighlight} />
        
        <h3 className="font-display text-sm font-semibold mb-1" style={{ color: "var(--z-text-primary)" }}>Data Management</h3>
        <p className="text-xs mb-4" style={{ color: "var(--z-text-muted)" }}>Reset all local overrides and return to default mock data</p>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-display font-semibold transition-colors"
          style={{ background: "var(--z-red-bg)", color: "var(--z-red)", border: `1px solid var(--z-red)30` }}>
          <RefreshCw className="h-3.5 w-3.5" /> Reset to Defaults
        </button>
      </div>
    </div>
  );
}
