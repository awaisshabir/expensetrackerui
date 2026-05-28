import { useState } from 'react'
import { useExpenses, useSalaries, useSavings } from '@/hooks/useData'
import { exportAPI } from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import { formatCurrency, getCurrentMonth, isDateInMonth, formatMonth } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import { FileText, Download, Calendar } from 'lucide-react'

const ReportsPage = () => {
  const { data: expenses, isLoading: expensesLoading } = useExpenses()
  const { data: salaries, isLoading: salariesLoading } = useSalaries()
  const { data: savings, isLoading: savingsLoading } = useSavings()
  const { user } = useAuthStore()
  const currency = user?.currency || 'SAR'

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null)

  const isLoading = expensesLoading || salariesLoading || savingsLoading

  // Get available months from salaries
  const availableMonths = salaries?.map((s) => s.month).sort().reverse() || [getCurrentMonth()]

  // Filter data for selected month
  const monthExpenses = expenses?.filter((exp) => isDateInMonth(exp.date, selectedMonth)) || []
  const monthSalary = salaries?.find((s) => s.month === selectedMonth)
  const totalSavings = savings?.reduce((sum, s) => sum + s.currentAmount, 0) || 0

  // Calculate summary
  const totalIncome = monthSalary
    ? monthSalary.salary + monthSalary.bonus + monthSalary.otherIncome
    : 0
  const totalExpenses = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remainingBalance = totalIncome - totalExpenses - totalSavings

  const expensesByCategory = (monthExpenses || []).reduce((acc, expense) => {
    const existing = acc.find((e) => e.category === expense.category)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({ category: expense.category, amount: expense.amount })
    }
    return acc
  }, [] as { category: string; amount: number }[])

  const handleExportExcel = async () => {
    setIsExporting(true)
    setExportType('excel')
    try {
      // Calculate start and end dates for the selected month
      const [year, month] = selectedMonth.split('-')
      const startDate = `${year}-${month}-01`
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
      const endDate = `${year}-${month}-${lastDay}`
      
      await exportAPI.downloadExcel({ startDate, endDate })
    } catch (error: any) {
      alert(error.message || 'Failed to export Excel file')
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    setExportType('pdf')
    try {
      // Calculate start and end dates for the selected month
      const [year, month] = selectedMonth.split('-')
      const startDate = `${year}-${month}-01`
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
      const endDate = `${year}-${month}-${lastDay}`
      
      await exportAPI.downloadPDF({ startDate, endDate })
    } catch (error: any) {
      alert(error.message || 'Failed to export PDF file')
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate and export financial reports
        </p>
      </div>

      {/* Controls */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Month Selection */}
          <div>
            <label className="label">Select Month</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input pl-10"
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month + '-01')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div>
            <label className="label">&nbsp;</label>
            <div className="flex gap-3">
              <button
                onClick={handleExportExcel}
                disabled={isExporting}
                className="btn-primary flex items-center justify-center flex-1 disabled:opacity-50"
              >
                <Download size={18} className="mr-2" />
                {isExporting && exportType === 'excel' ? 'Exporting...' : 'Export Excel'}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="btn-primary flex items-center justify-center flex-1 disabled:opacity-50"
              >
                <FileText size={18} className="mr-2" />
                {isExporting && exportType === 'pdf' ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <FileText className="text-primary-600 dark:text-primary-400 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Monthly Summary
          </h2>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {formatCurrency(totalIncome, currency)}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-purple-700 dark:text-purple-400 mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {formatCurrency(totalSavings, currency)}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Remaining</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {formatCurrency(remainingBalance, currency)}
            </p>
          </div>
        </div>

        {/* Income Details */}
        {monthSalary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Income Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Salary</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                      {formatCurrency(monthSalary.salary, currency)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Bonus</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                      {formatCurrency(monthSalary.bonus, currency)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Other Income</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                      {formatCurrency(monthSalary.otherIncome, currency)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800 font-semibold">
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Total Income</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(totalIncome, currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses by Category */}
        {expensesByCategory.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Expenses by Category
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Amount
                    </th>
                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expensesByCategory.map((expense, index) => (
                    <tr
                      key={expense.category}
                      className={
                        index !== expensesByCategory.length - 1
                          ? 'border-b border-gray-100 dark:border-gray-800'
                          : ''
                      }
                    >
                      <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">
                        {expense.category}
                      </td>
                      <td className="py-2 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(expense.amount, currency)}
                      </td>
                      <td className="py-2 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                        {((expense.amount / totalExpenses) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-800 font-semibold">
                    <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Total</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      {formatCurrency(totalExpenses, currency)}
                    </td>
                    <td className="py-2 px-4 text-sm text-right text-gray-900 dark:text-gray-100">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {expensesByCategory.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No expenses found for the selected month
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage
