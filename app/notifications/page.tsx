"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, MessageSquare, Check } from "lucide-react"

export default function NotificationsPage() {
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])

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

        // Get notifications
        const notifRes = await fetch("/api/notifications")
        if (notifRes.ok) {
          const notifData = await notifRes.json()
          setNotifications(notifData.notifications || [])
        }
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }

    loadData()
  }, [isLoaded, clerkUser])

  const handleResolveComment = async (notificationId: string, commentId: string) => {
    try {
      // TODO: Call API to mark comment as resolved
      // await fetch(`/api/comments/${commentId}/resolve`, { method: "POST" })
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isResolved: true, resolvedAt: new Date().toISOString() }
            : n
        )
      )
    } catch (error) {
      console.error("Failed to resolve comment:", error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout user={user} title="Notifications">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </CardTitle>
          <CardDescription>Stay updated with comments and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {n.type === "comment" ? (
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">{n.title}</p>
                          {!n.isRead && <Badge variant="outline">New</Badge>}
                          {n.isResolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground text-pretty mb-2">{n.message}</p>
                        {n.fromUserName && (
                          <p className="text-xs text-muted-foreground mb-2">
                            From: {n.fromUserName}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {n.type === "comment" && !n.isResolved && n.commentId && (
                      <Button 
                        size="sm" 
                        onClick={() => handleResolveComment(n.id, n.commentId!)}
                        className="ml-4"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


