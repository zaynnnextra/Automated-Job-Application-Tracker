import { Moon, Sun, Monitor } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataManagement } from '@/components/settings/DataManagement'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const { theme, setTheme } = useUIStore()

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {([
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System', icon: Monitor },
            ] as const).map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={theme === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme(value)}
                className={cn('flex-1')}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <NotificationSettings />
      <DataManagement />

      <Card>
        <CardContent className="pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>Automated Job Application Tracker</p>
          <p>Data stored locally in your browser · No account required</p>
          <a
            href="https://github.com/zaynnnextra/automated-job-application-tracker"
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-primary"
          >
            View on GitHub
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
