import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/types";

interface RoleState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: "viewer", // Start with viewer to demonstrate role-based filtering
      setRole: (role) => set({ role }),
    }),
    { name: "zorvyn:role" }
  )
);
