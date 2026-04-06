import { Transaction } from '@/types';

/**
 * Convert transactions to CSV format
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  // CSV Headers
  const headers = [
    'Date',
    'Value Date',
    'Narration',
    'Reference No',
    'Type',
    'Amount',
    'Category',
    'Vendor',
    'Status',
    'Account ID',
    'Tags',
    'Is Anomaly'
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map((t) => [
    t.date,
    t.valueDate,
    `"${t.narration.replace(/"/g, '""')}"`, // Escape quotes
    t.referenceNo,
    t.type,
    t.amount.toFixed(2),
    t.category,
    t.vendorName || '',
    t.status,
    t.accountId,
    t.tags.join(';'),
    t.isAnomaly ? 'Yes' : 'No'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'transactions.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download link
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Convert transactions to JSON and download
 */
export function downloadJSON(transactions: Transaction[], filename: string = 'transactions.json'): void {
  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export transactions in specified format
 */
export function exportTransactions(
  transactions: Transaction[],
  format: 'csv' | 'json' = 'csv'
): void {
  if (format === 'csv') {
    const csv = transactionsToCSV(transactions);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `transactions_${timestamp}.csv`);
  } else {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadJSON(transactions, `transactions_${timestamp}.json`);
  }
}
