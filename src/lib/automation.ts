import { addDays, isAfter, parseISO, differenceInDays, format } from 'date-fns'
import {
  Application,
  ApplicationStatus,
  FollowUpRule,
} from '@/types'

export function calculateFollowUpDate(
  app: Application,
  rules: FollowUpRule[],
): string | undefined {
  const rule = rules.find((r) => r.status === app.status)
  if (!rule) return undefined
  const base = app.updatedAt || app.appliedAt
  return format(addDays(parseISO(base), rule.daysThreshold), 'yyyy-MM-dd')
}

export interface AutoSuggestion {
  text: string
  urgency: 'low' | 'medium' | 'high'
  daysOverdue: number
}

export function getAutoSuggestion(
  app: Application,
  rules: FollowUpRule[],
): AutoSuggestion | null {
  const rule = rules.find((r) => r.status === app.status)
  if (!rule) return null

  const base = app.updatedAt || app.appliedAt
  const followUpDate = addDays(parseISO(base), rule.daysThreshold)
  const now = new Date()

  if (!isAfter(now, followUpDate)) return null

  const daysOverdue = differenceInDays(now, followUpDate)

  const suggestions: Record<ApplicationStatus, string> = {
    [ApplicationStatus.APPLIED]: 'Send follow-up email',
    [ApplicationStatus.PHONE_SCREEN]: 'Check interview status',
    [ApplicationStatus.INTERVIEW]: 'Send thank-you note',
    [ApplicationStatus.OFFER]: 'Respond to offer',
    [ApplicationStatus.WISHLIST]: 'Apply now',
    [ApplicationStatus.REJECTED]: '',
    [ApplicationStatus.WITHDRAWN]: '',
    [ApplicationStatus.GHOSTED]: '',
  }

  const text = suggestions[app.status]
  if (!text) return null

  return {
    text,
    urgency: daysOverdue >= 7 ? 'high' : daysOverdue >= 3 ? 'medium' : 'low',
    daysOverdue,
  }
}

export function getOverdueApplications(
  apps: Application[],
  rules: FollowUpRule[],
  dismissedIds: string[],
): Application[] {
  return apps.filter(
    (app) =>
      !dismissedIds.includes(app.id) &&
      getAutoSuggestion(app, rules) !== null,
  )
}

export function getDaysAgo(dateStr: string): number {
  return differenceInDays(new Date(), parseISO(dateStr))
}
