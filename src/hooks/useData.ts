import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesAPI, salaryAPI, savingsAPI } from '@/services/api'
import { Expense, Salary, Savings } from '@/types'
import { useDataStore } from '@/store/dataStore'

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expensesAPI.getAll()
      // Transform _id to id for frontend compatibility
      const expenses = response.data.map((expense: any) => ({
        ...expense,
        id: expense._id || expense.id,
      }))
      useDataStore.getState().setExpenses(expenses)
      return expenses
    },
  })
}

export const useAddExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expense: Omit<Expense, 'id' | 'createdAt'>) =>
      expensesAPI.create(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ expense }: { expense: Expense }) =>
      expensesAPI.update(expense.id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => expensesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useSalaries = () => {
  return useQuery({
    queryKey: ['salaries'],
    queryFn: async () => {
      const response = await salaryAPI.getAll()
      const salaries = response.data
      useDataStore.getState().setSalaries(salaries)
      return salaries
    },
  })
}

export const useAddSalary = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (salary: Salary) => salaryAPI.create(salary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useUpdateSalary = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ salary }: { salary: Salary }) =>
      salaryAPI.update(salary.id, salary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useSavings = () => {
  return useQuery({
    queryKey: ['savings'],
    queryFn: async () => {
      const response = await savingsAPI.getAll()
      const savings = response.data
      useDataStore.getState().setSavings(savings)
      return savings
    },
  })
}

export const useAddSavings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (savings: Savings) => savingsAPI.create(savings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
