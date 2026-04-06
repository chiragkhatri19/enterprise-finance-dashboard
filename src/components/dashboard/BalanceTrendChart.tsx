import { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getRoleFilteredData } from "@/lib/mockData";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/roleStore";
import { formatINR } from "@/lib/formatters";
import { format, parseISO } from "date-fns";
import { AreaChartTooltip } from "@/components/charts/CustomTooltip";

export function BalanceTrendChart() {
  const { selectedAccountId } = useAccountStore();
  const { role } = useRoleStore();
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);

  console.log('BalanceTrendChart - Current role:', role);
  console.log('BalanceTrendChart - Total transactions from filteredData:', filteredData.transactions.length);

  const chartData = useMemo(() => {
    const months: Record<string, Record<string, number>> = {};
    const txns = selectedAccountId === "all" ? filteredData.transactions : filteredData.transactions.filter((t) => t.accountId === selectedAccountId);
    
    console.log('=== BALANCE TREND CHART DEBUG ===');
    console.log('Total transactions:', txns.length);
    console.log('Selected account:', selectedAccountId);
    
    txns.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!months[month]) months[month] = { credits: 0, debits: 0 };
      if (t.type === "credit") months[month].credits += t.amount;
      else months[month].debits += t.amount;
    });
    
    const sorted = Object.keys(months).sort();
    console.log('Months found:', sorted);
    console.log('Number of months:', sorted.length);
    
    // If no transactions, return empty array
    if (sorted.length === 0) {
      console.warn('BalanceTrendChart: No transaction data found');
      return [];
    }
    
    const runningBalance = selectedAccountId === "all" 
      ? filteredData.accounts.reduce((s, a) => s + a.balance, 0) 
      : (filteredData.accounts.find((a) => a.id === selectedAccountId)?.balance || 0);
    
    console.log('Running balance:', runningBalance);
    
    // Calculate net flow for each month
    const data = sorted.map((month) => {
      const net = months[month].credits - months[month].debits;
      return { 
        month, 
        net, 
        credits: months[month].credits, 
        debits: months[month].debits 
      };
    });
    
    // Calculate starting balance (current balance - all net flows)
    const totalNet = data.reduce((s, d) => s + d.net, 0);
    const baseBalance = runningBalance - totalNet;
    
    console.log('Base balance (starting):', baseBalance);
    console.log('Total net flow:', totalNet);
    
    // Build cumulative balance
    let cumulative = baseBalance;
    const result = data.map((d, idx) => {
      cumulative += d.net;
      const prevBalance = idx > 0 ? cumulative - d.net : cumulative;
      
      return { 
        month: format(parseISO(d.month + "-01"), "MMM ''yy"), 
        balance: Math.round(cumulative), 
        credits: Math.round(d.credits), 
        debits: Math.round(d.debits),
        prevValue: idx > 0 ? Math.round(prevBalance) : null
      };
    });
    
    console.log('Chart data points:', result.length);
    console.log('All chart data:', result);
    console.log('===================================');
    
    return result;
  }, [selectedAccountId, filteredData]);

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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glassmorphism highlight */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, var(--z-card-highlight) 50%, transparent 100%)"
        }}
      />
      
      <h3 className="font-display text-sm font-semibold mb-4" style={{ color: "var(--z-text-primary)" }}>Balance Trend</h3>
      
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[260px]" style={{ color: "var(--z-text-muted)" }}>
          <p className="text-sm">No transaction data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3D6EFA" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3D6EFA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--z-chart-grid)" strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "var(--z-text-muted)", fontSize: 11 }} 
              axisLine={{ stroke: "var(--z-border)" }} 
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "var(--z-text-muted)", fontSize: 11 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(v) => formatINR(v, true)} 
              width={80}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              content={<AreaChartTooltip />} 
              cursor={{ stroke: 'var(--z-accent)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#3D6EFA" 
              strokeWidth={2.5} 
              fill="url(#balanceGrad)" 
              name="Balance"
              animationDuration={1000}
              connectNulls={false}
            />
            <Legend wrapperStyle={{ color: "var(--z-text-secondary)", fontSize: "11px" }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
