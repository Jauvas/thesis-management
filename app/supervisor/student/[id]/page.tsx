"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Download, MessageSquare, CheckCircle, FileText, Upload } from "lucide-react"
import { type DemoUser, addSupervisorComment } from "@/lib/demo-data"
import { getStudentById, getThesisVersions } from "@/lib/mock-entities"

export default function SupervisorStudentDetailsPage() {
  const params = useParams<{ id: string }>()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [comment, setComment] = useState("")
  const student = useMemo(() => getStudentById(params.id), [params.id])
  const versions = useMemo(() => getThesisVersions(params.id), [params.id])

  useEffect(() => {
    const currentUserStr = sessionStorage.getItem("currentUser")
    if (!currentUserStr) {
      window.location.href = "/login"
      return
    }
    setUser(JSON.parse(currentUserStr))
  }, [])

  if (!user || !student) {
    return <div>Loading...</div>
  }

  const handleAddComment = () => {
    if (!comment.trim()) return
    addSupervisorComment({ studentUserId: student.userId, supervisorUserId: user.id, thesisId: student.id, content: comment.trim() })
    setComment("")
    alert("Comment sent and student notified.")
  }

  return (
    <DashboardLayout user={user} title="Student Details">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{student.name}</CardTitle>
            <CardDescription>{student.course} • {student.regNo}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p><span className="text-muted-foreground">School:</span> {student.school}</p>
              <p><span className="text-muted-foreground">Department:</span> {student.department}</p>
              <p><span className="text-muted-foreground">Status:</span> <Badge>{student.status}</Badge></p>
            </div>
            <div>
              <p className="font-medium">Research Topic</p>
              <p className="text-sm text-balance">{student.researchTopic}</p>
            </div>
            <div>
              <p className="font-medium">Summary</p>
              <p className="text-sm text-pretty">{student.researchSummary}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Download className="h-4 w-4 mr-2"/>Download Latest</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supervisor Comments</CardTitle>
            <CardDescription>Send a comment. Student will receive as a review.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea placeholder="Write your comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={handleAddComment}><MessageSquare className="h-4 w-4 mr-2"/>Send Comment</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Version History</CardTitle>
            <CardDescription>Compare and download versions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {versions.map(v => (
                <div key={v.id} className="border rounded-md p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">V{v.versionNumber}: {v.title}</p>
                    <p className="text-sm text-muted-foreground">Uploaded {new Date(v.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {v.isFinal && <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1"/>Final</Badge>}
                    <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-2"/>Download</Button>
                  </div>
                </div>
              ))}
              {versions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-4" />
                  <p>No versions uploaded yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}


