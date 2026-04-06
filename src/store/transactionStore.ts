import { create } from "zustand";
import { Transaction } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/mockData";

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: MOCK_TRANSACTIONS,
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [
      ...state.transactions,
      { ...transaction, id: `txn_${Date.now()}` }
    ].sort((a, b) => b.date.localeCompare(a.date))
  })),
  
  updateTransaction: (id, transaction) => set((state) => ({
    transactions: state.transactions.map((t) =>
      t.id === id ? { ...transaction, id } : t
    ).sort((a, b) => b.date.localeCompare(a.date))
  })),
  
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((t) => t.id !== id)
  })),
}));
