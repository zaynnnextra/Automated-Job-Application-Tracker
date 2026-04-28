import { useRef } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useApplicationStore } from '@/store/useApplicationStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { downloadCsv, parseCsv } from '@/lib/csvUtils'
import { downloadJson, parseJson } from '@/lib/jsonUtils'
import { toast } from '@/components/ui/use-toast'
import { Application } from '@/types'

export function DataManagement() {
  const { applications, importApplications, clearAll } = useApplicationStore()
  const { config } = useNotificationStore()
  const csvRef = useRef<HTMLInputElement>(null)
  const jsonRef = useRef<HTMLInputElement>(null)

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const rows = parseCsv(text)
      if (rows.length === 0) {
        toast({ title: 'CSV import failed', description: 'No valid rows found', variant: 'destructive' })
        return
      }
      importApplications(rows as Application[], true)
      toast({ title: `Imported ${rows.length} applications from CSV` })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const payload = parseJson(text)
      if (!payload) {
        toast({ title: 'JSON import failed', description: 'Invalid format', variant: 'destructive' })
        return
      }
      importApplications(payload.applications, true)
      toast({ title: `Imported ${payload.applications.length} applications from JSON` })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearAll = () => {
    if (!window.confirm('Delete all applications? This cannot be undone.')) return
    clearAll()
    toast({ title: 'All applications deleted', variant: 'destructive' })
  }

  return (
    <Card>
      <CardHeader><CardTitle>Data Management</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Export</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadJson(applications, config)}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON (full)
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadCsv(applications)}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV (flat)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            JSON preserves all data including notes and contacts. CSV exports flat fields only.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold mb-2">Import</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => jsonRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => csvRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Imported data merges with existing applications (duplicates by ID are replaced).
          </p>
          <input ref={jsonRef} type="file" accept=".json" className="hidden" onChange={handleImportJson} />
          <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold mb-2 text-destructive">Danger Zone</h3>
          <Button variant="destructive" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Applications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
