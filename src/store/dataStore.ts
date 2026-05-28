import { create } from 'zustand'
import { Expense, Salary, Savings, DashboardData } from '@/types'

interface DataState {
  expenses: Expense[]
  salaries: Salary[]
  savings: Savings[]
  dashboardData: DashboardData | null
  setExpenses: (expenses: Expense[]) => void
  setSalaries: (salaries: Salary[]) => void
  setSavings: (savings: Savings[]) => void
  setDashboardData: (data: DashboardData) => void
}

export const useDataStore = create<DataState>((set) => ({
  expenses: [],
  salaries: [],
  savings: [],
  dashboardData: null,
  setExpenses: (expenses) => set({ expenses }),
  setSalaries: (salaries) => set({ salaries }),
  setSavings: (savings) => set({ savings }),
  setDashboardData: (data) => set({ dashboardData: data }),
}))
