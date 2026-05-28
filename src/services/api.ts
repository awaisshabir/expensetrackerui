const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get token from localStorage
const getToken = () => {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage)
      return parsed.state?.token
    } catch (error) {
      return null
    }
  }
  return null
}

// API request helper
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  getMe: async () => {
    return apiRequest('/auth/me')
  },

  updateProfile: async (name: string, currency: string) => {
    return apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, currency }),
    })
  },
}

// Expenses API
export const expensesAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/expenses${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return apiRequest(`/expenses/${id}`)
  },

  create: async (data) => {
    return apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id, data) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    })
  },

  getStats: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/expenses/stats${query ? `?${query}` : ''}`)
  },
}

// Salary API
export const salaryAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/salary${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return apiRequest(`/salary/${id}`)
  },

  create: async (data) => {
    return apiRequest('/salary', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id, data) => {
    return apiRequest(`/salary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id) => {
    return apiRequest(`/salary/${id}`, {
      method: 'DELETE',
    })
  },

  getStats: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/salary/stats${query ? `?${query}` : ''}`)
  },
}

// Savings API
export const savingsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/savings${query ? `?${query}` : ''}`)
  },

  getById: async (id) => {
    return apiRequest(`/savings/${id}`)
  },

  create: async (data) => {
    return apiRequest('/savings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id, data) => {
    return apiRequest(`/savings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id) => {
    return apiRequest(`/savings/${id}`, {
      method: 'DELETE',
    })
  },

  addAmount: async (id, amount) => {
    return apiRequest(`/savings/${id}/add`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
}

// Export API
export const exportAPI = {
  downloadExcel: async (params = {}) => {
    const token = getToken()
    const query = new URLSearchParams(params).toString()
    
    const response = await fetch(
      `${API_URL}/export/excel${query ? `?${query}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      // Try to get error message from response
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to download Excel file')
      }
      throw new Error(`Failed to download Excel file: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-tracker-${Date.now()}.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  },

  downloadPDF: async (params = {}) => {
    const token = getToken()
    const query = new URLSearchParams(params).toString()
    
    const response = await fetch(
      `${API_URL}/export/pdf${query ? `?${query}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      // Try to get error message from response
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to download PDF file')
      }
      throw new Error(`Failed to download PDF file: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-tracker-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  },
}
