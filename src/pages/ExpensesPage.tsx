import { useState } from 'react'
import { useExpenses, useAddExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/useData'
import { Expense, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { formatCurrency, formatDate } from '@/utils/helpers'
import { useAuthStore } from '@/store/authStore'
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react'

const ExpensesPage = () => {
  const { data: expenses, isLoading } = useExpenses()
  const { user } = useAuthStore()
  const currency = user?.currency || 'SAR'
  const addExpense = useAddExpense()
  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<{ expense: Expense; index: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: EXPENSE_CATEGORIES[0] as string,
    amount: '',
    paymentMethod: PAYMENT_METHODS[0] as string,
    notes: '',
  })

  const handleOpenModal = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: EXPENSE_CATEGORIES[0] as string,
      amount: '',
      paymentMethod: PAYMENT_METHODS[0] as string,
      notes: '',
    })
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const handleEditExpense = (expense: Expense, index: number) => {
    // Format date to YYYY-MM-DD for input
    const dateObj = new Date(expense.date)
    const formattedDate = dateObj.toISOString().split('T')[0]
    
    setFormData({
      date: formattedDate,
      category: expense.category,
      amount: expense.amount.toString(),
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || '',
    })
    setEditingExpense({ expense, index })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingExpense) {
      await updateExpense.mutateAsync({
        expense: {
          ...editingExpense.expense,
          date: formData.date,
          category: formData.category,
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        },
      })
    } else {
      await addExpense.mutateAsync({
        date: formData.date,
        category: formData.category,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      })
    }

    setIsModalOpen(false)
  }

  const handleDeleteExpense = async (id: string | undefined) => {
    if (id && confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense.mutateAsync(id)
    }
  }

  const filteredExpenses = expenses?.filter((expense: Expense) => {
    const matchesSearch =
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.notes.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  }) || []

  const totalExpenses = filteredExpenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0)

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your expenses
          </p>
        </div>
        <button onClick={handleOpenModal} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Add Expense
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input pl-10"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((category: string) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Expenses:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(totalExpenses, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="card overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense: Expense) => (
                  <tr
                    key={expense.id || expense._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(expense.date)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {expense.category}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {expense.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {expense.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(expense.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditExpense(expense, 0)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id || expense._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No expenses found. Add your first expense!
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              required
            >
              {EXPENSE_CATEGORIES.map((category: string) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="label">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="input"
              required
            >
              {PAYMENT_METHODS.map((method: string) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows={3}
              placeholder="Additional details..."
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
              disabled={addExpense.isPending || updateExpense.isPending}
            >
              {addExpense.isPending || updateExpense.isPending ? (
                <LoadingSpinner size="sm" />
              ) : editingExpense ? (
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

export default ExpensesPage
