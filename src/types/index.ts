export type BankName = "HDFC" | "ICICI" | "SBI" | "Axis";
export type AccountType = "Current" | "Savings" | "OD";
export type TransactionType = "credit" | "debit";
export type TransactionStatus = "settled" | "pending" | "reversed";
export type UserRole = "viewer" | "accountant" | "admin";

export type TransactionCategory =
  | "salaries"
  | "vendor_payments"
  | "saas_subscriptions"
  | "travel_expense"
  | "utilities"
  | "marketing"
  | "office_admin"
  | "taxes_compliance"
  | "revenue_receipts"
  | "loan_repayment"
  | "miscellaneous";

export const ALL_CATEGORIES: TransactionCategory[] = [
  "salaries", "vendor_payments", "saas_subscriptions", "travel_expense",
  "utilities", "marketing", "office_admin", "taxes_compliance",
  "revenue_receipts", "loan_repayment", "miscellaneous",
];

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  salaries: "Salaries",
  vendor_payments: "Vendor Payments",
  saas_subscriptions: "SaaS Subscriptions",
  travel_expense: "Travel & Expense",
  utilities: "Utilities",
  marketing: "Marketing",
  office_admin: "Office & Admin",
  taxes_compliance: "Taxes & Compliance",
  revenue_receipts: "Revenue Receipts",
  loan_repayment: "Loan Repayment",
  miscellaneous: "Miscellaneous",
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  salaries: "#8B7CF8",
  vendor_payments: "#3D6EFA",
  saas_subscriptions: "#F59E0B",
  travel_expense: "#EC4899",
  utilities: "#6366F1",
  marketing: "#14D9A4",
  office_admin: "#94A3B8",
  taxes_compliance: "#F05252",
  revenue_receipts: "#22C55E",
  loan_repayment: "#F97316",
  miscellaneous: "#64748B",
};

export interface BankAccount {
  id: string;
  bankName: BankName;
  accountType: AccountType;
  accountNumberMasked: string;
  ifsc: string;
  balance: number;
  currency: "INR";
  isActive: boolean;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  valueDate: string;
  narration: string;
  referenceNo: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  category: TransactionCategory;
  vendorName?: string;
  tags: string[];
  status: TransactionStatus;
  isAnomaly: boolean;
  anomalyReason?: string;
  notes?: string;
}

export interface MonthlySnapshot {
  month: string;
  accountId: string | "all";
  totalCredits: number;
  totalDebits: number;
  netFlow: number;
  byCategory: Record<TransactionCategory, number>;
}

export interface Anomaly {
  transactionId: string;
  reason: "high_amount" | "duplicate" | "round_number" | "category_spike";
  severity: "low" | "medium" | "high";
  description: string;
}

export interface RolePermissions {
  canView: boolean;
  canExport: boolean;
  canEditCategory: boolean;
  canAddTransaction: boolean;
  canEditTransaction: boolean;
  canDeleteTransaction: boolean;
  canAccessSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  viewer:     { canView: true,  canExport: false, canEditCategory: false, canAddTransaction: false, canEditTransaction: false, canDeleteTransaction: false, canAccessSettings: false },
  accountant: { canView: true,  canExport: true,  canEditCategory: true,  canAddTransaction: true,  canEditTransaction: true,  canDeleteTransaction: false, canAccessSettings: false },
  admin:      { canView: true,  canExport: true,  canEditCategory: true,  canAddTransaction: true,  canEditTransaction: true,  canDeleteTransaction: true,  canAccessSettings: true  },
};

export interface TransactionFilters {
  search: string;
  accountIds: string[];
  categories: TransactionCategory[];
  type: TransactionType | "all";
  status: TransactionStatus | "all";
  dateFrom: string | null;
  dateTo: string | null;
  amountMin: number | null;
  amountMax: number | null;
}
