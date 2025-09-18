"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, RotateCcw } from "lucide-react"
import { type DemoUser } from "@/lib/demo-data"
import { schedules, reschedule } from "@/lib/mock-entities"

export default function SupervisorReschedulePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const schedule = useMemo(() => schedules.find(s => s.id === params.id), [params.id])
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    const currentUserStr = sessionStorage.getItem("currentUser")
    if (!currentUserStr) { window.location.href = "/login"; return }
    setUser(JSON.parse(currentUserStr))
  }, [])

  useEffect(() => {
    if (schedule) {
      const start = new Date(schedule.startAt)
      const end = new Date(schedule.endAt)
      setDate(start.toISOString().slice(0, 10))
      setStartTime(start.toTimeString().slice(0, 5))
      setEndTime(end.toTimeString().slice(0, 5))
    }
  }, [schedule])

  if (!user || !schedule) return <div>Loading...</div>

  const handleSave = () => {
    if (!date || !startTime || !endTime) return
    const startAt = new Date(`${date}T${startTime}:00`).toISOString()
    const endAt = new Date(`${date}T${endTime}:00`).toISOString()
    reschedule(schedule.id, startAt, endAt)
    alert("Meeting rescheduled.")
    router.push("/supervisor-dashboard")
  }

  return (
    <DashboardLayout user={user} title="Reschedule Meeting">
      <Card>
        <CardHeader>
          <CardTitle>Reschedule: {schedule.title}</CardTitle>
          <CardDescription>Update date and time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
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
            <Button variant="outline" onClick={() => router.back()}><RotateCcw className="h-4 w-4 mr-2"/>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}



