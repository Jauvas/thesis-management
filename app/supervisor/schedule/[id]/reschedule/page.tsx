"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, RotateCcw } from "lucide-react"

export default function SupervisorReschedulePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [schedule, setSchedule] = useState<any>(null)
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    if (!isLoaded) return
    if (!clerkUser) { window.location.href = "/sign-in"; return }

    const loadData = async () => {
      try {
        // Get user data
        const meRes = await fetch("/api/auth/me")
        if (meRes.ok) {
          const userData = await meRes.json()
          setUser(userData)
        }

        // TODO: Get schedule data from API
        // const scheduleRes = await fetch(`/api/schedules/${params.id}`)
        // if (scheduleRes.ok) {
        //   const scheduleData = await scheduleRes.json()
        //   setSchedule(scheduleData.schedule)
        // }
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [isLoaded, clerkUser, params.id])

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

  const handleSave = async () => {
    if (!date || !startTime || !endTime) return
    const startAt = new Date(`${date}T${startTime}:00`).toISOString()
    const endAt = new Date(`${date}T${endTime}:00`).toISOString()
    
    try {
      // TODO: Call API to reschedule
      // await fetch(`/api/schedules/${schedule.id}`, { 
      //   method: "PATCH", 
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ startAt, endAt })
      // })
      alert("Meeting rescheduled.")
      router.push("/supervisor-dashboard")
    } catch (error) {
      console.error("Failed to reschedule:", error)
      alert("Failed to reschedule meeting.")
    }
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



