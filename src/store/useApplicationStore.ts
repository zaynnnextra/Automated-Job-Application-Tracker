import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Application,
  ApplicationStatus,
  Contact,
  FilterState,
  Note,
  SortState,
} from '@/types'
import { SEED_APPLICATIONS } from '@/lib/seedData'
import { calculateFollowUpDate } from '@/lib/automation'
import { DEFAULT_FOLLOW_UP_RULES } from '@/types'

interface ApplicationStore {
  applications: Application[]
  filters: FilterState
  sort: SortState
  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void
  updateApplication: (id: string, updates: Partial<Application>) => void
  deleteApplication: (id: string) => void
  updateStatus: (id: string, status: ApplicationStatus, note?: string) => void
  addNote: (appId: string, content: string) => void
  updateNote: (appId: string, noteId: string, content: string) => void
  deleteNote: (appId: string, noteId: string) => void
  addContact: (appId: string, contact: Omit<Contact, 'id'>) => void
  updateContact: (appId: string, contactId: string, updates: Partial<Contact>) => void
  deleteContact: (appId: string, contactId: string) => void
  importApplications: (apps: Application[], merge: boolean) => void
  clearAll: () => void
  setFilters: (filters: Partial<FilterState>) => void
  setSort: (sort: SortState) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  search: '',
  statuses: [],
  priorities: [],
  workModes: [],
}

const defaultSort: SortState = { field: 'updatedAt', direction: 'desc' }

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: SEED_APPLICATIONS,
      filters: defaultFilters,
      sort: defaultSort,

      addApplication: (app) => {
        const now = new Date().toISOString()
        const id = crypto.randomUUID()
        const newApp: Application = {
          ...app,
          id,
          createdAt: now,
          updatedAt: now,
          statusHistory: [{ id: crypto.randomUUID(), status: app.status, changedAt: now }],
        }
        const followUpDate = calculateFollowUpDate(newApp, DEFAULT_FOLLOW_UP_RULES)
        if (followUpDate && !newApp.followUpDate) newApp.followUpDate = followUpDate
        set((s) => ({ applications: [newApp, ...s.applications] }))
      },

      updateApplication: (id, updates) => {
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, updatedAt: new Date().toISOString() }
              : app,
          ),
        }))
      },

      deleteApplication: (id) => {
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) }))
      },

      updateStatus: (id, status, note) => {
        const now = new Date().toISOString()
        set((s) => ({
          applications: s.applications.map((app) => {
            if (app.id !== id) return app
            const updated = {
              ...app,
              status,
              updatedAt: now,
              statusHistory: [
                ...app.statusHistory,
                { id: crypto.randomUUID(), status, changedAt: now, note },
              ],
            }
            const followUpDate = calculateFollowUpDate(updated, DEFAULT_FOLLOW_UP_RULES)
            if (followUpDate) updated.followUpDate = followUpDate
            return updated
          }),
        }))
        // Dismiss any cached suggestion for this app since status changed
        get
      },

      addNote: (appId, content) => {
        const now = new Date().toISOString()
        const note: Note = { id: crypto.randomUUID(), content, createdAt: now, updatedAt: now }
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === appId
              ? { ...app, notes: [note, ...app.notes], updatedAt: now }
              : app,
          ),
        }))
      },

      updateNote: (appId, noteId, content) => {
        const now = new Date().toISOString()
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === appId
              ? {
                  ...app,
                  notes: app.notes.map((n) =>
                    n.id === noteId ? { ...n, content, updatedAt: now } : n,
                  ),
                  updatedAt: now,
                }
              : app,
          ),
        }))
      },

      deleteNote: (appId, noteId) => {
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === appId
              ? { ...app, notes: app.notes.filter((n) => n.id !== noteId) }
              : app,
          ),
        }))
      },

      addContact: (appId, contact) => {
        const newContact: Contact = { ...contact, id: crypto.randomUUID() }
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === appId
              ? { ...app, contacts: [...app.contacts, newContact] }
              : app,
          ),
        }))
      },

      updateContact: (appId, contactId, updates) => {
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === appId
              ? {
                  ...app,
                  contacts: app.contacts.map((c) =>
                    c.id === contactId ? { ...c, ...updates } : c,
                  ),
                }
              : app,
          ),
        }))
      },

      deleteContact: (appId, contactId) => {
        set((s) => ({
          applications: s.applications.map((app) =>
            app.id === appId
              ? { ...app, contacts: app.contacts.filter((c) => c.id !== contactId) }
              : app,
          ),
        }))
      },

      importApplications: (apps, merge) => {
        set((s) => ({
          applications: merge ? [...apps, ...s.applications.filter((a) => !apps.find((b) => b.id === a.id))] : apps,
        }))
      },

      clearAll: () => set({ applications: [] }),

      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),

      setSort: (sort) => set({ sort }),

      resetFilters: () => set({ filters: defaultFilters }),
    }),
    { name: 'job-tracker-applications' },
  ),
)
