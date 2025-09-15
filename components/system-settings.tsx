"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Database, Mail, Shield, Settings, Download } from "lucide-react"

interface SystemSettingsProps {
  onSave: (settings: SystemSettings) => void
}

export interface SystemSettings {
  general: {
    systemName: string
    institutionName: string
    contactEmail: string
    maintenanceMode: boolean
    allowStudentRegistration: boolean
  }
  email: {
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    enableNotifications: boolean
  }
  security: {
    passwordMinLength: number
    requireTwoFactor: boolean
    sessionTimeout: number
    maxLoginAttempts: number
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    retentionDays: number
    lastBackup: string
  }
}

const defaultSettings: SystemSettings = {
  general: {
    systemName: "Thesis Management System",
    institutionName: "University Name",
    contactEmail: "admin@university.edu",
    maintenanceMode: false,
    allowStudentRegistration: true,
  },
  email: {
    smtpHost: "smtp.university.edu",
    smtpPort: "587",
    smtpUser: "system@university.edu",
    smtpPassword: "",
    fromEmail: "noreply@university.edu",
    enableNotifications: true,
  },
  security: {
    passwordMinLength: 8,
    requireTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  },
  backup: {
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    lastBackup: "2024-03-12 02:00:00",
  },
}

export function SystemSettings({ onSave }: SystemSettingsProps) {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave(settings)
    setHasChanges(false)
  }

  const handleBackup = () => {
    // TODO: Implement backup functionality
    console.log("Creating backup...")
    alert("Backup created successfully!")
  }

  const handleRestore = () => {
    // TODO: Implement restore functionality
    console.log("Restoring from backup...")
    alert("System restored from backup!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">System Settings</h2>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              Unsaved Changes
            </Badge>
          )}
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration and institution information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.general.systemName}
                    onChange={(e) => updateSettings("general", "systemName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    value={settings.general.institutionName}
                    onChange={(e) => updateSettings("general", "institutionName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => updateSettings("general", "contactEmail", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable system access for maintenance</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings("general", "maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowStudentRegistration">Allow Student Registration</Label>
                    <p className="text-sm text-muted-foreground">Enable students to self-register accounts</p>
                  </div>
                  <Switch
                    id="allowStudentRegistration"
                    checked={settings.general.allowStudentRegistration}
                    onCheckedChange={(checked) => updateSettings("general", "allowStudentRegistration", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure SMTP settings for system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSettings("email", "smtpHost", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSettings("email", "smtpPort", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.email.smtpUser}
                    onChange={(e) => updateSettings("email", "smtpUser", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSettings("email", "smtpPassword", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email Address</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) => updateSettings("email", "fromEmail", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">Enable Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send automated emails for system events</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.email.enableNotifications}
                  onCheckedChange={(checked) => updateSettings("email", "enableNotifications", checked)}
                />
              </div>

              <Button variant="outline" className="bg-transparent">
                Test Email Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings("security", "passwordMinLength", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="15"
                  max="480"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all user accounts</p>
                </div>
                <Switch
                  id="requireTwoFactor"
                  checked={settings.security.requireTwoFactor}
                  onCheckedChange={(checked) => updateSettings("security", "requireTwoFactor", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Recovery
              </CardTitle>
              <CardDescription>Manage system backups and data recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.backup.autoBackup}
                  onCheckedChange={(checked) => updateSettings("backup", "autoBackup", checked)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    className="w-full p-2 border rounded-md"
                    value={settings.backup.backupFrequency}
                    onChange={(e) => updateSettings("backup", "backupFrequency", e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retentionDays">Retention Period (days)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    min="7"
                    max="365"
                    value={settings.backup.retentionDays}
                    onChange={(e) => updateSettings("backup", "retentionDays", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Last Backup:</span>
                  <span className="text-muted-foreground">{settings.backup.lastBackup}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleBackup} size="sm">
                    Create Backup Now
                  </Button>
                  <Button variant="outline" onClick={handleRestore} size="sm" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 mb-1">Important:</p>
                    <p className="text-yellow-700">
                      Regular backups are essential for data protection. Ensure backup storage is secure and accessible.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
