export function localDateKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function shiftDateKey(key: string, days: number): string {
  const date = parseDateKey(key)
  date.setDate(date.getDate() + days)
  return localDateKey(date)
}

export function formatDayHeading(key: string): string {
  const today = localDateKey()
  if (key === today) return 'Today'
  if (key === shiftDateKey(today, -1)) return 'Yesterday'
  if (key === shiftDateKey(today, 1)) return 'Tomorrow'
  return parseDateKey(key).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function mealHourLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function lastNDateKeys(n: number, endKey = localDateKey()): string[] {
  return Array.from({ length: n }, (_, i) => shiftDateKey(endKey, i - (n - 1)))
}

export function isoOnDate(dateKey: string, from = new Date()): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d, from.getHours(), from.getMinutes(), from.getSeconds()).toISOString()
}
