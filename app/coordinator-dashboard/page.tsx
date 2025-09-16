"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, AlertCircle, GraduationCap, UserPlus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DemoUser } from "@/lib/demo-data"
import { proposals, supervisors, findSupervisorByUserId, findSupervisorByUserId as _ignore, getStudentById, findSuitableSupervisorsForTopic, coordinatorAssignSupervisor } from "@/lib/mock-entities"

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
  pendingApprovals: 0,
  completedThisYear: 12,
}

// Using supervisors from mock entities

// Coordinator no longer approves proposals; focuses on supervisor allocations

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function CoordinatorDashboard() {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [assignSelection, setAssignSelection] = useState<Record<string, string>>({})

  useEffect(() => {
    // In real app, use auth user; here use mock coordinator
    setUser(mockUser as unknown as DemoUser)
  }, [])

  const pendingAllocations = useMemo(() => proposals.filter(p => !p.assignedSupervisorId), [])

  const handleAssign = (proposalId: string, studentId: string) => {
    const supId = assignSelection[proposalId]
    if (!supId) return
    coordinatorAssignSupervisor("coord-1", studentId, supId)
    const p = proposals.find(px => px.id === proposalId)
    if (p) p.assignedSupervisorId = supId
    alert("Supervisor assigned.")
  }

  if (!user) return <div>Loading...</div>

  return (
    <DashboardLayout user={user} title="Coordinator Dashboard">
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
              <CardTitle className="text-sm font-medium">Pending Allocations</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAllocations.length}</div>
              <p className="text-xs text-muted-foreground">Students awaiting supervisor</p>
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

        <Tabs defaultValue="allocations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="allocations">Pending Allocations</TabsTrigger>
            <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="allocations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Supervisor Allocations</CardTitle>
                <CardDescription>Assign supervisors based on specialties and topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAllocations.length === 0 && (
                    <div className="text-sm text-muted-foreground">No pending allocations.</div>
                  )}
                  {pendingAllocations.map((p) => {
                    const student = getStudentById(p.studentId)
                    const suggestions = findSuitableSupervisorsForTopic(p.topic)
                    return (
                      <div key={p.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{student?.name}</h3>
                              <Badge variant="outline">Topic</Badge>
                            </div>
                            <p className="text-sm font-medium text-balance">{p.topic}</p>
                            {p.summary && <p className="text-sm text-muted-foreground text-pretty">{p.summary}</p>}
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Suggested Supervisors</div>
                            <div className="flex flex-wrap gap-2">
                              {suggestions.map(s => (
                                <Badge key={s.id}>{s.name}</Badge>
                              ))}
                              {suggestions.length === 0 && <span className="text-xs text-muted-foreground">No exact matches</span>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Assign Supervisor</div>
                            <Select value={assignSelection[p.id] || ""} onValueChange={(val) => setAssignSelection(prev => ({ ...prev, [p.id]: val }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose supervisor" />
                              </SelectTrigger>
                              <SelectContent>
                                {supervisors.map(s => (
                                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => handleAssign(p.id, p.studentId)}>
                            <Check className="h-4 w-4 mr-2" /> Assign
                          </Button>
                        </div>
                      </div>
                    )
                  })}
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
                  <Button><UserPlus className="h-4 w-4 mr-2"/>Add Supervisor</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supervisors.map((supervisor) => (
                    <div key={supervisor.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{supervisor.name}</h3>
                          <p className="text-sm text-muted-foreground">{supervisor.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Specialties: {(supervisor.specialties || []).join(", ")}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">School: {supervisor.school}</div>
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
