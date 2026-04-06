import { create } from "zustand";
import type { TransactionFilters } from "@/types";

const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  accountIds: [],
  categories: [],
  type: "all",
  status: "all",
  dateFrom: null,
  dateTo: null,
  amountMin: null,
  amountMax: null,
};

interface FilterState {
  filters: TransactionFilters;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
