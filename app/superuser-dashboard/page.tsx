import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building, Settings, UserPlus, Database, Activity } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  name: "System Administrator",
  email: "admin@university.edu",
  role: "superuser" as const,
}

// Mock data
const systemStats = {
  totalUsers: 156,
  activeCoordinators: 8,
  activeSupervisors: 24,
  totalStudents: 124,
  systemHealth: "excellent",
}

const mockUsers = [
  {
    id: 1,
    name: "Prof. Lisa Anderson",
    email: "l.anderson@university.edu",
    role: "coordinator",
    school: "School of Computing",
    department: "Computer Science",
    lastActive: "2024-03-12",
    status: "active",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "m.chen@university.edu",
    role: "supervisor",
    school: "School of Computing",
    department: "Computer Science",
    lastActive: "2024-03-11",
    status: "active",
  },
]

const mockSystemLogs = [
  {
    id: 1,
    action: "User Created",
    details: "New supervisor account created for Dr. Sarah Williams",
    timestamp: "2024-03-12 14:30:00",
    severity: "info",
  },
  {
    id: 2,
    action: "Role Changed",
    details: "Dr. Michael Chen promoted to coordinator",
    timestamp: "2024-03-12 10:15:00",
    severity: "warning",
  },
]

const roleColors = {
  coordinator: "bg-purple-100 text-purple-800",
  supervisor: "bg-green-100 text-green-800",
  student: "bg-blue-100 text-blue-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
}

const severityColors = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
}

export default function SuperuserDashboard() {
  return (
    <DashboardLayout user={mockUser} title="System Administration">
      <div className="grid gap-6">
        {/* System Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Across all roles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coordinators</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeCoordinators}</div>
              <p className="text-xs text-muted-foreground">Department heads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supervisors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeSupervisors}</div>
              <p className="text-xs text-muted-foreground">Faculty members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Excellent</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage coordinators and supervisors</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/users/new">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{user.name}</h3>
                            <Badge className={roleColors[user.role]}>{user.role}</Badge>
                            <Badge className={statusColors[user.status]}>{user.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.school} • {user.department}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">Last active: {user.lastActive}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit User
                        </Button>
                        <Button size="sm" variant="outline">
                          Change Role
                        </Button>
                        <Button size="sm" variant="outline">
                          Reset Password
                        </Button>
                        <Button size="sm" variant="destructive">
                          Suspend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Service</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>File Storage</span>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Status</span>
                    <Badge className="bg-green-100 text-green-800">Up to date</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    Transfer Admin Rights
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Backup Database
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    System Maintenance
                  </Button>
                  <Button className="w-full" variant="destructive">
                    Emergency Shutdown
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
                <CardDescription>Monitor system events and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSystemLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{log.action}</h3>
                          <Badge className={severityColors[log.severity]}>{log.severity}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty">{log.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
