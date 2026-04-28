import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Application, ApplicationStatus, STATUS_COLORS } from '@/types'
import { KanbanCard } from './KanbanCard'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: ApplicationStatus
  applications: Application[]
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const openAddDialog = useUIStore((s) => s.openAddDialog)

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLORS[status])}>
            {status}
          </span>
          <span className="text-xs text-muted-foreground font-medium">{applications.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={openAddDialog}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex flex-col gap-2 min-h-[200px] rounded-lg p-2 transition-colors',
            isOver ? 'bg-accent/60' : 'bg-muted/30',
          )}
        >
          {applications.map((app) => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
