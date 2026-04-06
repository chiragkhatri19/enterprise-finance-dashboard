import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getRoleFilteredData } from "@/lib/mockData";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/roleStore";
import { CATEGORY_LABELS, CATEGORY_COLORS, type TransactionCategory } from "@/types";
import { formatINR } from "@/lib/formatters";
import { PieChartTooltip } from "@/components/charts/CustomTooltip";

export function SpendBreakdownChart() {
  const { selectedAccountId } = useAccountStore();
  const { role } = useRoleStore();
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);
  
  const data = useMemo(() => {
    const debits = (selectedAccountId === "all" ? filteredData.transactions : filteredData.transactions.filter((t) => t.accountId === selectedAccountId)).filter((t) => t.type === "debit");
    const byCategory: Record<string, number> = {};
    debits.forEach((t) => { byCategory[t.category] = (byCategory[t.category] || 0) + t.amount; });
    return Object.entries(byCategory).map(([cat, value]) => ({ name: CATEGORY_LABELS[cat as TransactionCategory], value, color: CATEGORY_COLORS[cat as TransactionCategory] })).sort((a, b) => b.value - a.value);
  }, [selectedAccountId, filteredData.transactions]);
  const totalSpend = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div 
      className="rounded-2xl border p-6 theme-transition relative overflow-hidden"
      style={{ 
        background: "var(--z-bg-surface)",
        borderColor: "var(--z-border)",
        boxShadow: "var(--z-shadow-card)"
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      {/* Glassmorphism highlight */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)"
        }}
      />
      
      <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Spend Breakdown</h3>
      <div className="flex flex-col items-center">
        <div className="relative">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={2} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-mono text-lg font-bold" style={{ color: "var(--z-text-primary)" }}>{formatINR(totalSpend, true)}</span>
            <span className="text-[10px]" style={{ color: "var(--z-text-muted)" }}>Total Spend</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 w-full">
          {data.slice(0, 6).map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-[11px]">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="truncate" style={{ color: "var(--z-text-secondary)" }}>{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
