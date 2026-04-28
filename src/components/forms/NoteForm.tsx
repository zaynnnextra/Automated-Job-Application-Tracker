import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface NoteFormProps {
  initial?: string
  onSubmit: (content: string) => void
  onCancel?: () => void
  placeholder?: string
}

export function NoteForm({ initial = '', onSubmit, onCancel, placeholder = 'Add a note…' }: NoteFormProps) {
  const [value, setValue] = useState(initial)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={!value.trim()}>
          {initial ? 'Update' : 'Add Note'}
        </Button>
      </div>
    </form>
  )
}
