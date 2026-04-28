import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import {
  ArrowLeft, Pencil, Trash2, ExternalLink, Plus, User, CheckCircle2,
  Circle, Phone, Mail, Linkedin,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { useApplicationStore } from '@/store/useApplicationStore'
import { useUIStore } from '@/store/useUIStore'
import { toast } from '@/components/ui/use-toast'
import { STATUS_COLORS, PRIORITY_COLORS } from '@/types'
import { NoteForm } from '@/components/forms/NoteForm'
import { ContactForm } from '@/components/forms/ContactForm'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ApplicationStatus } from '@/types'
import { AutoSuggestionChip } from '@/components/reminders/AutoSuggestionChip'
import { useNotificationStore } from '@/store/useNotificationStore'

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { applications, deleteApplication, addNote, updateNote, deleteNote, addContact, deleteContact, updateStatus } = useApplicationStore()
  const { openEditDialog } = useUIStore()
  const { config } = useNotificationStore()
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editNoteId, setEditNoteId] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)

  const app = applications.find((a) => a.id === id)

  if (!app) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Application not found.</p>
        <Button variant="link" onClick={() => navigate('/applications')}>
          Back to Applications
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (!window.confirm('Delete this application?')) return
    deleteApplication(app.id)
    toast({ title: 'Application deleted', variant: 'destructive' })
    navigate('/applications')
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/applications">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('w-3 h-3 rounded-full', PRIORITY_COLORS[app.priority])} />
            <h2 className="text-2xl font-bold">{app.company}</h2>
            {app.url && (
              <a href={app.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-lg text-muted-foreground">{app.role}</p>
          {app.location && <p className="text-sm text-muted-foreground">{app.location} · {app.workMode}</p>}
          {app.salaryMin && (
            <p className="text-sm text-muted-foreground mt-1">
              {app.currency} {app.salaryMin.toLocaleString()} – {app.salaryMax?.toLocaleString() ?? '?'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => openEditDialog(app.id)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as ApplicationStatus)}>
            <SelectTrigger className="h-8 w-auto text-xs">
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_COLORS[app.status])}>
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {Object.values(ApplicationStatus).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AutoSuggestionChip application={app} rules={config.rules} />
        {app.source && <Badge variant="outline">{app.source}</Badge>}
        {app.followUpDate && (
          <span className="text-xs text-muted-foreground">
            Follow-up: {format(parseISO(app.followUpDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {app.nextAction && (
        <div className="mb-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
          <strong>Next Action:</strong> {app.nextAction}
        </div>
      )}

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">Notes ({app.notes.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({app.contacts.length})</TabsTrigger>
          <TabsTrigger value="history">History ({app.statusHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4 space-y-4">
          <Button size="sm" variant="outline" onClick={() => setShowNoteForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Note
          </Button>
          {showNoteForm && (
            <NoteForm
              onSubmit={(content) => { addNote(app.id, content); setShowNoteForm(false) }}
              onCancel={() => setShowNoteForm(false)}
            />
          )}
          {app.notes.length === 0 && !showNoteForm && (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          )}
          <div className="space-y-3">
            {app.notes.map((note) => (
              <div key={note.id} className="rounded-lg border p-3">
                {editNoteId === note.id ? (
                  <NoteForm
                    initial={note.content}
                    onSubmit={(c) => { updateNote(app.id, note.id, c); setEditNoteId(null) }}
                    onCancel={() => setEditNoteId(null)}
                  />
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(note.updatedAt), 'MMM d, yyyy HH:mm')}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setEditNoteId(note.id)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => deleteNote(app.id, note.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4 space-y-4">
          <Button size="sm" variant="outline" onClick={() => setShowContactForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Contact
          </Button>
          {showContactForm && (
            <ContactForm
              onSubmit={(c) => { addContact(app.id, c); setShowContactForm(false) }}
              onCancel={() => setShowContactForm(false)}
            />
          )}
          {app.contacts.length === 0 && !showContactForm && (
            <p className="text-sm text-muted-foreground">No contacts yet.</p>
          )}
          <div className="space-y-3">
            {app.contacts.map((contact) => (
              <div key={contact.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.title}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost" size="sm" className="h-7 text-xs text-destructive"
                    onClick={() => deleteContact(app.id, contact.id)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <Mail className="h-3 w-3" /> {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <Phone className="h-3 w-3" /> {contact.phone}
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <Linkedin className="h-3 w-3" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ScrollArea className="max-h-96">
            <div className="relative pl-6">
              {app.statusHistory.map((entry, i) => (
                <div key={entry.id} className="relative mb-6">
                  <div className="absolute -left-6 top-1 flex items-center justify-center">
                    {i === app.statusHistory.length - 1 ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  {i < app.statusHistory.length - 1 && (
                    <div className="absolute -left-[18px] top-5 bottom-0 w-px bg-border" />
                  )}
                  <p className={cn('text-sm font-medium px-2 py-0.5 rounded-full inline-block', STATUS_COLORS[entry.status])}>
                    {entry.status}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(parseISO(entry.changedAt), 'MMM d, yyyy HH:mm')}
                  </p>
                  {entry.note && <p className="text-xs text-muted-foreground mt-0.5 italic">{entry.note}</p>}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
