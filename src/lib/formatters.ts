import { format, parseISO } from "date-fns";

export const formatINR = (amount: number, compact = false): string => {
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)}L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${abs.toFixed(0)}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), "dd MMM yyyy");
};

export const formatShortMonth = (dateStr: string): string => {
  return format(parseISO(dateStr + "-01"), "MMM ''yy");
};

export const formatDelta = (delta: number): string => {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
};
