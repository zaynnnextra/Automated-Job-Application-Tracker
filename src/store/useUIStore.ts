import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIStore {
  theme: Theme
  setTheme: (t: Theme) => void
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  isAddDialogOpen: boolean
  openAddDialog: () => void
  closeAddDialog: () => void
  editingApplicationId: string | null
  openEditDialog: (id: string) => void
  closeEditDialog: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      isSidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
      isAddDialogOpen: false,
      openAddDialog: () => set({ isAddDialogOpen: true }),
      closeAddDialog: () => set({ isAddDialogOpen: false }),
      editingApplicationId: null,
      openEditDialog: (id) => set({ editingApplicationId: id }),
      closeEditDialog: () => set({ editingApplicationId: null }),
    }),
    { name: 'job-tracker-ui', partialize: (s) => ({ theme: s.theme, isSidebarCollapsed: s.isSidebarCollapsed }) },
  ),
)
