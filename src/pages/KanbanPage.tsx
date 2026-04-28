import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { useApplicationStore } from '@/store/useApplicationStore'
import { Application, ApplicationStatus, STATUS_ORDER } from '@/types'
import { KanbanColumn } from '@/components/kanban/KanbanColumn'
import { KanbanCard } from '@/components/kanban/KanbanCard'
import { ScrollArea } from '@/components/ui/scroll-area'

export function KanbanPage() {
  const { applications, updateStatus } = useApplicationStore()
  const [activeApp, setActiveApp] = useState<Application | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const grouped = STATUS_ORDER.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status)
      return acc
    },
    {} as Record<ApplicationStatus, Application[]>,
  )

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find((a) => a.id === event.active.id)
    setActiveApp(app ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveApp(null)
    if (!over) return
    const targetStatus = over.id as ApplicationStatus
    if (!Object.values(ApplicationStatus).includes(targetStatus)) return
    const draggedApp = applications.find((a) => a.id === active.id)
    if (!draggedApp || draggedApp.status === targetStatus) return
    updateStatus(draggedApp.id, targetStatus)
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-4">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 pb-4">
              {STATUS_ORDER.map((status) => (
                <KanbanColumn key={status} status={status} applications={grouped[status]} />
              ))}
            </div>
            <DragOverlay>
              {activeApp && <KanbanCard application={activeApp} />}
            </DragOverlay>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  )
}
