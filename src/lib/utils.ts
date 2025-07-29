import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num)
}

export function calculateMonthlyPayment(
  loanAmount: number,
  downPayment: number,
  loanTermMonths: number,
  interestRate: number = 0.12 // 12% годовых по умолчанию
): number {
  const principal = loanAmount - downPayment
  const monthlyRate = interestRate / 12
  
  if (monthlyRate === 0) {
    return principal / loanTermMonths
  }
  
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
  
  return Math.round(monthlyPayment)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Новая':
      return 'bg-blue-100 text-blue-800'
    case 'На рассмотрении':
      return 'bg-yellow-100 text-yellow-800'
    case 'Одобрена':
      return 'bg-green-100 text-green-800'
    case 'Отклонена':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}