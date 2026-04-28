import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Application, PRIORITY_COLORS, STATUS_COLORS } from '@/types'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AutoSuggestionChip } from '@/components/reminders/AutoSuggestionChip'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useApplicationStore } from '@/store/useApplicationStore'
import { useUIStore } from '@/store/useUIStore'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface ApplicationRowProps {
  application: Application
}

export function ApplicationRow({ application: app }: ApplicationRowProps) {
  const { config } = useNotificationStore()
  const deleteApplication = useApplicationStore((s) => s.deleteApplication)
  const openEditDialog = useUIStore((s) => s.openEditDialog)

  const handleDelete = () => {
    deleteApplication(app.id)
    toast({ title: 'Application deleted', variant: 'destructive' })
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full shrink-0', PRIORITY_COLORS[app.priority])} />
          <div>
            <Link to={`/applications/${app.id}`} className="font-medium hover:underline">
              {app.company}
            </Link>
            <p className="text-xs text-muted-foreground">{app.role}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_COLORS[app.status])}>
          {app.status}
        </span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{app.workMode}</TableCell>
      <TableCell className="text-sm">
        {app.appliedAt ? format(parseISO(app.appliedAt), 'MMM d, yyyy') : '—'}
      </TableCell>
      <TableCell>
        <AutoSuggestionChip application={app} rules={config.rules} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {app.url && (
            <Button variant="ghost" size="icon" asChild className="h-7 w-7">
              <a href={app.url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(app.id)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}
