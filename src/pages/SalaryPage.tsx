import { useState } from 'react'
import { useSalaries, useAddSalary, useUpdateSalary } from '@/hooks/useData'
import { Salary } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { formatCurrency, formatMonth, getCurrentMonth } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import { Plus, Edit, DollarSign } from 'lucide-react'

const SalaryPage = () => {
  const { data: salaries, isLoading } = useSalaries()
  const { user } = useAuthStore()
  const currency = user?.currency || 'SAR'
  const addSalary = useAddSalary()
  const updateSalary = useUpdateSalary()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSalary, setEditingSalary] = useState<{ salary: Salary; index: number } | null>(null)

  const [formData, setFormData] = useState({
    month: getCurrentMonth(),
    salary: '',
    bonus: '',
    otherIncome: '',
  })

  const handleOpenModal = () => {
    setFormData({
      month: getCurrentMonth(),
      salary: '',
      bonus: '',
      otherIncome: '',
    })
    setEditingSalary(null)
    setIsModalOpen(true)
  }

  const handleEditSalary = (salary: Salary, index: number) => {
    setFormData({
      month: salary.month,
      salary: salary.salary.toString(),
      bonus: salary.bonus.toString(),
      otherIncome: salary.otherIncome.toString(),
    })
    setEditingSalary({ salary, index })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const salaryData: Salary = {
      month: formData.month,
      salary: parseFloat(formData.salary) || 0,
      bonus: parseFloat(formData.bonus) || 0,
      otherIncome: parseFloat(formData.otherIncome) || 0,
    }

    if (editingSalary) {
      await updateSalary.mutateAsync({
        salary: salaryData,
        rowIndex: editingSalary.index,
      })
    } else {
      await addSalary.mutateAsync(salaryData)
    }

    setIsModalOpen(false)
  }

  const currentMonthSalary = salaries?.find((s) => s.month === getCurrentMonth())

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Salary</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your monthly income sources
          </p>
        </div>
        <button onClick={handleOpenModal} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Salary
        </button>
      </div>

      {/* Current Month Summary */}
      {currentMonthSalary && (
        <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              This Month's Income
            </h2>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <DollarSign className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Salary</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(currentMonthSalary.salary, currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bonus</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(currentMonthSalary.bonus, currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Other Income</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(currentMonthSalary.otherIncome, currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(
                  currentMonthSalary.salary +
                    currentMonthSalary.bonus +
                    currentMonthSalary.otherIncome,
                  currency
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Salary History */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Income History
          </h2>
        </div>

        {salaries && salaries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Salary
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bonus
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Other Income
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...salaries]
                  .sort((a, b) => b.month.localeCompare(a.month))
                  .map((salary, index) => {
                    const total = salary.salary + salary.bonus + salary.otherIncome
                    return (
                      <tr
                        key={salary.month}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {formatMonth(salary.month + '-01')}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(salary.salary, currency)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(salary.bonus, currency)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(salary.otherIncome, currency)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(total, currency)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleEditSalary(salary, index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No salary records yet. Add your first income entry!
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSalary ? 'Edit Salary' : 'Add Salary'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Month</label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Salary</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="input"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="label">Bonus (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.bonus}
              onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
              className="input"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Other Income (Optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.otherIncome}
              onChange={(e) => setFormData({ ...formData, otherIncome: e.target.value })}
              className="input"
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={addSalary.isPending || updateSalary.isPending}
            >
              {addSalary.isPending || updateSalary.isPending ? (
                <LoadingSpinner size="sm" />
              ) : editingSalary ? (
                'Update'
              ) : (
                'Add'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SalaryPage
