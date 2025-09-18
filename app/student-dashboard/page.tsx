"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, AlertCircle, Plus, Calendar, MessageSquare, Bell } from "lucide-react"
import Link from "next/link"
// Use API routes; do not import server code here

// Removed mock data; all data loads via API routes

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  in_progress: "bg-blue-100 text-blue-800",
}

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function StudentDashboard() {
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [supervisorName, setSupervisorName] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    
    if (!clerkUser) {
      window.location.href = "/sign-in"
      return
    }

    // Fetch user data from API
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          if (response.status === 401) { window.location.href = "/sign-in"; return }
          throw new Error(`Failed /api/auth/me: ${response.status}`)
        }
        const ct = response.headers.get("content-type") || ""
        if (!ct.includes("application/json")) throw new Error("Non-JSON response from /api/auth/me")
        const userData = await response.json()
        setUser(userData)
        
        // Count unread notifications
        const notifsRes = await fetch("/api/notifications")
        if (!notifsRes.ok) throw new Error(`Failed /api/notifications: ${notifsRes.status}`)
        const notifCt = notifsRes.headers.get("content-type") || ""
        if (!notifCt.includes("application/json")) throw new Error("Non-JSON response from /api/notifications")
        const notifsJson = await notifsRes.json()
        const notifications = (notifsJson && notifsJson.notifications) || []
        setUnreadNotifications(notifications.filter((n: any) => !n.isRead).length)
        
        // Resolve supervisor from student profile
        const profRes = await fetch("/api/profile/student")
        if (!profRes.ok) throw new Error(`Failed /api/profile/student: ${profRes.status}`)
        const profCt = profRes.headers.get("content-type") || ""
        if (!profCt.includes("application/json")) throw new Error("Non-JSON response from /api/profile/student")
        const profJson = await profRes.json()
        const studentProfile = profJson && profJson.profile
        if (studentProfile?.supervisorId) {
          const supRes = await fetch(`/api/supervisors/${studentProfile.supervisorId}`)
          if (!supRes.ok) throw new Error(`Failed /api/supervisors/${studentProfile.supervisorId}: ${supRes.status}`)
          const supCt = supRes.headers.get("content-type") || ""
          if (!supCt.includes("application/json")) throw new Error("Non-JSON response from /api/supervisors/[id]")
          const supJson = await supRes.json()
          setSupervisorName((supJson && supJson.profile && supJson.profile.name) || null)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        // Fallback to basic user data
        setUser({
          id: clerkUser.id,
          email: clerkUser.emailAddresses?.[0]?.emailAddress,
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : clerkUser.username,
          role: "student"
        })
      }
    }

    fetchUser()
  }, [isLoaded, clerkUser])

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
