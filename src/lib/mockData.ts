import type { BankAccount, Transaction, TransactionCategory, UserRole } from "@/types";

export const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: "acc_hdfc_001",
    bankName: "HDFC",
    accountType: "Current",
    accountNumberMasked: "xxxx xxxx 4821",
    ifsc: "HDFC0001234",
    balance: 8750000,
    currency: "INR",
    isActive: true,
    color: "#7C5CFC",
  },
  {
    id: "acc_icici_002",
    bankName: "ICICI",
    accountType: "Current",
    accountNumberMasked: "xxxx xxxx 9034",
    ifsc: "ICIC0002345",
    balance: 3420000,
    currency: "INR",
    isActive: true,
    color: "#F59E0B",
  },
  {
    id: "acc_sbi_003",
    bankName: "SBI",
    accountType: "OD",
    accountNumberMasked: "xxxx xxxx 2277",
    ifsc: "SBIN0003456",
    balance: 1580000,
    currency: "INR",
    isActive: true,
    color: "#22C55E",
  },
  {
    id: "acc_axis_004",
    bankName: "Axis",
    accountType: "Current",
    accountNumberMasked: "xxxx xxxx 7856",
    ifsc: "UTIB0004567",
    balance: 2150000,
    currency: "INR",
    isActive: true,
    color: "#EF4444",
  },
];

/**
 * Filter mock data based on user role
 * - Viewer: Limited data (fewer transactions, reduced balances)
 * - Accountant: Standard data
 * - Admin: Full data
 */
export function getRoleFilteredData(role: UserRole) {
  if (role === "viewer") {
    // Viewer sees limited data - only recent transactions and masked amounts
    const viewerAccounts = MOCK_ACCOUNTS.map(acc => ({
      ...acc,
      balance: Math.round(acc.balance * 0.3) // Show only 30% of actual balance
    }));
    
    const viewerTransactions = MOCK_TRANSACTIONS
      .slice(0, 30) // Show FIRST 30 transactions (most recent since data is reversed)
      .map(txn => ({
        ...txn,
        amount: Math.round(txn.amount * 0.5), // Mask amounts by showing 50%
        narration: txn.narration.substring(0, 20) + "...", // Truncate narration
      }));
    
    return {
      accounts: viewerAccounts,
      transactions: viewerTransactions
    };
  }
  
  if (role === "accountant") {
    // Accountant sees standard data but with some limitations
    const accountantTransactions = MOCK_TRANSACTIONS.slice(-200); // Show last 200 transactions
    
    return {
      accounts: MOCK_ACCOUNTS,
      transactions: accountantTransactions
    };
  }
  
  // Admin gets full data
  return {
    accounts: MOCK_ACCOUNTS,
    transactions: MOCK_TRANSACTIONS
  };
}

// Export original data for backward compatibility

const narrationTemplates: Record<TransactionCategory, { narrations: string[]; vendors: string[] }> = {
  salaries: {
    narrations: [
      "NEFT DR-HDFC0001234-SALARY BATCH",
      "ACH DR-PAYROLL AXIS BANK LTD",
      "RTGS DR-SALARY CREDIT BATCH",
    ],
    vendors: ["Payroll"],
  },
  vendor_payments: {
    narrations: [
      "NEFT DR-M/S SHARMA TRADERS PUNE",
      "RTGS DR-GLOBAL TECH SOLUTIONS PVT LTD",
      "NEFT DR-KRISHNA ENTERPRISES MUMBAI",
      "IMPS DR-RAJESH INDUSTRIES DELHI",
      "NEFT DR-INFOSYS BPM LIMITED",
      "RTGS DR-TATA CONSULTANCY SERVICES",
    ],
    vendors: ["Sharma Traders", "Global Tech Solutions", "Krishna Enterprises", "Rajesh Industries", "Infosys BPM", "TCS"],
  },
  saas_subscriptions: {
    narrations: [
      "IMPS DR-GOOGLE INDIA PVT LTD WORKSPACE",
      "NEFT DR-ZOOM VIDEO COMMUNICATIONS",
      "NEFT DR-FRESHWORKS INC MONTHLY",
      "IMPS DR-NOTION LABS SUBSCRIPTION",
      "NEFT DR-ATLASSIAN JIRA CLOUD",
      "NEFT DR-GITHUB INC TEAM PLAN",
      "IMPS DR-AWS INDIA PVT LTD",
      "NEFT DR-SLACK TECHNOLOGIES INC",
    ],
    vendors: ["Google Workspace", "Zoom", "Freshworks", "Notion", "Atlassian", "GitHub", "AWS", "Slack"],
  },
  travel_expense: {
    narrations: [
      "UPI DR-UBER INDIA-9876543210",
      "UPI DR-SWIGGY FOOD-8765432109",
      "IMPS DR-MAKEMYTRIP FLIGHT BLR DEL",
      "UPI DR-IRCTC TRAIN TICKET",
      "NEFT DR-CLEARTRIP HOTEL BOOKING",
      "UPI DR-OLA CABS BENGALURU",
    ],
    vendors: ["Uber", "Swiggy", "MakeMyTrip", "IRCTC", "Cleartrip", "Ola"],
  },
  utilities: {
    narrations: [
      "ACH DR-BESCOM ELECTRICITY BILL",
      "NACH DR-AIRTEL BROADBAND ANNUAL",
      "NEFT DR-TATA SKY RECHARGE",
      "NACH DR-BWSSB WATER CHARGES",
      "NEFT DR-MAHANAGAR GAS LIMITED",
    ],
    vendors: ["BESCOM", "Airtel", "Tata Sky", "BWSSB", "Mahanagar Gas"],
  },
  marketing: {
    narrations: [
      "NEFT DR-META PLATFORMS IRELAND",
      "NEFT DR-GOOGLE INDIA ADS ACCOUNT",
      "NEFT DR-SCHBANG DIGITAL SOLUTIONS",
      "NEFT DR-WEBCHUTNEY STUDIOS LLP",
      "NEFT DR-DENTSU INDIA PVT LTD",
    ],
    vendors: ["Meta Ads", "Google Ads", "Schbang Digital", "Webchutney", "Dentsu"],
  },
  office_admin: {
    narrations: [
      "UPI DR-AMAZON SELLER SERVICES",
      "NEFT DR-BOMBAY OFFICE SUPPLIES CO",
      "IMPS DR-EUREKA FORBES SERVICE",
      "UPI DR-D MART RETAIL SUPPLIES",
    ],
    vendors: ["Amazon", "Bombay Office Supplies", "Eureka Forbes", "D-Mart"],
  },
  taxes_compliance: {
    narrations: [
      "NEFT DR-INCOME TAX TDS PAYMENT Q4",
      "NEFT DR-GST CHALLAN PAYMENT",
      "NEFT DR-PROFESSIONAL TAX STATE",
      "NEFT DR-EPF CONTRIBUTION",
    ],
    vendors: ["Income Tax", "GST", "Professional Tax", "EPF"],
  },
  revenue_receipts: {
    narrations: [
      "NEFT CR-RAZORPAY SOFTWARE PVT LTD",
      "RTGS CR-WIPRO LIMITED PAYMENT",
      "NEFT CR-INFOSYS BPM ADVANCE",
      "RTGS CR-TCS LIMITED INVOICE",
      "NEFT CR-HINDUSTAN UNILEVER PO PAYMENT",
      "RTGS CR-ITC LIMITED QUARTERLY",
      "NEFT CR-RELIANCE JIOMART PAYOUT",
      "IMPS CR-PAYTM MERCHANT SETTLEMENT",
      "NEFT CR-FLIPKART SELLER PAYOUT",
      "RTGS CR-AMAZON SELLER SETTLEMENT",
    ],
    vendors: ["Razorpay", "Wipro", "Infosys", "TCS", "HUL", "ITC", "Reliance", "Paytm", "Flipkart", "Amazon"],
  },
  loan_repayment: {
    narrations: [
      "ACH DR-HDFC BANK EMI TL-00248",
      "NACH DR-ICICI BANK TERM LOAN EMI",
      "ACH DR-SBI CCOD REPAYMENT",
    ],
    vendors: ["HDFC Bank Loan", "ICICI Bank Loan", "SBI CCOD"],
  },
  miscellaneous: {
    narrations: [
      "IMPS DR-MISC BANK CHARGES Q4",
      "NEFT DR-PETTY CASH REPLENISHMENT",
      "NEFT DR-EMPLOYEE REIMBURSEMENT",
    ],
    vendors: ["Bank Charges", "Petty Cash", "Reimbursement"],
  },
};

const monthlyTargets: Record<TransactionCategory, { min: number; max: number; countMin: number; countMax: number }> = {
  salaries:           { min: 1450000, max: 1650000, countMin: 1, countMax: 1 },
  vendor_payments:    { min: 520000,  max: 780000,  countMin: 18, countMax: 28 },
  saas_subscriptions: { min: 95000,   max: 135000,  countMin: 6, countMax: 10 },
  travel_expense:     { min: 125000,  max: 195000,  countMin: 12, countMax: 20 },
  utilities:          { min: 48000,   max: 72000,   countMin: 5, countMax: 8 },
  marketing:          { min: 245000,  max: 385000,  countMin: 6, countMax: 12 },
  office_admin:       { min: 35000,   max: 58000,   countMin: 6, countMax: 12 },
  taxes_compliance:   { min: 185000,  max: 265000,  countMin: 3, countMax: 4 },
  revenue_receipts:   { min: 2800000, max: 4500000, countMin: 10, countMax: 18 },
  loan_repayment:     { min: 285000,  max: 295000,  countMin: 1, countMax: 1 },
  miscellaneous:      { min: 22000,   max: 42000,   countMin: 5, countMax: 10 },
};

// Simple deterministic pseudo-random
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateTransactions(): Transaction[] {
  const rand = seededRandom(42);
  const transactions: Transaction[] = [];
  const accountIds = MOCK_ACCOUNTS.map((a) => a.id);
  const months: string[] = [];

  // Feb 2024 - Mar 2025 (14 months)
  for (let y = 2024; y <= 2025; y++) {
    const startM = y === 2024 ? 2 : 1;
    const endM = y === 2025 ? 3 : 12;
    for (let m = startM; m <= endM; m++) {
      months.push(`${y}-${String(m).padStart(2, "0")}`);
    }
  }

  let txId = 1;

  for (const month of months) {
    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr);
    const mo = parseInt(monthStr);
    const daysInMonth = new Date(year, mo, 0).getDate();

    for (const [cat, targets] of Object.entries(monthlyTargets)) {
      const category = cat as TransactionCategory;
      const isCredit = category === "revenue_receipts";
      const count = targets.countMin + Math.floor(rand() * (targets.countMax - targets.countMin + 1));
      const totalTarget = targets.min + rand() * (targets.max - targets.min);
      const templates = narrationTemplates[category];

      for (let i = 0; i < count; i++) {
        const day = 1 + Math.floor(rand() * daysInMonth);
        const dateStr = `${year}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const amount = Math.round(totalTarget / count + (rand() - 0.5) * (totalTarget / count) * 0.4);
        const accIdx = Math.floor(rand() * accountIds.length);
        const narIdx = Math.floor(rand() * templates.narrations.length);
        const vendIdx = Math.floor(rand() * templates.vendors.length);

        transactions.push({
          id: `txn_${String(txId++).padStart(5, "0")}`,
          accountId: accountIds[accIdx],
          date: dateStr,
          valueDate: dateStr,
          narration: templates.narrations[narIdx],
          referenceNo: `REF${String(Math.floor(rand() * 9999999)).padStart(7, "0")}`,
          type: isCredit ? "credit" : "debit",
          amount,
          balanceAfter: 0,
          category,
          vendorName: templates.vendors[vendIdx],
          tags: [],
          status: rand() > 0.05 ? "settled" : "pending",
          isAnomaly: false,
        });
      }
    }
  }

  // Inject known anomalies - Realistic scenarios
  
  // 1. March 2025: Unusually high vendor payment (possible fraud)
  transactions.push({
    id: "txn_anom_001",
    accountId: "acc_hdfc_001",
    date: "2025-03-12",
    valueDate: "2025-03-12",
    narration: "RTGS DR-GLOBAL TECH SOLUTIONS PVT LTD",
    referenceNo: "REF8400001",
    type: "debit",
    amount: 1250000,
    balanceAfter: 0,
    category: "vendor_payments",
    vendorName: "Global Tech Solutions",
    tags: [],
    status: "settled",
    isAnomaly: true,
    anomalyReason: "Amount is 2.5× category average — possible duplicate or unauthorized payment",
  });

  // 2. November 2024: Duplicate office supplies payment
  transactions.push({
    id: "txn_anom_002",
    accountId: "acc_icici_002",
    date: "2024-11-10",
    valueDate: "2024-11-10",
    narration: "NEFT DR-BOMBAY OFFICE SUPPLIES CO",
    referenceNo: "REF3500001",
    type: "debit",
    amount: 42000,
    balanceAfter: 0,
    category: "office_admin",
    vendorName: "Bombay Office Supplies",
    tags: [],
    status: "settled",
    isAnomaly: true,
    anomalyReason: "Duplicate payment — same vendor, same amount, 2 days apart",
  });
  transactions.push({
    id: "txn_anom_002b",
    accountId: "acc_icici_002",
    date: "2024-11-12",
    valueDate: "2024-11-12",
    narration: "NEFT DR-BOMBAY OFFICE SUPPLIES CO",
    referenceNo: "REF3500002",
    type: "debit",
    amount: 42000,
    balanceAfter: 0,
    category: "office_admin",
    vendorName: "Bombay Office Supplies",
    tags: [],
    status: "settled",
    isAnomaly: true,
    anomalyReason: "Duplicate payment — same vendor, same amount, 2 days apart",
  });

  // 3. January 2025: Suspicious round number marketing payment
  transactions.push({
    id: "txn_anom_003",
    accountId: "acc_hdfc_001",
    date: "2025-01-18",
    valueDate: "2025-01-18",
    narration: "NEFT DR-SCHBANG DIGITAL SOLUTIONS",
    referenceNo: "REF7500001",
    type: "debit",
    amount: 750000,
    balanceAfter: 0,
    category: "marketing",
    vendorName: "Schbang Digital",
    tags: [],
    status: "settled",
    isAnomaly: true,
    anomalyReason: "Unusually round number (₹7,50,000) — verify with supporting documents",
  });

  // 4. February 2025: Weekend transaction anomaly
  transactions.push({
    id: "txn_anom_004",
    accountId: "acc_sbi_003",
    date: "2025-02-15", // Saturday
    valueDate: "2025-02-15",
    narration: "IMPS DR-UNKNOWN VENDOR MUMBAI",
    referenceNo: "REF6200001",
    type: "debit",
    amount: 620000,
    balanceAfter: 0,
    category: "vendor_payments",
    vendorName: "Unknown Vendor",
    tags: [],
    status: "pending",
    isAnomaly: true,
    anomalyReason: "Large weekend transaction to unknown vendor — requires verification",
  });

  // 5. December 2024: Unusual travel expense spike
  transactions.push({
    id: "txn_anom_005",
    accountId: "acc_axis_004",
    date: "2024-12-20",
    valueDate: "2024-12-20",
    narration: "UPI DR-MAKEMYTRIP FLIGHT BOM NYC",
    referenceNo: "REF1850001",
    type: "debit",
    amount: 185000,
    balanceAfter: 0,
    category: "travel_expense",
    vendorName: "MakeMyTrip",
    tags: [],
    status: "settled",
    isAnomaly: true,
    anomalyReason: "International flight booking 3× higher than typical domestic travel",
  });

  // Sort by date desc
  transactions.sort((a, b) => b.date.localeCompare(a.date));

  return transactions;
}

export const MOCK_TRANSACTIONS: Transaction[] = generateTransactions();

console.log('=== MOCK DATA GENERATED ===');
console.log('Total MOCK_TRANSACTIONS:', MOCK_TRANSACTIONS.length);
console.log('Date range:', MOCK_TRANSACTIONS[0]?.date, 'to', MOCK_TRANSACTIONS[MOCK_TRANSACTIONS.length - 1]?.date);
const uniqueMonths = [...new Set(MOCK_TRANSACTIONS.map(t => t.date.slice(0, 7)))].sort();
console.log('Unique months:', uniqueMonths.length, uniqueMonths);
console.log('===========================');

export const getAnomalies = () =>
  MOCK_TRANSACTIONS.filter((t) => t.isAnomaly).map((t) => ({
    transactionId: t.id,
    reason: t.amount >= 1000000 ? "high_amount" as const :
            t.amount === 750000 || t.amount === 185000 ? "round_number" as const :
            t.date.includes("2024-11") && t.vendorName === "Bombay Office Supplies" ? "duplicate" as const :
            t.status === "pending" ? "weekend_transaction" as const :
            "unusual_pattern" as const,
    severity: t.amount >= 1000000 ? "high" as const : 
              t.amount >= 500000 ? "medium" as const : "low" as const,
    description: t.anomalyReason || "",
  }));
