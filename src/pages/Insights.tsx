import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { MOCK_ACCOUNTS, getAnomalies, getRoleFilteredData } from "@/lib/mockData";
import { formatINR } from "@/lib/formatters";
import { CATEGORY_LABELS, ROLE_PERMISSIONS, type TransactionCategory, type UserRole } from "@/types";
import { AlertTriangle, ShieldCheck, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/roleStore";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { BarChartTooltip, LineChartTooltip } from "@/components/charts/CustomTooltip";

export default function InsightsPage() {
  const navigate = useNavigate();
  const { selectedAccountId } = useAccountStore();
  const { role } = useRoleStore();
  const permissions = ROLE_PERMISSIONS[role];
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Get role-filtered data
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);
  const { transactions: roleTransactions } = filteredData;

  // ALL hooks must be called BEFORE conditional return
  const momData = useMemo(() => {
    const categories: TransactionCategory[] = ["salaries", "vendor_payments", "saas_subscriptions", "marketing", "travel_expense", "utilities", "taxes_compliance"];
    return categories.map((cat) => {
      const feb = roleTransactions.filter((t) => t.date.startsWith("2025-02") && t.type === "debit" && t.category === cat).reduce((s, t) => s + t.amount, 0);
      const mar = roleTransactions.filter((t) => t.date.startsWith("2025-03") && t.type === "debit" && t.category === cat).reduce((s, t) => s + t.amount, 0);
      return { category: CATEGORY_LABELS[cat].split(" ")[0], feb, mar };
    });
  }, [roleTransactions]);

  const topVendors = useMemo(() => {
    const vendorSpend: Record<string, number> = {};
    roleTransactions.filter((t) => t.type === "debit" && t.vendorName).forEach((t) => { vendorSpend[t.vendorName!] = (vendorSpend[t.vendorName!] || 0) + t.amount; });
    const maxSpend = Math.max(...Object.values(vendorSpend));
    return Object.entries(vendorSpend).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, amount]) => ({ name, amount, pct: (amount / maxSpend) * 100 }));
  }, [roleTransactions]);

  const categoryTrend = useMemo(() => {
    const months = ["2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03"];
    const cats: TransactionCategory[] = ["salaries", "vendor_payments", "marketing"];
    return months.map((m) => {
      const row: Record<string, string | number> = { month: m.slice(5) + "/" + m.slice(2, 4) };
      cats.forEach((c) => { row[c] = roleTransactions.filter((t) => t.date.startsWith(m) && t.type === "debit" && t.category === c).reduce((s, t) => s + t.amount, 0); });
      return row;
    });
  }, [roleTransactions]);

  const runway = useMemo(() => {
    const totalBalance = selectedAccountId === "all" 
      ? filteredData.accounts.reduce((s, a) => s + a.balance, 0)
      : (filteredData.accounts.find((a) => a.id === selectedAccountId)?.balance || 0);
    
    const txns = selectedAccountId === "all" 
      ? roleTransactions 
      : roleTransactions.filter((t) => t.accountId === selectedAccountId);
    
    // Use last 3 months with actual data (dynamic)
    const allMonths = [...new Set(txns.map((t) => t.date.slice(0, 7)))].sort();
    const last3Months = allMonths.slice(-3);
    
    const burns = last3Months.map((m) => 
      txns.filter((t) => t.date.startsWith(m) && t.type === "debit").reduce((s, t) => s + t.amount, 0)
    );
    const avgMonthlyBurn = burns.reduce((s, b) => s + b, 0) / burns.length;
    const runwayMonths = avgMonthlyBurn > 0 ? Math.floor(totalBalance / avgMonthlyBurn) : Infinity;
    const runwayDays = runwayMonths === Infinity ? Infinity : Math.floor(runwayMonths * 30);
    
    return { totalBalance, avgMonthlyBurn, runwayDays, runwayMonths };
  }, [selectedAccountId, roleTransactions, filteredData]);

  const anomalies = useMemo(() => {
    const rawAnomalies = getAnomalies();
    return rawAnomalies
      .map((a) => ({ ...a, txn: roleTransactions.find((t) => t.id === a.transactionId) }))
      .filter((a) => a.txn !== undefined);
  }, [roleTransactions]);

  if (isLoading) {
    console.log('Insights: Rendering skeleton');
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <Skeleton variant="text" width={180} height={32} />
        <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <Skeleton variant="text" width={180} height={24} className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height={260} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
            <Skeleton variant="text" width={150} height={24} className="mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={80} height={20} />
                  </div>
                  <Skeleton variant="rectangular" width="100%" height={6} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
            <Skeleton variant="text" width={160} height={24} className="mb-4" />
            <Skeleton variant="rectangular" width="100%" height={280} />
          </div>
        </div>
        <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <div className="flex items-center gap-3 mb-4">
            <Skeleton variant="rectangular" width={40} height={40} />
            <div>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={200} height={16} className="mt-1" />
            </div>
          </div>
          <Skeleton variant="text" width={150} height={48} className="mb-3" />
          <Skeleton variant="rectangular" width="100%" height={12} className="mb-3" />
          <div className="flex gap-6">
            <Skeleton variant="text" width={180} height={20} />
            <Skeleton variant="text" width={180} height={20} />
          </div>
        </div>
        <div className="rounded-2xl border p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <Skeleton variant="text" width={140} height={24} className="mb-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-3" style={{ background: "var(--z-bg-surface-2)", border: "1px solid var(--z-border)" }}>
                <Skeleton variant="rectangular" width={20} height={20} />
                <div className="flex-1 space-y-1">
                  <Skeleton variant="text" width={200} height={16} />
                  <Skeleton variant="text" width={150} height={14} />
                </div>
                <Skeleton variant="text" width={80} height={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log('Insights: Rendering actual content');

  const runwayColor = runway.runwayDays > 180 ? "var(--z-green)" : runway.runwayDays > 90 ? "var(--z-yellow)" : "var(--z-red)";

  const cardStyle = { background: "var(--z-bg-surface)", borderColor: "var(--z-border)" };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <h1 className="font-display text-xl font-bold" style={{ color: "var(--z-text-primary)" }}>Insights</h1>

      <div className="rounded-xl border p-5 theme-transition" style={cardStyle}>
        <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Month-over-Month Comparison</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={momData} barGap={4}>
            <CartesianGrid stroke="var(--z-chart-grid)" strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fill: "var(--z-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--z-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} width={65} />
            <Tooltip 
              content={<BarChartTooltip />} 
              cursor={{ stroke: 'var(--z-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Legend wrapperStyle={{ color: "var(--z-text-secondary)", fontSize: "11px" }} />
            <Bar dataKey="feb" name="Feb '25" fill="#8B7CF8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mar" name="Mar '25" fill="#3D6EFA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border p-5 theme-transition" style={cardStyle}>
          <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Top 10 Vendors</h3>
          <div className="space-y-3">
            {topVendors.map((v, i) => (
              <div key={v.name} className="flex items-center gap-3">
                <span className="text-[10px] font-mono w-4 text-right" style={{ color: "var(--z-text-muted)" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs truncate" style={{ color: "var(--z-text-primary)" }}>{v.name}</span>
                    <span className="font-mono text-xs" style={{ color: "var(--z-text-secondary)" }}>{formatINR(v.amount, true)}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--z-bg-surface-2)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${v.pct}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #3D6EFA, #14D9A4)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5 theme-transition" style={cardStyle}>
          <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Category Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={categoryTrend}>
              <CartesianGrid stroke="var(--z-chart-grid)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "var(--z-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--z-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatINR(v, true)} width={65} />
              <Tooltip 
                content={<LineChartTooltip />} 
                cursor={{ stroke: 'var(--z-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Legend wrapperStyle={{ color: "var(--z-text-secondary)", fontSize: "11px" }} />
              <Line type="monotone" dataKey="salaries" name="Salaries" stroke="#8B7CF8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="vendor_payments" name="Vendors" stroke="#3D6EFA" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="marketing" name="Marketing" stroke="#14D9A4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border p-5 theme-transition" style={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg p-2" style={{ background: `${runway.runwayDays > 180 ? "var(--z-green-bg)" : runway.runwayDays > 90 ? "var(--z-yellow-bg)" : "var(--z-red-bg)"}` }}>
            <Gauge className="h-5 w-5" style={{ color: runwayColor }} />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold" style={{ color: "var(--z-text-primary)" }}>Cash Runway</h3>
            <p className="text-[11px]" style={{ color: "var(--z-text-muted)" }}>Based on 3-month average burn rate</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-4xl font-bold" style={{ color: runwayColor }}>{runway.runwayDays === Infinity ? "∞" : runway.runwayDays}</span>
          <span className="text-sm" style={{ color: "var(--z-text-secondary)" }}>days remaining</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: "var(--z-bg-surface-2)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (runway.runwayDays === Infinity ? 100 : runway.runwayDays / 365) * 100)}%`, background: runwayColor }} />
        </div>
        <div className="flex gap-6 text-xs" style={{ color: "var(--z-text-secondary)" }}>
          <span>Balance: <span className="font-mono" style={{ color: "var(--z-text-primary)" }}>{formatINR(runway.totalBalance, true)}</span></span>
          <span>Monthly Burn: <span className="font-mono" style={{ color: "var(--z-text-primary)" }}>{formatINR(runway.avgMonthlyBurn, true)}</span></span>
        </div>
      </div>

      <div className="rounded-xl border p-5 theme-transition" style={cardStyle}>
        <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Anomaly Feed</h3>
        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <ShieldCheck className="h-10 w-10 mb-2" style={{ color: "var(--z-green)" }} />
            <p className="font-display font-semibold" style={{ color: "var(--z-text-primary)" }}>All clear</p>
            <p className="text-xs" style={{ color: "var(--z-text-muted)" }}>No anomalies detected for this period</p>
          </div>
        ) : (
          <div className="space-y-2">
            {anomalies.map((a) => (
              <div key={a.transactionId} className="flex items-center gap-3 rounded-lg p-3 transition-colors"
                style={{ background: "var(--z-bg-surface-2)", border: `1px solid var(--z-border)` }}>
                <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: a.severity === "high" ? "var(--z-red)" : "var(--z-yellow)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--z-text-primary)" }}>{a.txn.narration}</p>
                  <p className="text-[10px]" style={{ color: "var(--z-text-muted)" }}>{a.description}</p>
                </div>
                <span className="font-mono text-sm font-medium shrink-0" style={{ color: "var(--z-red)" }}>{formatINR(a.txn.amount)}</span>
                <span className="rounded-md px-2 py-0.5 text-[10px] font-medium shrink-0" style={{ background: "var(--z-yellow-bg)", color: "var(--z-yellow)" }}>
                  {a.reason.replace("_", " ")}
                </span>
                <button onClick={() => navigate("/transactions")} className="text-xs font-medium shrink-0" style={{ color: "var(--z-accent)" }}>Review</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
