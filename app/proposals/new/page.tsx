"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { type DemoUser } from "@/lib/demo-data"
import { requestProposal, autoAllocateSupervisorByTopic, getSupervisorNameById, students } from "@/lib/mock-entities"

export default function NewProposalPage() {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [topic, setTopic] = useState("")
  const [summary, setSummary] = useState("")
  const [allocated, setAllocated] = useState<string | null>(null)

  useEffect(() => {
    const currentUserStr = sessionStorage.getItem("currentUser")
    if (!currentUserStr) { window.location.href = "/login"; return }
    setUser(JSON.parse(currentUserStr))
  }, [])

  if (!user) return <div>Loading...</div>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const studentProfile = students.find(s => s.userId === user.id)
    if (!studentProfile) { alert("Student profile not found"); return }
    requestProposal(studentProfile.id, topic, summary)
    const supId = autoAllocateSupervisorByTopic(studentProfile.id, topic)
    const supName = supId ? getSupervisorNameById(supId) : null
    setAllocated(supName || "No suitable supervisor found")
    alert(supName ? `Supervisor allocated: ${supName}` : "No suitable supervisor found. Coordinator will assign manually.")
  }

  return (
    <DashboardLayout user={user} title="Submit Proposal">
      <Card>
        <CardHeader>
          <CardTitle>New Proposal</CardTitle>
          <CardDescription>Enter your topic and brief summary</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm">Topic</label>
              <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm">Summary</label>
              <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={6} />
            </div>
            <Button type="submit">Submit</Button>
            {allocated && (
              <p className="text-sm mt-2">Allocated Supervisor: {allocated}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
