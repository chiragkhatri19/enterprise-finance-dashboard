import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRoleFilteredData } from "@/lib/mockData";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/roleStore";
import { formatINR, formatDate } from "@/lib/formatters";
import { CATEGORY_LABELS, CATEGORY_COLORS, type TransactionCategory } from "@/types";
import { ArrowRight } from "lucide-react";

export function RecentTransactions() {
  const { selectedAccountId } = useAccountStore();
  const { role } = useRoleStore();
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);
  
  const navigate = useNavigate();
  const recent = useMemo(() => {
    const txns = selectedAccountId === "all" ? filteredData.transactions : filteredData.transactions.filter((t) => t.accountId === selectedAccountId);
    return txns.slice(0, 10);
  }, [selectedAccountId, filteredData.transactions]);

  return (
    <motion.div 
      className="rounded-2xl border theme-transition relative overflow-hidden"
      style={{ 
        background: "var(--z-bg-surface)",
        borderColor: "var(--z-border)",
        boxShadow: "var(--z-shadow-card)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glassmorphism highlight */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)"
        }}
      />
      
      <div className="flex items-center justify-between p-6 pb-3">
        <h3 className="font-display text-sm font-semibold" style={{ color: "var(--z-text-primary)" }}>Recent Transactions</h3>
        <motion.button 
          onClick={() => navigate("/transactions")} 
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--z-accent)" }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
        >
          View All <ArrowRight className="h-3 w-3" />
        </motion.button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid var(--z-border)` }}>
              {["Date", "Narration", "Category", "Amount"].map((h) => (
                <th key={h} className="px-5 py-2 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((txn, index) => {
              const account = filteredData.accounts.find((a) => a.id === txn.accountId);
              return (
                <motion.tr 
                  key={txn.id} 
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: `1px solid var(--z-border)` }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.01, backgroundColor: "var(--z-bg-hover)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--z-bg-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--z-text-secondary)" }}>{formatDate(txn.date)}</td>
                  <td className="px-5 py-3">
                    <div className="text-xs font-medium truncate max-w-[280px]" style={{ color: "var(--z-text-primary)" }}>{txn.narration}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--z-text-muted)" }}>{account?.bankName} · {txn.referenceNo}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: `${CATEGORY_COLORS[txn.category]}15`, color: CATEGORY_COLORS[txn.category], border: `1px solid ${CATEGORY_COLORS[txn.category]}30` }}>
                      {CATEGORY_LABELS[txn.category as TransactionCategory]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="font-mono text-sm font-medium" style={{ color: txn.type === "credit" ? "var(--z-green)" : "var(--z-text-primary)" }}>
                      {txn.type === "credit" ? "+" : "-"}{formatINR(txn.amount)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
