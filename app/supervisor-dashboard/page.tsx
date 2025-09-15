import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, CheckCircle, AlertTriangle, MessageSquare, Calendar, Eye } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUser = {
  name: "Dr. Michael Chen",
  email: "m.chen@university.edu",
  role: "supervisor" as const,
  school: "School of Computing",
  department: "Computer Science",
}

// Mock data
const mockStudents = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    thesisTitle: "Machine Learning Applications in Healthcare Data Analysis",
    status: "in_progress",
    progress: 65,
    lastContact: "2024-03-10",
    nextDeadline: "2024-04-15",
  },
  {
    id: 2,
    name: "David Kim",
    email: "david.kim@university.edu",
    thesisTitle: "Blockchain Security in Distributed Systems",
    status: "proposal_review",
    progress: 15,
    lastContact: "2024-03-08",
    nextDeadline: "2024-04-01",
  },
]

const mockPendingReviews = [
  {
    id: 1,
    type: "proposal",
    student: "David Kim",
    title: "Blockchain Security in Distributed Systems",
    submittedAt: "2024-03-08",
    priority: "high",
  },
  {
    id: 2,
    type: "thesis_chapter",
    student: "Sarah Johnson",
    title: "Chapter 3: Methodology",
    submittedAt: "2024-03-10",
    priority: "medium",
  },
]

const statusColors = {
  in_progress: "bg-blue-100 text-blue-800",
  proposal_review: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-gray-100 text-gray-800",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function SupervisorDashboard() {
  return (
    <DashboardLayout user={mockUser} title="Supervisor Dashboard">
      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Currently supervising</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Awaiting feedback</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">All up to date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Reviews completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="reviews">Pending Reviews</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Students Under Supervision</CardTitle>
                <CardDescription>Monitor progress and provide guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-sm font-medium mt-1 text-balance">{student.thesisTitle}</p>
                        </div>
                        <Badge className={statusColors[student.status]}>{student.status.replace("_", " ")}</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="ml-2 font-medium">{student.progress}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Contact:</span>
                          <span className="ml-2">{student.lastContact}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Deadline:</span>
                          <span className="ml-2">{student.nextDeadline}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>Items awaiting your feedback and approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{review.student}</h3>
                            <Badge variant="outline">{review.type.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm font-medium text-balance">{review.title}</p>
                          <p className="text-sm text-muted-foreground">Submitted: {review.submittedAt}</p>
                        </div>
                        <Badge className={priorityColors[review.priority]}>{review.priority}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <Link href={`/review/${review.id}`}>Review Now</Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Meetings and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>No upcoming meetings scheduled</p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Schedule Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
