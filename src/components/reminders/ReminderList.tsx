import { Link } from 'react-router-dom'
import { useApplicationStore } from '@/store/useApplicationStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { getAutoSuggestion, getOverdueApplications } from '@/lib/automation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function ReminderList() {
  const applications = useApplicationStore((s) => s.applications)
  const { config, dismissedReminderIds, dismissReminder } = useNotificationStore()
  const overdue = getOverdueApplications(applications, config.rules, dismissedReminderIds)

  if (overdue.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No pending follow-ups
      </div>
    )
  }

  return (
    <div>
      <div className="px-4 py-2 border-b font-semibold text-sm">
        Follow-up Reminders ({overdue.length})
      </div>
      <ScrollArea className="max-h-80">
        <div className="divide-y">
          {overdue.map((app) => {
            const suggestion = getAutoSuggestion(app, config.rules)
            return (
              <div key={app.id} className="flex items-start gap-2 p-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/applications/${app.id}`}
                    className="text-sm font-medium hover:underline truncate block"
                  >
                    {app.company}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{app.role}</p>
                  {suggestion && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      {suggestion.text} · {suggestion.daysOverdue}d overdue
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => dismissReminder(app.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
