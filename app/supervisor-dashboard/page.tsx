"use client"

import { useEffect, useMemo, useState } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, CheckCircle, MessageSquare, Calendar, Eye, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const statusColors = {
  current: "bg-blue-100 text-blue-800",
  ended: "bg-green-100 text-green-800",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function SupervisorDashboard() {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [user, setUser] = useState<any>(null)
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("students")
  const [myStudents, setMyStudents] = useState<any[]>([])
  const [pendingReviews, setPendingReviews] = useState<any[]>([])

  useEffect(() => {
    if (!isLoaded) return
    if (!clerkUser) { window.location.href = "/sign-in"; return }

    const bootstrap = async () => {
      // Fetch merged auth/me for role and profile info
      const meRes = await fetch("/api/auth/me")
      if (!meRes.ok) { window.location.href = "/sign-in"; return }
      const me = await meRes.json()
      setUser(me)

      // Load students for this supervisor
      const supId = clerkUser.id
      const stRes = await fetch(`/api/supervisors/${supId}/students`)
      if (stRes.ok) {
        const stJson = await stRes.json()
        setMyStudents(stJson.students || [])
      } else {
        setMyStudents([])
      }

      // Pending proposals for reviews (filter by assignedSupervisorId)
      const propRes = await fetch("/api/proposals")
      if (propRes.ok) {
        const pj = await propRes.json()
        const list = Array.isArray(pj.proposals) ? pj.proposals : []
        const reviews = list
          .filter((p: any) => p.assignedSupervisorId === supId)
          .map((p: any, i: number) => ({
            id: p.id || p._id,
            student: p.studentName || p.studentId,
            title: p.topic,
            submittedAt: p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : "",
            priority: (i % 2 === 0 ? "high" : "medium") as const,
          }))
        setPendingReviews(reviews)
      } else {
        setPendingReviews([])
      }
    }

    bootstrap()
  }, [isLoaded, clerkUser])

  const supervisorId = useMemo(() => {
    if (!clerkUser) return null
    return clerkUser.id
  }, [clerkUser])

  const filteredStudents = useMemo(() => {
    if (!query) return myStudents
    const q = query.toLowerCase()
    return myStudents.filter((s: any) =>
      (s.name || "").toLowerCase().includes(q) || (s.researchTopic || "").toLowerCase().includes(q)
    )
  }, [myStudents, query])

  const currentStudents = filteredStudents.filter((s: any) => s.status === "current")
  const endedStudents = filteredStudents.filter((s: any) => s.status === "ended")

  if (!user || !supervisorId) {
    return <div>Loading...</div>
  }

  const schedulesForSup: any[] = []

  return (
    <DashboardLayout user={user} title="Supervisor Dashboard">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={async () => { await signOut(); window.location.href = "/sign-in" }}>
          Sign Out
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStudents.length}</div>
              <p className="text-xs text-muted-foreground">Currently supervising</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting feedback</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ended Students</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{endedStudents.length}</div>
              <p className="text-xs text-muted-foreground">Completed supervision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schedulesForSup.length}</div>
              <p className="text-xs text-muted-foreground">Meetings & plans</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students" onClick={() => setActiveTab("students")}>My Students</TabsTrigger>
            <TabsTrigger value="reviews" onClick={() => setActiveTab("reviews")}>Pending Reviews</TabsTrigger>
            <TabsTrigger value="schedule" onClick={() => setActiveTab("schedule")}>Schedule</TabsTrigger>
            <TabsTrigger value="previous" onClick={() => setActiveTab("previous")}>Previous Students</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Students Under Supervision</CardTitle>
                <CardDescription>Filter, search and manage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by student name or research topic" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                  <Button asChild variant="outline">
                    <Link href="#students">All Students</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {currentStudents.map((s) => (
                    <div key={s.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{s.name}</h3>
                          <p className="text-sm text-muted-foreground">{s.course} • {s.regNo}</p>
                          <p className="text-sm font-medium mt-1 text-balance">{s.researchTopic}</p>
                        </div>
                        <Badge className={statusColors[s.status]}>{s.status}</Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/supervisor/student/${s.id}/message`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/supervisor/student/${s.id}/schedule`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Meeting
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/supervisor/student/${s.id}` }>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
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
                <CardDescription>First-come, first-served</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{review.student}</h3>
                            <Badge variant="outline">request</Badge>
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
                        <Button size="sm" variant="outline">Download</Button>
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
                <div className="space-y-3">
                  {schedulesForSup.map((s: any) => (
                    <div key={s.id} className="border rounded-md p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(s.startAt).toLocaleString()} - {new Date(s.endAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/supervisor/schedule/${s.id}/reschedule`}>Reschedule</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {schedulesForSup.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4" />
                      <p>No upcoming meetings scheduled</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="previous" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Previous Students</CardTitle>
                <CardDescription>All ended supervisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endedStudents.map((s) => (
                    <div key={s.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{s.name}</h3>
                          <p className="text-sm text-muted-foreground">{s.course} • {s.regNo}</p>
                          <p className="text-sm font-medium mt-1 text-balance">{s.researchTopic}</p>
                        </div>
                        <Badge className={statusColors[s.status]}>{s.status}</Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/supervisor/student/${s.id}` }>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
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
