import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/roleStore";
import { getRoleFilteredData } from "@/lib/mockData";
import { formatINR } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function AccountSwitcher() {
  const { selectedAccountId, setSelectedAccountId } = useAccountStore();
  const { role } = useRoleStore();
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);
  
  const tabs = [
    { id: "all" as const, label: "All Accounts", balance: filteredData.accounts.reduce((s, a) => s + a.balance, 0) },
    ...filteredData.accounts.map((a) => ({ id: a.id, label: `${a.bankName} ${a.accountNumberMasked.slice(-4)}`, balance: a.balance })),
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "var(--z-bg-surface-2)" }}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => setSelectedAccountId(tab.id)}
          className="rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200"
          style={selectedAccountId === tab.id
            ? { background: "var(--z-accent-muted)", color: "var(--z-accent)", border: `1px solid var(--z-border-accent)` }
            : { color: "var(--z-text-secondary)", border: "1px solid transparent" }}>
          <span className="font-display">{tab.label}</span>
          <span className="ml-1.5 font-mono text-[10px] opacity-70">{formatINR(tab.balance, true)}</span>
        </button>
      ))}
    </div>
  );
}
