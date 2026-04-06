# Zorvyn Vision — Enterprise Finance Dashboard

A production-ready, ultra-premium financial analytics dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. Optimized for high-stakes monitoring, transaction management, and role-based data analytics.

## 🏛 The "Premium Industrial" UI Philosophy

Zorvyn eschews standard SaaS templates in favor of a "Data-First" architectural aesthetic, meticulously crafted for clarity and focus.

*   **Adaptive Dual Themes**: 
    *   **Dark Mode**: A deep obsidian finish with global noise texturing (`0.05` overlay) for a tactile, matte "printed-on-glass" feel.
    *   **Light Mode**: An ultra-clean *Slate-50* canvas (`#F8FAFC`) with crisp, physical paper-style shadows, inner border rings (`rgba(0,0,0,0.03)`), and absolute contrast.
*   **Precision Typography**: High-contrast near-black/white headings (`Sora`) paired with strict monospaced (`JetBrains Mono`) financial digits.
*   **Structural Grid**: Background blueprint grids (`60px`) establish a subconscious layout rhythm without distracting from data.
*   **Micro-Interactions**: Fluid, staggered load states powered by Framer Motion ensure transitions feel engineered, not animated.

## ✨ Core Functionality

1.  **Unified Financial Overview**
    *   **Interactive Analytics**: Balance trends (time-series) and Spend breakdowns (interactive donuts).
    *   **KPI Cards**: Real-time tracking of Net Flow, Balances, and automated anomaly detection with embedded sparklines.
2.  **Enterprise Ledger (Full CRUD)**
    *   High-performance transaction engine with **smart multi-filter** combinations (Date, Status, Type, Categories).
    *   Global fuzzy search and structural support for future batch operations.
3.  **Role-Based Access Control (RBAC)**
    *   **Admin**: Full Read/Write/Delete/Export.
    *   **Accountant**: Read/Write/Export only.
    *   **Viewer**: Strictly read-only; all mutation actions are suppressed.

## 🛠 Architecture & Tech Stack

*   **Frontend**: React 19, Vite 8, TypeScript
*   **Styling**: Tailwind CSS (Utility-first), Framer Motion, Radix UI (Headless primitives)
*   **Visualizations**: Recharts
*   **State Management**: Zustand (Optimized, scoped reactivity)
*   **Persistence**: Synced local mock-database

## 🚀 Quick Start

```bash
git clone https://github.com/chiragkhatri19/enterprise-finance-dashboard.git
cd enterprise-finance-dashboard
npm install
npm run dev
```

*Fully configured for zero-config Vercel SPA deployment via `vercel.json`.*
