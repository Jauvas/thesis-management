"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { type DemoUser } from "@/lib/demo-data"
import { getStudentById, sendMessage } from "@/lib/mock-entities"

export default function SupervisorSendMessagePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const student = useMemo(() => getStudentById(params.id), [params.id])

  useEffect(() => {
    const currentUserStr = sessionStorage.getItem("currentUser")
    if (!currentUserStr) { window.location.href = "/login"; return }
    setUser(JSON.parse(currentUserStr))
  }, [])

  if (!user || !student) return <div>Loading...</div>

  const handleSend = () => {
    if (!content.trim()) return
    sendMessage(user.id, student.userId, subject ? `${subject}: ${content.trim()}` : content.trim())
    alert("Message sent to student.")
    router.push(`/supervisor/student/${student.id}`)
  }

  return (
    <DashboardLayout user={user} title="Send Message">
      <Card>
        <CardHeader>
          <CardTitle>Message {student.name}</CardTitle>
          <CardDescription>Student: {student.course} • {student.regNo}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <Textarea placeholder="Write your message..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <div className="flex gap-2">
              <Button onClick={handleSend}><Send className="h-4 w-4 mr-2"/>Send</Button>
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


