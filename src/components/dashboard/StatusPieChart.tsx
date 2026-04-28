import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Application, ApplicationStatus } from '@/types'

const STATUS_CHART_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.WISHLIST]: '#94a3b8',
  [ApplicationStatus.APPLIED]: '#3b82f6',
  [ApplicationStatus.PHONE_SCREEN]: '#a855f7',
  [ApplicationStatus.INTERVIEW]: '#f59e0b',
  [ApplicationStatus.OFFER]: '#22c55e',
  [ApplicationStatus.REJECTED]: '#ef4444',
  [ApplicationStatus.WITHDRAWN]: '#6b7280',
  [ApplicationStatus.GHOSTED]: '#71717a',
}

interface StatusPieChartProps {
  applications: Application[]
}

export function StatusPieChart({ applications }: StatusPieChartProps) {
  const data = useMemo(() => {
    const counts: Partial<Record<ApplicationStatus, number>> = {}
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1
    })
    return Object.entries(counts)
      .filter(([, v]) => v! > 0)
      .map(([status, count]) => ({ name: status, value: count! }))
  }, [applications])

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Applications by Status</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          No applications yet
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Applications by Status</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={false}>
              {data.map(({ name }) => (
                <Cell key={name} fill={STATUS_CHART_COLORS[name as ApplicationStatus]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number, name: string) => [val, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
