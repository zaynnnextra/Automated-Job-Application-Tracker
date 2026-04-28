import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'
import { Toaster } from '@/components/ui/toaster'
import { ReminderBanner } from '@/components/reminders/ReminderBanner'
import { ApplicationFormDialog } from '@/components/forms/ApplicationFormDialog'
import { useUIStore } from '@/store/useUIStore'
import { useAutoReminders } from '@/hooks/useAutoReminders'
import { TooltipProvider } from '@/components/ui/tooltip'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/applications': 'Applications',
  '/kanban': 'Kanban Board',
  '/settings': 'Settings',
}

export function AppShell() {
  const { theme } = useUIStore()
  const location = useLocation()
  useAutoReminders()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    }
  }, [theme])

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1] ?? 'Job Tracker'

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar title={title} />
          <ReminderBanner />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <Outlet />
          </main>
          <MobileNav />
        </div>
      </div>
      <ApplicationFormDialog />
      <Toaster />
    </TooltipProvider>
  )
}
