import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// دمج الفئات مع Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// تنسيق التاريخ والوقت
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// تنسيق الأرقام
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'م'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'ك'
  }
  return num.toString()
}

// التحقق من صحة البريد الإلكتروني
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// التحقق من قوة كلمة المرور
export function isStrongPassword(password: string): boolean {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password)
}

// تقصير النص
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
