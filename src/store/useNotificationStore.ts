import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ApplicationStatus, DEFAULT_FOLLOW_UP_RULES, FollowUpRule, ReminderConfig } from '@/types'

interface NotificationStore {
  config: ReminderConfig
  updateConfig: (updates: Partial<ReminderConfig>) => void
  updateRule: (status: ApplicationStatus, daysThreshold: number) => void
  dismissedReminderIds: string[]
  dismissReminder: (appId: string) => void
  clearDismissed: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      config: {
        enabled: true,
        browserNotificationsEnabled: false,
        rules: DEFAULT_FOLLOW_UP_RULES,
      },
      updateConfig: (updates) =>
        set((s) => ({ config: { ...s.config, ...updates } })),
      updateRule: (status, daysThreshold) =>
        set((s) => ({
          config: {
            ...s.config,
            rules: s.config.rules.map((r: FollowUpRule) =>
              r.status === status ? { ...r, daysThreshold } : r,
            ),
          },
        })),
      dismissedReminderIds: [],
      dismissReminder: (appId) =>
        set((s) => ({ dismissedReminderIds: [...s.dismissedReminderIds, appId] })),
      clearDismissed: () => set({ dismissedReminderIds: [] }),
    }),
    { name: 'job-tracker-notifications' },
  ),
)
