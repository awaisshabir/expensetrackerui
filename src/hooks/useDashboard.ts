import { useQuery } from '@tanstack/react-query'
import { expensesAPI, salaryAPI, savingsAPI } from '@/services/api'
import { DashboardData, Expense, Salary } from '@/types'
import { getCurrentMonth, isDateInMonth } from '@/utils/helpers'
import { useDataStore } from '@/store/dataStore'

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const [expensesRes, salariesRes, savingsRes] = await Promise.all([
        expensesAPI.getAll(),
        salaryAPI.getAll(),
        savingsAPI.getAll(),
      ])

      const expenses = expensesRes.data
      const salaries = salariesRes.data
      const savings = savingsRes.data

      const currentMonth = getCurrentMonth()

      // Calculate current month income
      const currentSalary = salaries.find((s) => s.month === currentMonth)
      const totalIncome = currentSalary
        ? currentSalary.salary + currentSalary.bonus + currentSalary.otherIncome
        : 0

      // Calculate current month expenses
      const currentMonthExpenses = expenses.filter((e) =>
        isDateInMonth(e.date, currentMonth)
      )
      const totalExpenses = currentMonthExpenses.reduce(
        (sum, e) => sum + e.amount,
        0
      )

      // Calculate total savings
      const totalSavings = savings.reduce((sum, s) => sum + s.currentAmount, 0)

      // Calculate remaining balance
      const remainingBalance = totalIncome - totalExpenses - totalSavings

      // Get recent expenses (last 10)
      const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)

      // Group expenses by category
      const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
        const existing = acc.find((e) => e.category === expense.category)
        if (existing) {
          existing.amount += expense.amount
        } else {
          acc.push({ category: expense.category, amount: expense.amount })
        }
        return acc
      }, [] as { category: string; amount: number }[])

      // Calculate monthly trend (last 6 months)
      const monthlyTrend = calculateMonthlyTrend(expenses, salaries)

      const data: DashboardData = {
        totalIncome,
        totalExpenses,
        totalSavings,
        remainingBalance,
        recentExpenses,
        expensesByCategory,
        monthlyTrend,
      }

      useDataStore.getState().setDashboardData(data)
      return data
    },
  })
}

function calculateMonthlyTrend(
  expenses: Expense[],
  salaries: Salary[]
): { month: string; income: number; expenses: number }[] {
  const months: { month: string; income: number; expenses: number }[] = []
  const date = new Date()

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(date.getFullYear(), date.getMonth() - i, 1)
    const monthStr = monthDate.toISOString().slice(0, 7)

    const monthSalary = salaries.find((s) => s.month === monthStr)
    const income = monthSalary
      ? monthSalary.salary + monthSalary.bonus + monthSalary.otherIncome
      : 0

    const monthExpenses = expenses
      .filter((e) => isDateInMonth(e.date, monthStr))
      .reduce((sum, e) => sum + e.amount, 0)

    months.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expenses: monthExpenses,
    })
  }

  return months
}
