import { useUIStore } from '@/store/useUIStore'
import { useApplicationStore } from '@/store/useApplicationStore'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { ApplicationForm } from './ApplicationForm'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import { Application } from '@/types'

// Flat fields only — contacts/notes managed separately in detail view
type FlatFormData = Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'contacts' | 'notes'>

export function ApplicationFormDialog() {
  const { isAddDialogOpen, closeAddDialog, editingApplicationId, closeEditDialog } = useUIStore()
  const { applications, addApplication, updateApplication } = useApplicationStore()

  const editingApp = editingApplicationId
    ? applications.find((a) => a.id === editingApplicationId)
    : undefined

  const isOpen = isAddDialogOpen || !!editingApplicationId

  const handleClose = () => {
    closeAddDialog()
    closeEditDialog()
  }

  const handleSubmit = (data: FlatFormData) => {
    if (editingApp) {
      updateApplication(editingApp.id, data)
      toast({ title: 'Application updated' })
    } else {
      addApplication({ ...data, contacts: [], notes: [] })
      toast({ title: 'Application added' })
    }
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editingApp ? 'Edit Application' : 'Add New Application'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <ApplicationForm
            initial={editingApp}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
