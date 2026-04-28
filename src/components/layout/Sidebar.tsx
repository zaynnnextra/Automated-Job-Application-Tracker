import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Kanban, List, Settings, Briefcase, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/useUIStore'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: List },
  { to: '/kanban', label: 'Kanban Board', icon: Kanban },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const { isSidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-card transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-56',
      )}
    >
      <div className={cn('flex items-center gap-2 px-4 py-4 border-b', isSidebarCollapsed && 'justify-center px-2')}>
        <Briefcase className="h-6 w-6 text-primary shrink-0" />
        {!isSidebarCollapsed && (
          <span className="font-bold text-sm leading-tight">Job Tracker</span>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.startsWith(to)
          const item = (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isSidebarCollapsed && 'justify-center px-2',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>{label}</span>}
            </Link>
          )
          if (isSidebarCollapsed) {
            return (
              <Tooltip key={to}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          }
          return item
        })}
      </nav>

      <div className="p-2 border-t">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="w-full">
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}
