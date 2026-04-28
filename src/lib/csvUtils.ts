import { Application } from '@/types'

const CSV_HEADERS = [
  'id', 'company', 'role', 'status', 'priority', 'workMode', 'location',
  'appliedAt', 'followUpDate', 'salaryMin', 'salaryMax', 'currency',
  'url', 'source', 'nextAction', 'updatedAt', 'createdAt',
]

function escapeCsv(value: unknown): string {
  const str = value == null ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCsv(applications: Application[]): string {
  const rows = applications.map((app) =>
    CSV_HEADERS.map((h) => escapeCsv(app[h as keyof Application])).join(','),
  )
  return [CSV_HEADERS.join(','), ...rows].join('\n')
}

export function downloadCsv(applications: Application[]): void {
  const content = exportToCsv(applications)
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function parseCsv(text: string): Partial<Application>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] ?? '').trim() })
    return obj as Partial<Application>
  })
}
