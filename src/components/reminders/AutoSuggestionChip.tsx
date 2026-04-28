import { AlertCircle, Clock } from 'lucide-react'
import { Application, FollowUpRule } from '@/types'
import { getAutoSuggestion } from '@/lib/automation'
import { cn } from '@/lib/utils'

interface AutoSuggestionChipProps {
  application: Application
  rules: FollowUpRule[]
}

export function AutoSuggestionChip({ application, rules }: AutoSuggestionChipProps) {
  const suggestion = getAutoSuggestion(application, rules)
  if (!suggestion) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
        suggestion.urgency === 'high' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        suggestion.urgency === 'medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
        suggestion.urgency === 'low' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      )}
    >
      {suggestion.urgency === 'high' ? (
        <AlertCircle className="h-2.5 w-2.5" />
      ) : (
        <Clock className="h-2.5 w-2.5" />
      )}
      {suggestion.text}
    </span>
  )
}
