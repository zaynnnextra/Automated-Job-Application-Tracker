import { Application, ExportPayload, ReminderConfig } from '@/types'

export function exportToJson(
  applications: Application[],
  reminderConfig: ReminderConfig,
): string {
  const payload: ExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    applications,
    reminderConfig,
  }
  return JSON.stringify(payload, null, 2)
}

export function downloadJson(
  applications: Application[],
  reminderConfig: ReminderConfig,
): void {
  const content = exportToJson(applications, reminderConfig)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function parseJson(text: string): ExportPayload | null {
  try {
    const parsed = JSON.parse(text) as ExportPayload
    if (parsed.version !== 1 || !Array.isArray(parsed.applications)) return null
    return parsed
  } catch {
    return null
  }
}
