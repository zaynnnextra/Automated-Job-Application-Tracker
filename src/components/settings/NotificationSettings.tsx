import { Bell, BellOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useNotificationStore } from '@/store/useNotificationStore'
import { requestPermission, getPermissionState } from '@/lib/notifications'
import { ApplicationStatus } from '@/types'
import { toast } from '@/components/ui/use-toast'

export function NotificationSettings() {
  const { config, updateConfig, updateRule } = useNotificationStore()
  const permissionState = getPermissionState()

  const handleRequestPermission = async () => {
    const result = await requestPermission()
    if (result === 'granted') {
      updateConfig({ browserNotificationsEnabled: true })
      toast({ title: 'Browser notifications enabled' })
    } else {
      toast({ title: 'Permission denied', description: 'Enable notifications in browser settings', variant: 'destructive' })
    }
  }

  const RULE_STATUSES = [
    ApplicationStatus.APPLIED,
    ApplicationStatus.PHONE_SCREEN,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
  ]

  return (
    <Card>
      <CardHeader><CardTitle>Reminder Settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="reminders-enabled">Enable Reminders</Label>
            <p className="text-xs text-muted-foreground">Show follow-up alerts in the app</p>
          </div>
          <Switch
            id="reminders-enabled"
            checked={config.enabled}
            onCheckedChange={(v) => updateConfig({ enabled: v })}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label>Browser Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Status: <span className="font-medium capitalize">{permissionState}</span>
            </p>
          </div>
          {permissionState === 'granted' ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Bell className="h-4 w-4" />
              <span className="text-sm">Enabled</span>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleRequestPermission}>
              <BellOff className="h-4 w-4 mr-2" />
              Request Permission
            </Button>
          )}
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-semibold">Follow-up Day Thresholds</Label>
          <p className="text-xs text-muted-foreground mb-3">Days after last update before suggesting a follow-up</p>
          <div className="space-y-3">
            {RULE_STATUSES.map((status) => {
              const rule = config.rules.find((r) => r.status === status)
              return (
                <div key={status} className="flex items-center justify-between">
                  <Label className="text-sm">{status}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      className="w-20 h-8 text-sm"
                      value={rule?.daysThreshold ?? 7}
                      onChange={(e) => updateRule(status, Number(e.target.value))}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
