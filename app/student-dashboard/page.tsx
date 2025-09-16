"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, AlertCircle, Plus, Calendar, MessageSquare, Bell } from "lucide-react"
import Link from "next/link"
import { type DemoUser, getNotificationsByUserId } from "@/lib/demo-data"
import { getStudentById, getSupervisorNameById, students } from "@/lib/mock-entities"

// Mock data for demonstration
const mockProposals = [
  {
    id: 1,
    title: "Machine Learning Applications in Healthcare Data Analysis",
    status: "approved",
    submittedAt: "2024-01-15",
    feedback: "Excellent proposal with clear methodology. Approved to proceed with thesis.",
  },
]

const mockTheses = [
  {
    id: 1,
    title: "Machine Learning Applications in Healthcare Data Analysis",
    status: "in_progress",
    progress: 65,
    supervisor: "Dr. Michael Chen",
    lastUpdated: "2024-03-10",
    nextDeadline: "2024-04-15",
  },
]

const mockTasks = [
  { id: 1, task: "Complete Chapter 3: Methodology", due: "2024-04-15", priority: "high" },
  { id: 2, task: "Submit progress report", due: "2024-04-20", priority: "medium" },
  { id: 3, task: "Schedule supervisor meeting", due: "2024-04-10", priority: "low" },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  in_progress: "bg-blue-100 text-blue-800",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function StudentDashboard() {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [supervisorName, setSupervisorName] = useState<string | null>(null)

  useEffect(() => {
    // Get current user from sessionStorage
    const currentUserStr = sessionStorage.getItem("currentUser")
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr)
      setUser(currentUser)
      // Count unread notifications
      const notifications = getNotificationsByUserId(currentUser.id)
      setUnreadNotifications(notifications.filter(n => !n.isRead).length)
      // Resolve supervisor from student profile
      const studentProfile = students.find(s => s.userId === currentUser.id)
      if (studentProfile) {
        setSupervisorName(getSupervisorNameById(studentProfile.supervisorId) || null)
      }
    } else {
      // Redirect to login if no user
      window.location.href = "/login"
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout user={user} title="Student Dashboard">
      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thesis Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65%</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadNotifications}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Deadline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Thesis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Thesis</CardTitle>
                <Button size="sm" asChild>
                  <Link href="/thesis/upload">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Version
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {supervisorName ? (
                <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200 text-yellow-700 text-sm">
                  Supervisor: <span className="font-medium">{supervisorName}</span>
                </div>
              ) : (
                <div className="p-3 border rounded-md bg-yellow-50 border-yellow-200 text-yellow-700 text-sm">
                  Awaiting supervisor allocation. Submit your proposal if you haven't yet.
                </div>
              )}
              {mockTheses.map((thesis) => (
                <div key={thesis.id} className="space-y-3">
                  <div>
                    <h3 className="font-medium text-balance">{thesis.title}</h3>
                    <p className="text-sm text-muted-foreground">Supervisor: {thesis.supervisor}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{thesis.progress}%</span>
                    </div>
                    <Progress value={thesis.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[thesis.status]}>In Progress</Badge>
                    <span className="text-sm text-muted-foreground">Updated {thesis.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Stay on track with your thesis milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-balance">{task.task}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                    </div>
                    <Badge className={priorityColors[task.priority]} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Proposal History</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href="/proposals/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Proposal
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    View Notifications
                    {unreadNotifications > 0 && (
                      <Badge className="ml-2 bg-red-100 text-red-800">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-balance">{proposal.title}</h3>
                      <p className="text-sm text-muted-foreground">Submitted: {proposal.submittedAt}</p>
                    </div>
                    <Badge className={statusColors[proposal.status]}>Approved</Badge>
                  </div>
                  {proposal.feedback && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-pretty">{proposal.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
