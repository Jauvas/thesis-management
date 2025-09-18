"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
// Use API route to create proposal; avoid server imports

export default function NewProposalPage() {
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [topic, setTopic] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!isLoaded) return
    
    if (!clerkUser) {
      window.location.href = "/sign-in"
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        window.location.href = "/sign-in"
      }
    }

    fetchUser()
  }, [isLoaded, clerkUser])

  if (!user) return <div>Loading...</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, summary }),
      })
      if (!res.ok) throw new Error(`Failed to submit proposal: ${res.status}`)
      const ct = res.headers.get("content-type") || ""
      if (!ct.includes("application/json")) throw new Error("Non-JSON response from /api/proposals")
      const { proposal } = await res.json()
      if (proposal) {
        setSuccess("Proposal submitted successfully! A coordinator will assign a supervisor.")
        setTopic("")
        setSummary("")
      } else {
        setError("Failed to submit proposal. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting proposal:", error)
      setError("Failed to submit proposal. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm">{success}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
