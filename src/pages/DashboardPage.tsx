import { useApplicationStore } from '@/store/useApplicationStore'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { StatusPieChart } from '@/components/dashboard/StatusPieChart'
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline'
import { UpcomingReminders } from '@/components/dashboard/UpcomingReminders'

export function DashboardPage() {
  const applications = useApplicationStore((s) => s.applications)

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl">
      <StatsCards applications={applications} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityTimeline applications={applications} />
        </div>
        <div className="space-y-6">
          <StatusPieChart applications={applications} />
          <UpcomingReminders applications={applications} />
        </div>
      </div>
    </div>
  )
}
