import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatPercentile(percentile: number): string {
  const suffix = getOrdinalSuffix(Math.round(percentile))
  return `${Math.round(percentile)}${suffix}`
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}

export function getAgeBand(age: number): string {
  if (age < 18) return 'Under 18'
  if (age <= 22) return '18-22'
  if (age <= 27) return '23-27'
  if (age <= 32) return '28-32'
  if (age <= 37) return '33-37'
  if (age <= 42) return '38-42'
  if (age <= 47) return '43-47'
  if (age <= 52) return '48-52'
  if (age <= 57) return '53-57'
  if (age <= 62) return '58-62'
  return '63+'
}

export function getCohortKey(age: number, sex: string, region: string): string {
  const ageBand = getAgeBand(age)
  return `${ageBand}_${sex}_${region}`
}