import { Link } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ExternalLink } from 'lucide-react'
import { Application, PRIORITY_COLORS } from '@/types'
import { getDaysAgo } from '@/lib/automation'
import { AutoSuggestionChip } from '@/components/reminders/AutoSuggestionChip'
import { useNotificationStore } from '@/store/useNotificationStore'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  application: Application
}

export function KanbanCard({ application: app }: KanbanCardProps) {
  const { config } = useNotificationStore()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: app.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const daysAgo = getDaysAgo(app.appliedAt)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card border rounded-lg p-3 shadow-sm group',
        isDragging && 'shadow-lg',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn('w-2 h-2 rounded-full shrink-0', PRIORITY_COLORS[app.priority])} />
            <Link
              to={`/applications/${app.id}`}
              className="text-sm font-semibold truncate hover:underline"
            >
              {app.company}
            </Link>
            {app.url && (
              <a href={app.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mb-2">{app.role}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {app.workMode}
            </span>
            <AutoSuggestionChip application={app} rules={config.rules} />
          </div>
        </div>
      </div>
    </div>
  )
}
