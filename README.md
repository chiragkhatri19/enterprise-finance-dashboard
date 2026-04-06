# Zorvyn Vision - Enterprise Finance Dashboard

A ultra-premium, industrial-grade financial analytics dashboard built with **React**, **TypeScript**, and **Tailwind CSS**. Designed for high-stakes financial monitoring, transaction management, and role-based data analytics.

![Dashboard Preview](https://github.com/user-attachments/assets/c0f81e3d-ea49-4fe2-91c0-89bc1d37fd96) *(Placeholder for hero image)*

## 🏛 UI Architecture & Design Approach

The interface follows a **Data-First, Premium Industrial** aesthetic, moving beyond standard SaaS templates into a high-fidelity tool for professionals.

### Key Design Pillars:
*   **Monochrome Matte Finish**: A sharp, high-contrast palette using deep charcoals and pure whites, ensuring maximum readability and a professional workspace feel.
*   **Noise Texture Overlay**: A subtle, 5% opacity grain overlay (`mix-blend-mode: overlay`) applied globally to give the UI a tangible, matte finish that eliminates screen glare and feels "printed" on-glass.
*   **Industrial Precision**: Geometric grid backgrounds and monospaced typography (JetBrains Mono) for numerical data, emphasizing accuracy and structural integrity.
*   **Glassmorphism 2.0**: Sophisticated use of `backdrop-blur` (12px) and border-color gradients to create layered depth without color clutter.
*   **Micro-Interactions**: Staggered page load animations and responsive hover states tuned for tactile feedback using Framer Motion.

## ✨ Core Features

### 1. Unified Financial Overview
*   **Advanced Summary Cards**: Real-time tracking of Balance, Income, Expenses, and Net Flow with integrated sparklines.
*   **Interactive Analytics**: 
    *   **Balance Trend**: Multi-account time-series visualization with custom date range support.
    *   **Spend Breakdown**: Donut-chart categorization of expenditures with interactive slice highlighting.
*   **Secondary KPIs**: Average ticket size, Savings rate, and Active account frequency analysis.

### 2. Transaction Management System (Full CRUD)
*   **Enterprise-Grade Ledger**: A performant, paginated transaction engine capable of handling hundreds of records with zero lag.
*   **Smart Filtering**: Multi-layer filters including category, account origin, DR/CR type, status (Settled/Pending/Reversed), and amount ranges.
*   **Contextual Search**: Global search across narrations, reference IDs, and vendor aliases.
*   **Export Engine**: Role-restricted export functionality for CSV and JSON, respecting current filter states.
*   **Bulk Operations**: Pre-configured architectural support for future bulk transaction handling.

### 3. Role-Based Access Control (RBAC)
The application dynamically reconfigures its UI based on the current user permission set:
*   **Admin**: Full read/write/delete access, export capabilities, settings configuration.
*   **Accountant**: Read/write access, export enabled, deletion disabled.
*   **Viewer**: Read-only access, all action buttons (Add/Edit/Delete/Export) are suppressed.

## 🛠 Tech Stack

### Frontend Foundation
*   **React 19.2.4**: Leveraging concurrent rendering for smooth UI transitions.
*   **Vite 8.0.3**: Optimized build pipeline for lightning-fast HMR and production bundles.
*   **TypeScript**: Strict type safety across all stores, components, and utility functions.

### Design & Interaction
*   **Tailwind CSS**: Utility-first styling with high-performance CSS variable integration.
*   **Framer Motion**: Page-level transitions and micro-animations.
*   **Radix UI / Shadcn**: Accessible, unstyled primitives for robust component foundations.
*   **Recharts**: High-performance SVGs for financial visualization.

### State Management
*   **Zustand**: Centralized state management with selective subscription patterns to minimize re-renders.
*   **Persistence**: Integrated `localStorage` sync for transaction history and UI preferences (Theme, Role).

## 📂 Project Structure

```
src/
├── components/
│   ├── dashboard/       # High-level analytical widgets
│   ├── layout/          # Sidebar, Nav, and Shell architecture
│   ├── transactions/    # Ledger-specific forms and tables
│   └── ui/              # Atom-level design primitives (shadcn base)
├── lib/                 # Core logic, export utils, and mock generators
├── pages/               # Route-level views (Index, Ledger, Insights)
├── store/               # Zustand state domains (Role, Filter, Transactions)
├── types/               # Global TypeScript definitions
└── index.css            # Global design tokens and industrial styling layer
```

## 🚀 Getting Started

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/yourusername/zorvyn-vision.git
    cd zorvyn-vision
    npm install
    ```
2.  **Run Development**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📜 Deployment

Configured for **Vercel** with full SPA routing (`vercel.json`) and production-ready `dist` output.

---
*Built with precision for the modern financier.*
