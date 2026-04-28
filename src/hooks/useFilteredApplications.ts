import { useMemo } from 'react'
import { useApplicationStore } from '@/store/useApplicationStore'
import { Application, Priority, SortField } from '@/types'

const PRIORITY_RANK: Record<Priority, number> = {
  [Priority.HIGH]: 3,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 1,
}

export function useFilteredApplications(): Application[] {
  const applications = useApplicationStore((s) => s.applications)
  const filters = useApplicationStore((s) => s.filters)
  const sort = useApplicationStore((s) => s.sort)

  return useMemo(() => {
    let result = [...applications]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q),
      )
    }

    if (filters.statuses.length > 0) {
      result = result.filter((a) => filters.statuses.includes(a.status))
    }

    if (filters.priorities.length > 0) {
      result = result.filter((a) => filters.priorities.includes(a.priority))
    }

    if (filters.workModes.length > 0) {
      result = result.filter((a) => filters.workModes.includes(a.workMode))
    }

    if (filters.dateFrom) {
      result = result.filter((a) => a.appliedAt >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      result = result.filter((a) => a.appliedAt <= filters.dateTo!)
    }

    result.sort((a, b) => {
      const field = sort.field as SortField
      let valA: string | number = a[field] as string
      let valB: string | number = b[field] as string

      if (field === 'priority') {
        valA = PRIORITY_RANK[a.priority]
        valB = PRIORITY_RANK[b.priority]
      }

      if (valA < valB) return sort.direction === 'asc' ? -1 : 1
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [applications, filters, sort])
}
