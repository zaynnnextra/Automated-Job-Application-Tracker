import { X, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApplicationStore } from '@/store/useApplicationStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { getOverdueApplications } from '@/lib/automation'

export function ReminderBanner() {
  const applications = useApplicationStore((s) => s.applications)
  const { config, dismissedReminderIds, clearDismissed } = useNotificationStore()

  if (!config.enabled) return null

  const overdue = getOverdueApplications(applications, config.rules, dismissedReminderIds)
  if (overdue.length === 0) return null

  return (
    <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-sm">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
        <Bell className="h-4 w-4" />
        <span>
          <strong>{overdue.length}</strong> application{overdue.length > 1 ? 's' : ''} need
          {overdue.length === 1 ? 's' : ''} follow-up attention
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
        onClick={clearDismissed}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
