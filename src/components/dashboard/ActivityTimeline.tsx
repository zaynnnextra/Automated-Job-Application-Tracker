import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Application } from '@/types'
import { format, subWeeks, startOfWeek, parseISO, isWithinInterval, endOfWeek } from 'date-fns'

interface ActivityTimelineProps {
  applications: Application[]
}

export function ActivityTimeline({ applications }: ActivityTimelineProps) {
  const data = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 12 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(now, 11 - i))
      const weekEnd = endOfWeek(weekStart)
      const count = applications.filter((a) => {
        try {
          const d = parseISO(a.appliedAt)
          return isWithinInterval(d, { start: weekStart, end: weekEnd })
        } catch {
          return false
        }
      }).length
      return { week: format(weekStart, 'MMM d'), count }
    })
  }, [applications])

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Weekly Activity (Last 12 Weeks)</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
