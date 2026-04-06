import React, { useMemo, useState, useEffect } from "react";
import { MOCK_ACCOUNTS } from "@/lib/mockData";
import { useAccountStore } from "@/store/accountStore";
import { useFilterStore } from "@/store/filterStore";
import { useRoleStore } from "@/store/roleStore";
import { useTransactionStore } from "@/store/transactionStore";
import { formatINR, formatDate } from "@/lib/formatters";
import { CATEGORY_LABELS, CATEGORY_COLORS, ALL_CATEGORIES, ROLE_PERMISSIONS, type TransactionCategory, type TransactionStatus } from "@/types";
import { Search, X, Download, Plus, ChevronDown, ChevronUp, FileJson, SearchX, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

import { TransactionForm } from "@/components/transactions/TransactionForm";

type GroupBy = "none" | "category" | "account" | "type";

export default function TransactionsPage() {
  const { selectedAccountId } = useAccountStore();
  const { filters, setFilters, resetFilters } = useFilterStore();
  const { role } = useRoleStore();
  const permissions = ROLE_PERMISSIONS[role];
  const { transactions, addTransaction } = useTransactionStore();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Listen for keyboard shortcut events
  useEffect(() => {
    const handleFocusSearch = () => {
      const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    };

    window.addEventListener("focus-search", handleFocusSearch);
    return () => window.removeEventListener("focus-search", handleFocusSearch);
  }, []);

  // Reset page when filters change (must be before conditional return)
  useEffect(() => { setPage(1); }, [filters, selectedAccountId]);

  const filtered = useMemo(() => {
    let txns = selectedAccountId === "all" ? transactions : transactions.filter((t) => t.accountId === selectedAccountId);
    if (filters.search) { const q = filters.search.toLowerCase(); txns = txns.filter((t) => t.narration.toLowerCase().includes(q) || t.referenceNo.toLowerCase().includes(q) || (t.vendorName && t.vendorName.toLowerCase().includes(q))); }
    if (filters.categories.length > 0) txns = txns.filter((t) => filters.categories.includes(t.category));
    if (filters.type !== "all") txns = txns.filter((t) => t.type === filters.type);
    if (filters.status !== "all") txns = txns.filter((t) => t.status === filters.status);
    if (filters.dateFrom) txns = txns.filter((t) => t.date >= filters.dateFrom!);
    if (filters.dateTo) txns = txns.filter((t) => t.date <= filters.dateTo!);
    if (filters.amountMin !== null) txns = txns.filter((t) => t.amount >= filters.amountMin!);
    if (filters.amountMax !== null) txns = txns.filter((t) => t.amount <= filters.amountMax!);
    return [...txns].sort((a, b) => { const mul = sortDir === "asc" ? 1 : -1; return sortField === "date" ? mul * a.date.localeCompare(b.date) : mul * (a.amount - b.amount); });
  }, [selectedAccountId, filters, sortField, sortDir, transactions]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));



  const grouped = useMemo(() => {
    if (groupBy === "none") return null;
    const groups: Record<string, typeof paged> = {};
    paged.forEach((txn) => {
      const key = groupBy === "category" ? CATEGORY_LABELS[txn.category] : groupBy === "account" ? (MOCK_ACCOUNTS.find((a) => a.id === txn.accountId)?.bankName || "Unknown") : txn.type === "credit" ? "Credits" : "Debits";
      if (!groups[key]) groups[key] = [];
      groups[key].push(txn);
    });
    return groups;
  }, [paged, groupBy]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="pb-3 border-b" style={{ borderColor: "var(--z-border)" }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={400} height={20} className="mt-2" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <Skeleton variant="rectangular" width={150} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} />
            <Skeleton variant="rectangular" width={150} height={40} />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
          </div>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--z-bg-surface)", boxShadow: "var(--z-shadow-card)", border: "1px solid var(--z-border)" }}>
          <div className="p-4 border-b" style={{ borderColor: "var(--z-border)" }}>
            <div className="grid grid-cols-12 gap-4">
              <Skeleton variant="text" width={80} height={20} className="col-span-2" />
              <Skeleton variant="text" width={120} height={20} className="col-span-3" />
              <Skeleton variant="text" width={100} height={20} className="col-span-2" />
              <Skeleton variant="text" width={80} height={20} className="col-span-2" />
              <Skeleton variant="text" width={60} height={20} className="col-span-2" />
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--z-border)" }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-4 grid grid-cols-12 gap-4 items-center">
                <Skeleton variant="text" width={70} height={20} className="col-span-2" />
                <div className="space-y-1 col-span-3">
                  <Skeleton variant="text" width={160} height={20} />
                  <Skeleton variant="text" width={100} height={16} />
                </div>
                <Skeleton variant="text" width={80} height={20} className="col-span-2" />
                <Skeleton variant="rectangular" width={60} height={24} className="col-span-2" />
                <Skeleton variant="text" width={70} height={20} className="col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDir === "desc" ? <ChevronDown className="h-3 w-3 inline ml-1" /> : <ChevronUp className="h-3 w-3 inline ml-1" />;
  };

  const exportData = (format: "csv" | "json") => {
    if (format === "csv") {
      const headers = ["Date", "Narration", "Reference", "Account", "Category", "Type", "Amount", "Status"];
      const rows = filtered.map((t) => [t.date, t.narration, t.referenceNo, MOCK_ACCOUNTS.find((a) => a.id === t.accountId)?.bankName || "", CATEGORY_LABELS[t.category], t.type, t.amount, t.status]);
      const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      downloadBlob(csv, "text/csv", `zorvyn-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      const data = filtered.map((t) => ({ date: t.date, narration: t.narration, referenceNo: t.referenceNo, account: MOCK_ACCOUNTS.find((a) => a.id === t.accountId)?.bankName || "", category: CATEGORY_LABELS[t.category], type: t.type, amount: t.amount, status: t.status, vendorName: t.vendorName || null, isAnomaly: t.isAnomaly }));
      downloadBlob(JSON.stringify(data, null, 2), "application/json", `zorvyn-transactions-${new Date().toISOString().slice(0, 10)}.json`);
    }
  };

  const downloadBlob = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const activeFilters = [
    ...filters.categories.map((c) => ({ label: CATEGORY_LABELS[c], key: `cat:${c}` })),
    ...(filters.type !== "all" ? [{ label: filters.type === "credit" ? "Credits" : "Debits", key: "type" }] : []),
    ...(filters.status !== "all" ? [{ label: `Status: ${filters.status}`, key: "status" }] : []),
    ...(filters.dateFrom ? [{ label: `From: ${filters.dateFrom}`, key: "dateFrom" }] : []),
    ...(filters.dateTo ? [{ label: `To: ${filters.dateTo}`, key: "dateTo" }] : []),
    ...(filters.amountMin !== null ? [{ label: `Min: ₹${filters.amountMin.toLocaleString("en-IN")}`, key: "amountMin" }] : []),
    ...(filters.amountMax !== null ? [{ label: `Max: ₹${filters.amountMax.toLocaleString("en-IN")}`, key: "amountMax" }] : []),
  ];

  const removeFilter = (key: string) => {
    if (key === "type") setFilters({ type: "all" });
    else if (key === "status") setFilters({ status: "all" });
    else if (key === "dateFrom") setFilters({ dateFrom: null });
    else if (key === "dateTo") setFilters({ dateTo: null });
    else if (key === "amountMin") setFilters({ amountMin: null });
    else if (key === "amountMax") setFilters({ amountMax: null });
    else if (key.startsWith("cat:")) setFilters({ categories: filters.categories.filter((c) => c !== key.slice(4)) });
  };

  const totalCredits = filtered.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  // Extract row content for virtualization (without motion wrapper)
  const renderRowContent = (txn: typeof paged[0]) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === txn.accountId);
    return (
      <>
        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: "var(--z-text-secondary)" }}>{formatDate(txn.date)}</td>
        <td className="px-4 py-3 max-w-[260px]">
          <div className="text-xs font-medium truncate" style={{ color: txn.isAnomaly ? "var(--z-yellow)" : "var(--z-text-primary)" }}>
            {txn.isAnomaly && <span className="mr-1">⚠</span>}{txn.narration}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--z-text-dim)" }}>{txn.referenceNo}</div>
        </td>
        <td className="px-4 py-3 text-xs" style={{ color: "var(--z-text-secondary)" }}>
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: account?.color }} />{account?.bankName}
        </td>
        <td className="px-4 py-3">
          <span className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{ background: `${CATEGORY_COLORS[txn.category]}15`, color: CATEGORY_COLORS[txn.category] }}>
            {CATEGORY_LABELS[txn.category as TransactionCategory]}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="rounded-md px-2 py-0.5 text-[10px] font-mono font-medium"
            style={{ background: txn.type === "credit" ? "var(--z-green-bg)" : "var(--z-bg-surface-2)", color: txn.type === "credit" ? "var(--z-green)" : "var(--z-text-secondary)" }}>
            {txn.type === "credit" ? "CR" : "DR"}
          </span>
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm font-medium"
          style={{ color: txn.type === "credit" ? "var(--z-green)" : "var(--z-text-primary)" }}>
          {txn.type === "credit" ? "+" : "-"}{formatINR(txn.amount)}
        </td>
        <td className="px-4 py-3">
          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: txn.status === "settled" ? "var(--z-green-bg)" : txn.status === "pending" ? "var(--z-yellow-bg)" : "var(--z-red-bg)",
              color: txn.status === "settled" ? "var(--z-green)" : txn.status === "pending" ? "var(--z-yellow)" : "var(--z-red)",
            }}>{txn.status}</span>
        </td>
      </>
    );
  };

  const renderRow = (txn: typeof paged[0], i: number) => {
    return (
      <motion.tr key={txn.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01, duration: 0.2 }}
        className="transition-colors duration-150" style={{ borderBottom: `1px solid var(--z-border)` }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--z-bg-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
        {renderRowContent(txn)}
      </motion.tr>
    );
  };

  const inputStyle = { background: "var(--z-bg-input)", color: "var(--z-text-secondary)", border: `1px solid var(--z-border)` };
  const btnSecondary = { background: "var(--z-bg-surface-2)", color: "var(--z-text-secondary)", border: `1px solid var(--z-border)` };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold" style={{ color: "var(--z-text-primary)" }}>Transactions</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--z-text-muted)" }}>
            {filtered.length} results · Credits: <span className="font-mono" style={{ color: "var(--z-green)" }}>{formatINR(totalCredits, true)}</span>
            {" "}· Debits: <span className="font-mono" style={{ color: "var(--z-text-primary)" }}>{formatINR(totalDebits, true)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {permissions.canExport && (
            <>
              <button onClick={() => exportData("csv")} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all" style={btnSecondary}>
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
              <button onClick={() => exportData("json")} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all" style={btnSecondary}>
                <FileJson className="h-3.5 w-3.5" /> JSON
              </button>
            </>
          )}
          {permissions.canAddTransaction && (
            <button 
              onClick={() => setShowTransactionForm(true)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-display font-semibold transition-all hover:opacity-90"
              style={{ background: "var(--z-accent)", color: "#fff", boxShadow: `0 0 20px var(--z-accent-glow)` }}>
              <Plus className="h-3.5 w-3.5" /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border p-3 space-y-3 theme-transition" style={{ background: "var(--z-bg-surface)", borderColor: "var(--z-border)" }}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--z-text-muted)" }} />
            <input type="text" placeholder="Search narration, reference, or vendor..." value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full rounded-lg pl-9 pr-3 py-2 text-xs outline-none transition-colors" style={inputStyle} />
          </div>
          <select value={filters.type} onChange={(e) => setFilters({ type: e.target.value as "all" | "credit" | "debit" })} className="rounded-lg px-3 py-2 text-xs outline-none" style={inputStyle}>
            <option value="all">All Types</option><option value="credit">Credits</option><option value="debit">Debits</option>
          </select>
          <select value={filters.categories[0] || ""} onChange={(e) => setFilters({ categories: e.target.value ? [e.target.value as TransactionCategory] : [] })} className="rounded-lg px-3 py-2 text-xs outline-none" style={inputStyle}>
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map((c) => (<option key={c} value={c}>{CATEGORY_LABELS[c]}</option>))}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ status: e.target.value as TransactionStatus | "all" })} className="rounded-lg px-3 py-2 text-xs outline-none" style={inputStyle}>
            <option value="all">All Status</option><option value="settled">Settled</option><option value="pending">Pending</option><option value="reversed">Reversed</option>
          </select>
          <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={inputStyle}>
            <Layers className="h-3.5 w-3.5" style={{ color: "var(--z-text-muted)" }} />
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)} className="text-xs outline-none bg-transparent" style={{ color: "var(--z-text-secondary)" }}>
              <option value="none">No Grouping</option><option value="category">By Category</option><option value="account">By Account</option><option value="type">By Type</option>
            </select>
          </div>
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[11px] font-medium transition-colors"
            style={{ color: showAdvanced ? "var(--z-accent)" : "var(--z-text-secondary)" }}>
            {showAdvanced ? "Hide" : "More"} Filters
          </button>
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-3 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Date From</label>
                <input type="date" value={filters.dateFrom || ""} onChange={(e) => setFilters({ dateFrom: e.target.value || null })} className="rounded-lg px-2 py-1.5 text-xs outline-none" style={inputStyle} />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Date To</label>
                <input type="date" value={filters.dateTo || ""} onChange={(e) => setFilters({ dateTo: e.target.value || null })} className="rounded-lg px-2 py-1.5 text-xs outline-none" style={inputStyle} />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Min ₹</label>
                <input type="number" value={filters.amountMin ?? ""} onChange={(e) => setFilters({ amountMin: e.target.value ? Number(e.target.value) : null })}
                  placeholder="0" className="rounded-lg px-2 py-1.5 text-xs outline-none w-24 font-mono" style={inputStyle} />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Max ₹</label>
                <input type="number" value={filters.amountMax ?? ""} onChange={(e) => setFilters({ amountMax: e.target.value ? Number(e.target.value) : null })}
                  placeholder="999999" className="rounded-lg px-2 py-1.5 text-xs outline-none w-24 font-mono" style={inputStyle} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-wrap">
              {activeFilters.map((f) => (
                <motion.span key={f.key} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px]"
                  style={{ background: "var(--z-accent-muted)", color: "var(--z-accent)", border: `1px solid var(--z-border-accent)` }}>
                  {f.label}
                  <button onClick={() => removeFilter(f.key)} className="hover:opacity-70 transition-opacity"><X className="h-3 w-3" /></button>
                </motion.span>
              ))}
              <button onClick={resetFilters} className="text-[11px] font-medium" style={{ color: "var(--z-red)" }}>Clear All</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden theme-transition" style={{ background: "var(--z-bg-surface)", borderColor: "var(--z-border)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <SearchX className="h-12 w-12 mb-3" style={{ color: "var(--z-text-muted)" }} />
            <p className="font-display font-semibold" style={{ color: "var(--z-text-primary)" }}>No transactions found</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "var(--z-text-muted)" }}>Try adjusting your filters or date range</p>
            <button onClick={resetFilters} className="rounded-lg px-4 py-2 text-xs font-display font-semibold transition-all"
              style={{ background: "var(--z-accent-muted)", color: "var(--z-accent)", border: `1px solid var(--z-border-accent)` }}>Clear All Filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--z-bg-surface-3)", borderBottom: `1px solid var(--z-border)` }}>
                  <th onClick={() => handleSort("date")} className="cursor-pointer px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider select-none" style={{ color: "var(--z-text-muted)" }}>Date <SortIcon field="date" /></th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Narration</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Account</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Category</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Type</th>
                  <th onClick={() => handleSort("amount")} className="cursor-pointer px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider select-none" style={{ color: "var(--z-text-muted)" }}>Amount <SortIcon field="amount" /></th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--z-text-muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {grouped ? (
                  Object.entries(grouped).map(([groupName, txns]) => (
                    <React.Fragment key={groupName}>
                      <tr><td colSpan={7} className="px-4 py-2" style={{ background: "var(--z-accent-muted)", borderBottom: `1px solid var(--z-border)` }}>
                        <span className="font-display text-xs font-semibold" style={{ color: "var(--z-accent)" }}>{groupName}</span>
                        <span className="ml-2 text-[10px] font-mono" style={{ color: "var(--z-text-muted)" }}>{txns.length} txns · {formatINR(txns.reduce((s, t) => s + t.amount, 0), true)}</span>
                      </td></tr>
                      {txns.map((txn, i) => renderRow(txn, i))}
                    </React.Fragment>
                  ))
                ) : (
                  paged.map((txn, i) => renderRow(txn, i))
                )}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid var(--z-border)` }}>
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: "var(--z-text-muted)" }}>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span>
              <div className="flex items-center gap-2">
                <label className="text-xs" style={{ color: "var(--z-text-muted)" }}>Rows per page:</label>
                <select 
                  value={pageSize} 
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
                  style={inputStyle}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[{ l: "First", p: 1, d: page === 1 }, { l: "Prev", p: Math.max(1, page - 1), d: page === 1 }, null, { l: "Next", p: Math.min(totalPages, page + 1), d: page === totalPages }, { l: "Last", p: totalPages, d: page === totalPages }].map((b, i) =>
                b === null ? <span key="pg" className="text-xs font-mono px-2" style={{ color: "var(--z-text-secondary)" }}>{page}/{totalPages}</span> :
                <button key={b.l} onClick={() => setPage(b.p)} disabled={b.d} className="rounded-md px-2 py-1 text-xs disabled:opacity-20 transition-colors"
                  style={{ color: "var(--z-text-secondary)", background: "var(--z-bg-surface-2)" }}>{b.l}</button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Transaction Form Modal */}
      <TransactionForm 
        isOpen={showTransactionForm} 
        onClose={() => setShowTransactionForm(false)}
        onSubmit={(transaction) => {
          addTransaction(transaction);
          setShowTransactionForm(false);
        }}
      />
    </div>
  );
}
