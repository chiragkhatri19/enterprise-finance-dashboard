import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccountState {
  selectedAccountId: string | "all";
  setSelectedAccountId: (id: string | "all") => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      selectedAccountId: "all",
      setSelectedAccountId: (id) => set({ selectedAccountId: id }),
    }),
    { name: "zorvyn:account" }
  )
);
