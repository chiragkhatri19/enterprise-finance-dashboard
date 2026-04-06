import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, TransactionCategory, ALL_CATEGORIES, CATEGORY_LABELS } from "@/types";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  editTransaction?: Transaction | null;
}

const CATEGORIES = [
  "Salaries", "Rent", "Utilities", "Software", "Marketing", 
  "Travel", "Office Supplies", "Consulting", "Investments", "Other"
];

export function TransactionForm({ isOpen, onClose, onSubmit, editTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    type: "debit" as "credit" | "debit",
    category: "miscellaneous" as TransactionCategory,
    narration: "",
    referenceNo: `TXN${Date.now()}`,
    status: "settled" as "settled" | "pending" | "reversed",
    accountId: "acc_1",
    vendorName: ""
  });

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: editTransaction.date,
        amount: editTransaction.amount.toString(),
        type: editTransaction.type,
        category: editTransaction.category,
        narration: editTransaction.narration,
        referenceNo: editTransaction.referenceNo,
        status: editTransaction.status,
        accountId: editTransaction.accountId,
        vendorName: editTransaction.vendorName || ""
      });
    } else {
      // Reset form for new transaction
      setFormData({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        type: "debit",
        category: "miscellaneous",
        narration: "",
        referenceNo: `TXN${Date.now()}`,
        status: "settled",
        accountId: "acc_1",
        vendorName: ""
      });
    }
  }, [editTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      date: formData.date,
      valueDate: formData.date,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      narration: formData.narration,
      referenceNo: formData.referenceNo,
      balanceAfter: 0, // Will be calculated by parent
      vendorName: formData.vendorName || undefined,
      tags: [],
      status: formData.status,
      isAnomaly: false,
      accountId: formData.accountId
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl"
              style={{ 
                background: "var(--z-bg-surface)",
                borderColor: "var(--z-border)"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold" style={{ color: "var(--z-text-primary)" }}>
                  {editTransaction ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                      Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                      style={{ 
                        background: "var(--z-bg-input)",
                        color: "var(--z-text-primary)",
                        border: "1px solid var(--z-border)"
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as "credit" | "debit" })}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                      style={{ 
                        background: "var(--z-bg-input)",
                        color: "var(--z-text-primary)",
                        border: "1px solid var(--z-border)"
                      }}
                    >
                      <option value="debit">Expense</option>
                      <option value="credit">Income</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                    style={{ 
                      background: "var(--z-bg-input)",
                      color: "var(--z-text-primary)",
                      border: "1px solid var(--z-border)"
                    }}
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                    style={{ 
                      background: "var(--z-bg-input)",
                      color: "var(--z-text-primary)",
                      border: "1px solid var(--z-border)"
                    }}
                  />
                </div>

                {/* Narration */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.narration}
                    onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                    style={{ 
                      background: "var(--z-bg-input)",
                      color: "var(--z-text-primary)",
                      border: "1px solid var(--z-border)"
                    }}
                    placeholder="Enter transaction description"
                  />
                </div>

                {/* Reference No & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                      Reference No
                    </label>
                    <input
                      type="text"
                      value={formData.referenceNo}
                      onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                      style={{ 
                        background: "var(--z-bg-input)",
                        color: "var(--z-text-primary)",
                        border: "1px solid var(--z-border)"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--z-text-secondary)" }}>
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "settled" | "pending" | "reversed" })}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                      style={{ 
                        background: "var(--z-bg-input)",
                        color: "var(--z-text-primary)",
                        border: "1px solid var(--z-border)"
                      }}
                    >
                      <option value="settled">Settled</option>
                      <option value="pending">Pending</option>
                      <option value="reversed">Reversed</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      background: "var(--z-bg-surface-2)",
                      color: "var(--z-text-secondary)",
                      border: "1px solid var(--z-border)"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      background: "var(--z-accent)",
                      color: "white"
                    }}
                  >
                    {editTransaction ? "Update" : "Add"} Transaction
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
