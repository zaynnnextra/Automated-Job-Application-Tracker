import { useState } from 'react'
import { Contact } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ContactFormProps {
  initial?: Contact
  onSubmit: (contact: Omit<Contact, 'id'>) => void
  onCancel: () => void
}

export function ContactForm({ initial, onSubmit, onCancel }: ContactFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    title: initial?.title ?? '',
    email: initial?.email ?? '',
    linkedin: initial?.linkedin ?? '',
    phone: initial?.phone ?? '',
    notes: initial?.notes ?? '',
  })

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Name *</Label>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Smith" required />
        </div>
        <div className="space-y-1">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Engineering Manager" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@company.com" />
        </div>
        <div className="space-y-1">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 000 0000" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>LinkedIn</Label>
        <Input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/jane" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" size="sm">{initial ? 'Update' : 'Add Contact'}</Button>
      </div>
    </form>
  )
}
