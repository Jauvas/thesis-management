import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, AlertCircle, GraduationCap } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  name: "Prof. Lisa Anderson",
  email: "l.anderson@university.edu",
  role: "coordinator" as const,
  school: "School of Computing",
  department: "Computer Science",
}

// Mock data
const departmentStats = {
  totalStudents: 45,
  activeTheses: 32,
  pendingApprovals: 8,
  completedThisYear: 12,
}

const mockSupervisors = [
  {
    id: 1,
    name: "Dr. Michael Chen",
    email: "m.chen@university.edu",
    activeStudents: 2,
    completedTheses: 8,
    avgRating: 4.8,
  },
  {
    id: 2,
    name: "Dr. Sarah Williams",
    email: "s.williams@university.edu",
    activeStudents: 3,
    completedTheses: 12,
    avgRating: 4.9,
  },
]

const mockPendingApprovals = [
  {
    id: 1,
    type: "proposal",
    student: "John Doe",
    supervisor: "Dr. Michael Chen",
    title: "AI-Powered Code Review Systems",
    submittedAt: "2024-03-12",
    priority: "high",
  },
  {
    id: 2,
    type: "final_thesis",
    student: "Jane Smith",
    supervisor: "Dr. Sarah Williams",
    title: "Quantum Computing Applications in Cryptography",
    submittedAt: "2024-03-10",
    priority: "high",
  },
]

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function CoordinatorDashboard() {
  return (
    <DashboardLayout user={mockUser} title="Coordinator Dashboard">
      <div className="grid gap-6">
        {/* Department Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">In department</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Theses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentStats.activeTheses}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed (2024)</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentStats.completedThisYear}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Items Requiring Approval</CardTitle>
                <CardDescription>Review and approve proposals and final theses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingApprovals.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{item.student}</h3>
                            <Badge variant="outline">{item.type.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm font-medium text-balance">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Supervisor: {item.supervisor} • Submitted: {item.submittedAt}
                          </p>
                        </div>
                        <Badge className={priorityColors[item.priority]}>{item.priority}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/review/${item.id}`}>Review & Approve</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/review/${item.id}`}>View Details</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/review/${item.id}`}>Request Changes</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supervisors" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Supervisors</CardTitle>
                    <CardDescription>Manage and monitor supervisor performance</CardDescription>
                  </div>
                  <Button>Add Supervisor</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSupervisors.map((supervisor) => (
                    <div key={supervisor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{supervisor.name}</h3>
                          <p className="text-sm text-muted-foreground">{supervisor.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Rating: {supervisor.avgRating}/5.0</div>
                          <div className="text-xs text-muted-foreground">{supervisor.completedTheses} completed</div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Active Students:</span>
                          <span className="ml-2 font-medium">{supervisor.activeStudents}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Completed:</span>
                          <span className="ml-2 font-medium">{supervisor.completedTheses}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          Assign Students
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>Thesis completion statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>On Track</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Delayed</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>At Risk</span>
                        <span>5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Submissions</CardTitle>
                  <CardDescription>Proposals and thesis submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">March 2024</span>
                      <span className="font-medium">8 submissions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">February 2024</span>
                      <span className="font-medium">12 submissions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">January 2024</span>
                      <span className="font-medium">6 submissions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
