import { Wallet, TrendingUp, TrendingDown, ArrowUpDown, Activity, DollarSign, PieChart, BarChart3, Gauge, Flame } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { MOCK_ACCOUNTS, getRoleFilteredData } from "@/lib/mockData";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/roleStore";
import { useTransactionStore } from "@/store/transactionStore";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart";
import { SpendBreakdownChart } from "@/components/dashboard/SpendBreakdownChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const { selectedAccountId } = useAccountStore();
  const { role } = useRoleStore();
  const { transactions } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Get role-filtered data
  const filteredData = useMemo(() => getRoleFilteredData(role), [role]);
  const { accounts: roleAccounts, transactions: roleTransactions } = filteredData;

  // Calculate stats (must be before conditional return)
  const stats = useMemo(() => {
    const txns = selectedAccountId === "all"
      ? roleTransactions
      : roleTransactions.filter((t) => t.accountId === selectedAccountId);

    const balance = selectedAccountId === "all"
      ? roleAccounts.reduce((s, a) => s + a.balance, 0)
      : (roleAccounts.find((a) => a.id === selectedAccountId)?.balance || 0);

    // Get current and previous month dynamically
    const allDates = txns.map((t) => t.date).sort();
    const latestDate = allDates[allDates.length - 1];
    const currentMonth = latestDate.slice(0, 7); // "2025-03"
    
    // Calculate previous month
    const [year, month] = currentMonth.split('-').map(Number);
    const prevMonthDate = new Date(year, month - 2, 1); // -2 because month is 1-indexed and we want previous
    const previousMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
    
    const curMonth = txns.filter((t) => t.date.startsWith(currentMonth));
    const prevMonth = txns.filter((t) => t.date.startsWith(previousMonth));

    const curCredits = curMonth.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    const prevCredits = prevMonth.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    const curDebits = curMonth.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);
    const prevDebits = prevMonth.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

    const incomeDelta = prevCredits ? ((curCredits - prevCredits) / prevCredits) * 100 : 0;
    const expenseDelta = prevDebits ? ((curDebits - prevDebits) / prevDebits) * 100 : 0;
    const netFlow = curCredits - curDebits;
    const prevNet = prevCredits - prevDebits;
    const flowDelta = prevNet ? ((netFlow - prevNet) / Math.abs(prevNet)) * 100 : 0;

    // Calculate runway and burn rate (last 3 months with data)
    const allMonths = [...new Set(txns.map((t) => t.date.slice(0, 7)))].sort();
    const last3Months = allMonths.slice(-3);
    const burns = last3Months.map((m) => 
      txns.filter((t) => t.date.startsWith(m) && t.type === "debit").reduce((s, t) => s + t.amount, 0)
    );
    const avgMonthlyBurn = burns.reduce((s, b) => s + b, 0) / burns.length;
    const runwayMonths = avgMonthlyBurn > 0 ? Math.floor(balance / avgMonthlyBurn) : Infinity;
    const runwayDays = runwayMonths === Infinity ? Infinity : Math.floor(runwayMonths * 30);

    // Generate sparkline data (last 7 days for current month)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const day = 25 + i; // Mar 25-31
      const dateStr = `2025-03-${String(day).padStart(2, '0')}`;
      const dayTxns = txns.filter((t) => t.date === dateStr);
      return dayTxns.reduce((sum, t) => sum + (t.type === "credit" ? t.amount : -t.amount), 0);
    });

    // Income sparkline (last 7 days credits)
    const incomeSparkline = Array.from({ length: 7 }, (_, i) => {
      const day = 25 + i;
      const dateStr = `2025-03-${String(day).padStart(2, '0')}`;
      return txns.filter((t) => t.date === dateStr && t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
    });

    // Expense sparkline (last 7 days debits)
    const expenseSparkline = Array.from({ length: 7 }, (_, i) => {
      const day = 25 + i;
      const dateStr = `2025-03-${String(day).padStart(2, '0')}`;
      return txns.filter((t) => t.date === dateStr && t.type === "debit").reduce((sum, t) => sum + t.amount, 0);
    });

    // Balance trend (cumulative over 7 days)
    let cumulativeBalance = balance - last7Days.reduce((s, v) => s + v, 0);
    const balanceSparkline = last7Days.map((dailyChange) => {
      cumulativeBalance += dailyChange;
      return cumulativeBalance;
    });

    // Net flow sparkline
    const flowSparkline = last7Days;

    return { 
      balance, 
      curCredits, 
      curDebits, 
      netFlow, 
      incomeDelta, 
      expenseDelta, 
      flowDelta,
      avgMonthlyBurn,
      runwayDays,
      runwayMonths,
      balanceSparkline,
      incomeSparkline,
      expenseSparkline,
      flowSparkline
    };
  }, [selectedAccountId, roleTransactions, roleAccounts]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="pb-3 border-b" style={{ borderColor: "var(--z-border)" }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={350} height={20} className="mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-5 space-y-3" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
              <div className="flex items-start justify-between">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={60} height={24} />
              </div>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={160} height={32} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <div className="rounded-xl p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
              <Skeleton variant="text" width={180} height={24} className="mb-4" />
              <Skeleton variant="rectangular" width="100%" height={280} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl p-5 space-y-3" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width={100} height={20} />
                  <Skeleton variant="text" width={140} height={32} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-xl p-6" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
              <Skeleton variant="text" width={160} height={24} className="mb-4" />
              <Skeleton variant="circular" width={200} height={200} className="mx-auto" />
            </div>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <div className="p-6 border-b" style={{ borderColor: "var(--z-border)" }}>
            <Skeleton variant="text" width={180} height={24} />
          </div>
          <div className="divide-y" style={{ borderColor: "var(--z-border)" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="space-y-1">
                    <Skeleton variant="text" width={180} height={20} />
                    <Skeleton variant="text" width={120} height={16} />
                  </div>
                </div>
                <Skeleton variant="text" width={100} height={24} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  console.log('Dashboard content rendering');

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="pb-4 border-b" style={{ borderColor: "var(--z-border)" }}>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1" style={{ color: "var(--z-text-primary)" }}>Dashboard</h1>
        <p className="text-sm" style={{ color: "var(--z-text-muted)", fontWeight: 400 }}>Monitor your financial performance and key metrics</p>
      </div>

      {/* Primary KPIs - Top Row (4 cards) */}
      <section className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SummaryCard 
            label="Total Balance" 
            value={stats.balance} 
            delta={3.2} 
            variant="balance" 
            index={0}
            sparklineData={stats.balanceSparkline}
          />
          <SummaryCard 
            label="Monthly Income" 
            value={stats.curCredits} 
            delta={stats.incomeDelta} 
            variant="income" 
            index={1}
            sparklineData={stats.incomeSparkline}
          />
          <SummaryCard 
            label="Monthly Expenses" 
            value={stats.curDebits} 
            delta={stats.expenseDelta} 
            variant="expense" 
            index={2}
            sparklineData={stats.expenseSparkline}
          />
          <SummaryCard 
            label="Net Cash Flow" 
            value={stats.netFlow} 
            delta={stats.flowDelta} 
            variant="flow" 
            index={3}
            sparklineData={stats.flowSparkline}
          />
        </div>
      </section>

      {/* Charts & Secondary Metrics Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
        {/* Main Chart - Takes 2 columns on large screens */}
        <div className="xl:col-span-2 space-y-5">
          <BalanceTrendChart />
          
          {/* Secondary Metrics Row - Financial Health */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard 
              label="Monthly Burn Rate" 
              value={stats.avgMonthlyBurn} 
              delta={0}
              icon={Flame} 
              variant="expense"
              index={4}
              suffix="/mo"
              className="mark-warning"
            />
            <SummaryCard 
              label="Runway" 
              value={stats.runwayDays === Infinity ? 999 : stats.runwayDays}
              delta={0}
              icon={Gauge}
              variant={stats.runwayDays > 180 ? "balance" : stats.runwayDays > 90 ? "flow" : "expense"}
              index={5}
              suffix="days"
              className={stats.runwayDays < 90 ? "mark-critical" : stats.runwayDays < 180 ? "mark-warning" : "mark-success"}
            />
            <SummaryCard 
              label="Avg Transaction" 
              value={stats.curDebits / (transactions.filter(t => t.type === 'debit' && t.date.startsWith('2025-03')).length || 1)} 
              delta={-2.1} 
              icon={DollarSign} 
              variant="expense" 
              index={6} 
            />
          </div>
        </div>

        {/* Sidebar - Spend Breakdown */}
        <div className="space-y-5">
          <SpendBreakdownChart />
        </div>
      </section>

      {/* Recent Transactions - Full Width */}
      <section className="mt-5">
        <RecentTransactions />
      </section>
    </div>
  );
}
