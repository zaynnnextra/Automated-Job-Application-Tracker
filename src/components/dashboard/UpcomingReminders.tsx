import { Link } from 'react-router-dom'
import { format, parseISO, isWithinInterval, addDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Application } from '@/types'
import { STATUS_COLORS } from '@/types'
import { cn } from '@/lib/utils'

interface UpcomingRemindersProps {
  applications: Application[]
}

export function UpcomingReminders({ applications }: UpcomingRemindersProps) {
  const now = new Date()
  const upcoming = applications
    .filter((a) => {
      if (!a.followUpDate) return false
      try {
        const d = parseISO(a.followUpDate)
        return isWithinInterval(d, { start: now, end: addDays(now, 7) })
      } catch {
        return false
      }
    })
    .sort((a, b) => (a.followUpDate ?? '') < (b.followUpDate ?? '') ? -1 : 1)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Upcoming Follow-ups (7 days)</CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming follow-ups</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((app) => (
              <Link key={app.id} to={`/applications/${app.id}`} className="flex items-center justify-between hover:bg-muted/50 rounded p-2 -mx-2 transition-colors">
                <div>
                  <p className="text-sm font-medium">{app.company}</p>
                  <p className="text-xs text-muted-foreground">{app.role}</p>
                </div>
                <div className="text-right">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_COLORS[app.status])}>
                    {app.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {app.followUpDate ? format(parseISO(app.followUpDate), 'MMM d') : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
