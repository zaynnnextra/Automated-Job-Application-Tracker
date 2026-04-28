import { useEffect } from 'react'
import { useApplicationStore } from '@/store/useApplicationStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { getOverdueApplications } from '@/lib/automation'
import { sendNotification } from '@/lib/notifications'

export function useAutoReminders() {
  const applications = useApplicationStore((s) => s.applications)
  const config = useNotificationStore((s) => s.config)
  const dismissed = useNotificationStore((s) => s.dismissedReminderIds)

  useEffect(() => {
    if (!config.enabled || !config.browserNotificationsEnabled) return

    const check = () => {
      const overdue = getOverdueApplications(applications, config.rules, dismissed)
      overdue.forEach((app) => {
        sendNotification(
          `Follow up: ${app.company}`,
          `Your ${app.role} application at ${app.company} needs attention.`,
        )
      })
    }

    check()
    const interval = setInterval(check, 60 * 60 * 1000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') check()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [applications, config, dismissed])
}
