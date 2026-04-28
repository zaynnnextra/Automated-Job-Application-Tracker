import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApplicationStore } from '@/store/useApplicationStore'
import { ApplicationStatus, Priority } from '@/types'
import { cn } from '@/lib/utils'

export function ApplicationsToolbar() {
  const { filters, setFilters, resetFilters } = useApplicationStore()
  const hasFilters = filters.search || filters.statuses.length > 0 || filters.priorities.length > 0

  const toggleStatus = (status: ApplicationStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    setFilters({ statuses: next })
  }

  const togglePriority = (priority: Priority) => {
    const next = filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority]
    setFilters({ priorities: next })
  }

  return (
    <div className="space-y-3 p-4 border-b">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search company, role, location…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        {Object.values(ApplicationStatus).map((status) => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={cn(
              'rounded-full px-3 py-0.5 text-xs font-medium border transition-colors',
              filters.statuses.includes(status)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-foreground',
            )}
          >
            {status}
          </button>
        ))}
        <div className="w-px h-4 bg-border" />
        {Object.values(Priority).map((p) => (
          <Badge
            key={p}
            variant={filters.priorities.includes(p) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => togglePriority(p)}
          >
            {p}
          </Badge>
        ))}
      </div>
    </div>
  )
}
