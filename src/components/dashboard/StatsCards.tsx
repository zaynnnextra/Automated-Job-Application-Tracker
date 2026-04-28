import { useMemo } from 'react'
import { Briefcase, TrendingUp, Calendar, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Application, ApplicationStatus } from '@/types'

const ACTIVE_STATUSES = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.PHONE_SCREEN,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
]

interface StatsCardsProps {
  applications: Application[]
}

export function StatsCards({ applications }: StatsCardsProps) {
  const stats = useMemo(() => {
    const total = applications.length
    const active = applications.filter((a) => ACTIVE_STATUSES.includes(a.status)).length
    const interviews = applications.filter(
      (a) => a.status === ApplicationStatus.INTERVIEW || a.status === ApplicationStatus.PHONE_SCREEN,
    ).length
    const offers = applications.filter((a) => a.status === ApplicationStatus.OFFER).length
    const responseRate = total > 0
      ? Math.round(
          (applications.filter((a) => a.status !== ApplicationStatus.APPLIED && a.status !== ApplicationStatus.WISHLIST).length / total) * 100,
        )
      : 0
    return { total, active, interviews, offers, responseRate }
  }, [applications])

  const cards = [
    { label: 'Total Applications', value: stats.total, sub: 'All time', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Active Pipeline', value: stats.active, sub: 'In progress', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Interviews', value: stats.interviews, sub: 'Phone + onsite', icon: Calendar, color: 'text-purple-500' },
    { label: 'Offers', value: stats.offers, sub: `${stats.responseRate}% response rate`, icon: Award, color: 'text-amber-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
            <Icon className={`h-8 w-8 ${color} opacity-80`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
