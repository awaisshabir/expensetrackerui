export interface User {
  id: string;
  email: string;
  name: string;
  currency: string;
}

export interface Expense {
  id?: string;
  _id?: string;
  date: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes: string;
  createdAt?: string;
}

export interface Salary {
  month: string;
  salary: number;
  bonus: number;
  otherIncome: number;
}

export interface Savings {
  goal: string;
  targetAmount: number;
  currentAmount: number;
}

export interface RecurringExpense {
  name: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  remaining: number;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  remainingBalance: number;
  recentExpenses: Expense[];
  expensesByCategory: { category: string; amount: number }[];
  monthlyTrend: { month: string; income: number; expenses: number }[];
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Personal Care',
  'Rent/Mortgage',
  'Insurance',
  'Investments',
  'Other',
] as const;

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Wallet',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];
