import { useFilteredApplications } from '@/hooks/useFilteredApplications'
import { ApplicationsToolbar } from '@/components/applications/ApplicationsToolbar'
import { ApplicationsTable } from '@/components/applications/ApplicationsTable'

export function ApplicationsPage() {
  const filtered = useFilteredApplications()

  return (
    <div className="flex flex-col h-full">
      <ApplicationsToolbar />
      <div className="px-4 py-2 text-xs text-muted-foreground border-b">
        {filtered.length} application{filtered.length !== 1 ? 's' : ''}
      </div>
      <ApplicationsTable />
    </div>
  )
}
