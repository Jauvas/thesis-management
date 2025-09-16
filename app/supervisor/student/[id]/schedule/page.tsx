"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock } from "lucide-react"
import { type DemoUser } from "@/lib/demo-data"
import { addSchedule, getStudentById } from "@/lib/mock-entities"

export default function SupervisorScheduleMeetingPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [title, setTitle] = useState("Supervisor Meeting")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const student = useMemo(() => getStudentById(params.id), [params.id])

  useEffect(() => {
    const currentUserStr = sessionStorage.getItem("currentUser")
    if (!currentUserStr) { window.location.href = "/login"; return }
    setUser(JSON.parse(currentUserStr))
  }, [])

  if (!user || !student) return <div>Loading...</div>

  const handleSave = () => {
    if (!date || !startTime || !endTime) return
    const startAt = new Date(`${date}T${startTime}:00`).toISOString()
    const endAt = new Date(`${date}T${endTime}:00`).toISOString()
    addSchedule({ supervisorId: student.supervisorId, studentId: student.id, title, startAt, endAt })
    alert("Meeting scheduled and student will be notified.")
    router.push("/supervisor-dashboard")
  }

  return (
    <DashboardLayout user={user} title="Schedule Meeting">
      <Card>
        <CardHeader>
          <CardTitle>Schedule with {student.name}</CardTitle>
          <CardDescription>Student: {student.course} • {student.regNo}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className="text-sm">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className="text-sm">Start Time</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-3">
              <label className="text-sm">End Time</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}><Calendar className="h-4 w-4 mr-2"/>Save</Button>
            <Button variant="outline" onClick={() => router.back()}><Clock className="h-4 w-4 mr-2"/>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


