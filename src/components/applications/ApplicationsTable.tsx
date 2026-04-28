import { ChevronUp, ChevronDown } from 'lucide-react'
import {
  Table, TableBody, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ApplicationRow } from './ApplicationRow'
import { useFilteredApplications } from '@/hooks/useFilteredApplications'
import { useApplicationStore } from '@/store/useApplicationStore'
import { SortField } from '@/types'

const COLUMNS: { label: string; field: SortField | null }[] = [
  { label: 'Company / Role', field: 'company' },
  { label: 'Status', field: 'status' },
  { label: 'Work Mode', field: null },
  { label: 'Applied', field: 'appliedAt' },
  { label: 'Action', field: null },
  { label: '', field: null },
]

export function ApplicationsTable() {
  const filtered = useFilteredApplications()
  const { sort, setSort } = useApplicationStore()

  const handleSort = (field: SortField | null) => {
    if (!field) return
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
    } else {
      setSort({ field, direction: 'asc' })
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(({ label, field }) => (
              <TableHead
                key={label || 'actions'}
                onClick={() => handleSort(field)}
                className={field ? 'cursor-pointer select-none' : ''}
              >
                <span className="flex items-center gap-1">
                  {label}
                  {field && sort.field === field && (
                    sort.direction === 'asc'
                      ? <ChevronUp className="h-3 w-3" />
                      : <ChevronDown className="h-3 w-3" />
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <td colSpan={6} className="text-center text-muted-foreground py-12 text-sm">
                No applications match your filters
              </td>
            </TableRow>
          ) : (
            filtered.map((app) => <ApplicationRow key={app.id} application={app} />)
          )}
        </TableBody>
      </Table>
    </div>
  )
}
