import { Moon, Sun, Plus, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { useApplicationStore } from '@/store/useApplicationStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { getOverdueApplications } from '@/lib/automation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ReminderList } from '@/components/reminders/ReminderList'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { theme, setTheme, openAddDialog } = useUIStore()
  const applications = useApplicationStore((s) => s.applications)
  const { config, dismissedReminderIds } = useNotificationStore()
  const overdueCount = getOverdueApplications(applications, config.rules, dismissedReminderIds).length

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 bg-card">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {overdueCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {overdueCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <ReminderList />
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button size="sm" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-1" />
          Add Application
        </Button>
      </div>
    </header>
  )
}
