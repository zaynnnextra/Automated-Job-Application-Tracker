import { useState } from 'react'
import { Application, ApplicationStatus, Priority, WorkMode } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type FormData = Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'contacts' | 'notes'>

interface ApplicationFormProps {
  initial?: Application
  onSubmit: (data: FormData) => void
  onCancel: () => void
}

const defaultForm = (): FormData => ({
  company: '',
  role: '',
  url: '',
  status: ApplicationStatus.APPLIED,
  priority: Priority.MEDIUM,
  workMode: WorkMode.REMOTE,
  location: '',
  salaryMin: undefined,
  salaryMax: undefined,
  currency: 'USD',
  appliedAt: new Date().toISOString().slice(0, 10),
  followUpDate: '',
  nextAction: '',
  source: '',
})

export function ApplicationForm({ initial, onSubmit, onCancel }: ApplicationFormProps) {
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          company: initial.company,
          role: initial.role,
          url: initial.url ?? '',
          status: initial.status,
          priority: initial.priority,
          workMode: initial.workMode,
          location: initial.location ?? '',
          salaryMin: initial.salaryMin,
          salaryMax: initial.salaryMax,
          currency: initial.currency,
          appliedAt: initial.appliedAt,
          followUpDate: initial.followUpDate ?? '',
          nextAction: initial.nextAction ?? '',
          source: initial.source ?? '',
        }
      : defaultForm(),
  )

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    onSubmit({ ...form, contacts: initial?.contacts ?? [], notes: initial?.notes ?? [] } as FormData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="company">Company *</Label>
          <Input id="company" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Stripe" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="role">Role *</Label>
          <Input id="role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Senior Engineer" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(v) => set('status', v)}>
            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.values(ApplicationStatus).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="priority">Priority</Label>
          <Select value={form.priority} onValueChange={(v) => set('priority', v)}>
            <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.values(Priority).map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="workMode">Work Mode</Label>
          <Select value={form.workMode} onValueChange={(v) => set('workMode', v)}>
            <SelectTrigger id="workMode"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.values(WorkMode).map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="San Francisco, CA" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="appliedAt">Applied Date</Label>
          <Input id="appliedAt" type="date" value={form.appliedAt} onChange={(e) => set('appliedAt', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="source">Source</Label>
          <Input id="source" value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="LinkedIn, Referral…" />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="url">Job Posting URL</Label>
        <Input id="url" type="url" value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="salaryMin">Salary Min</Label>
          <Input id="salaryMin" type="number" value={form.salaryMin ?? ''} onChange={(e) => set('salaryMin', e.target.value ? Number(e.target.value) : undefined)} placeholder="120000" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="salaryMax">Salary Max</Label>
          <Input id="salaryMax" type="number" value={form.salaryMax ?? ''} onChange={(e) => set('salaryMax', e.target.value ? Number(e.target.value) : undefined)} placeholder="160000" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} placeholder="USD" maxLength={3} />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="nextAction">Next Action</Label>
        <Textarea id="nextAction" value={form.nextAction} onChange={(e) => set('nextAction', e.target.value)} placeholder="Prepare for technical interview…" rows={2} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save Changes' : 'Add Application'}</Button>
      </div>
    </form>
  )
}
