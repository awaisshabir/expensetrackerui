import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  // Use consistent English locale for number formatting, only change currency symbol
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM dd, yyyy')
}

export const formatMonth = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMMM yyyy')
}

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM')
}

export const getMonthStartEnd = (monthStr: string) => {
  const date = parseISO(`${monthStr}-01`)
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export const isDateInMonth = (date: string, month: string): boolean => {
  const { start, end } = getMonthStartEnd(month)
  return isWithinInterval(parseISO(date), { start, end })
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ')
}
