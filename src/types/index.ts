export enum ApplicationStatus {
  WISHLIST = 'Wishlist',
  APPLIED = 'Applied',
  PHONE_SCREEN = 'Phone Screen',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn',
  GHOSTED = 'Ghosted',
}

export enum WorkMode {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ONSITE = 'On-site',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Contact {
  id: string
  name: string
  title: string
  email?: string
  linkedin?: string
  phone?: string
  notes?: string
}

export interface Note {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface StatusHistoryEntry {
  id: string
  status: ApplicationStatus
  changedAt: string
  note?: string
}

export interface Application {
  id: string
  company: string
  role: string
  url?: string
  status: ApplicationStatus
  priority: Priority
  workMode: WorkMode
  location?: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  appliedAt: string
  followUpDate?: string
  nextAction?: string
  source?: string
  contacts: Contact[]
  notes: Note[]
  statusHistory: StatusHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export interface FollowUpRule {
  status: ApplicationStatus
  daysThreshold: number
}

export interface ReminderConfig {
  enabled: boolean
  browserNotificationsEnabled: boolean
  rules: FollowUpRule[]
}

export type SortField = 'company' | 'role' | 'appliedAt' | 'updatedAt' | 'status' | 'priority'
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'dashboard' | 'kanban' | 'table'

export interface FilterState {
  search: string
  statuses: ApplicationStatus[]
  priorities: Priority[]
  workModes: WorkMode[]
  dateFrom?: string
  dateTo?: string
}

export interface SortState {
  field: SortField
  direction: SortDirection
}

export interface ExportPayload {
  version: 1
  exportedAt: string
  applications: Application[]
  reminderConfig: ReminderConfig
}

export const STATUS_ORDER: ApplicationStatus[] = [
  ApplicationStatus.WISHLIST,
  ApplicationStatus.APPLIED,
  ApplicationStatus.PHONE_SCREEN,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.GHOSTED,
]

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.WISHLIST]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  [ApplicationStatus.APPLIED]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  [ApplicationStatus.PHONE_SCREEN]: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  [ApplicationStatus.INTERVIEW]: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  [ApplicationStatus.OFFER]: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  [ApplicationStatus.WITHDRAWN]: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  [ApplicationStatus.GHOSTED]: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-green-400',
  [Priority.MEDIUM]: 'bg-amber-400',
  [Priority.HIGH]: 'bg-red-500',
}

export const DEFAULT_FOLLOW_UP_RULES: FollowUpRule[] = [
  { status: ApplicationStatus.APPLIED, daysThreshold: 7 },
  { status: ApplicationStatus.PHONE_SCREEN, daysThreshold: 3 },
  { status: ApplicationStatus.INTERVIEW, daysThreshold: 2 },
  { status: ApplicationStatus.OFFER, daysThreshold: 1 },
]
