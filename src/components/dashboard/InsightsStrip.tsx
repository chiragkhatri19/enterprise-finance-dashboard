import { useMemo } from "react";
import { getAnomalies } from "@/lib/mockData";
import { useTransactionStore } from "@/store/transactionStore";
import { formatINR } from "@/lib/formatters";
import { TrendingUp, AlertTriangle, Gauge, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export function InsightsStrip() {
  const { transactions } = useTransactionStore();
  
  const insights = useMemo(() => {
    const debits = transactions.filter((t) => t.type === "debit");
    const catSpend: Record<string, number> = {};
    debits.forEach((t) => { catSpend[t.category] = (catSpend[t.category] || 0) + t.amount; });
    const topCat = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];
    const monthlyDebits: Record<string, number> = {};
    debits.forEach((t) => { const m = t.date.slice(0, 7); monthlyDebits[m] = (monthlyDebits[m] || 0) + t.amount; });
    const months = Object.keys(monthlyDebits).sort();
    const lastMonth = monthlyDebits[months[months.length - 1]] || 0;
    const prevMonth = monthlyDebits[months[months.length - 2]] || 1;
    const momChange = ((lastMonth - prevMonth) / prevMonth) * 100;
    const anomalies = getAnomalies();
    const totalBalance = 4723540 + 1865200 + 980000;
    const avgBurn = months.slice(-3).reduce((s, m) => s + (monthlyDebits[m] || 0), 0) / 3;
    const runwayDays = Math.floor((totalBalance / avgBurn) * 30);

    return [
      { icon: BarChart3, label: "Top Category", value: topCat ? topCat[0].replace("_", " ") : "—", sub: topCat ? formatINR(topCat[1], true) : "", color: "#8B7CF8" },
      { icon: TrendingUp, label: "MoM Spend Change", value: `${momChange >= 0 ? "+" : ""}${momChange.toFixed(1)}%`, sub: "vs prior month", color: momChange >= 0 ? "#F05252" : "#14D9A4" },
      { icon: AlertTriangle, label: "Anomalies", value: `${anomalies.length}`, sub: "flagged items", color: "#F59E0B" },
      { icon: Gauge, label: "Cash Runway", value: `${runwayDays} days`, sub: "at current burn", color: runwayDays > 180 ? "#14D9A4" : runwayDays > 90 ? "#F59E0B" : "#F05252" },
    ];
  }, [transactions]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {insights.map((item, i) => (
        <motion.div 
          key={item.label} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.03, duration: 0.2 }}
          className="rounded-xl border px-4 py-3 flex items-center gap-3 theme-transition relative overflow-hidden"
          style={{ 
            background: "var(--z-bg-surface)",
            borderColor: "var(--z-border)",
            boxShadow: "var(--z-shadow-card)"
          }}
        >
          
          {/* Top highlight */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, var(--z-card-highlight) 50%, transparent 100%)"
            }}
          />
          <div 
            className="rounded-lg p-2"
            style={{ background: `${item.color}15` }}
          >
            <item.icon className="h-4 w-4" style={{ color: item.color }} />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>{item.label}</p>
            <p className="text-sm font-display font-bold capitalize" style={{ color: "var(--z-text-primary)" }}>{item.value}</p>
            <p className="text-[10px]" style={{ color: "var(--z-text-secondary)" }}>{item.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
