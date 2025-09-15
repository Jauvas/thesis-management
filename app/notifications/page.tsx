"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, MessageSquare } from "lucide-react"

const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@university.edu",
  role: "student" as const,
}

const mockNotifications = [
  {
    id: 1,
    type: "comment",
    title: "Supervisor commented on your proposal",
    message: "Please clarify the evaluation metrics in your methodology section.",
    date: "2024-03-12 10:15",
    read: false,
  },
  {
    id: 2,
    type: "status",
    title: "Proposal approved",
    message: "Your proposal has been approved. You can proceed with your thesis.",
    date: "2024-03-11 09:00",
    read: true,
  },
]

export default function NotificationsPage() {
  return (
    <DashboardLayout user={mockUser} title="Notifications">
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
            {mockNotifications.map((n) => (
              <div key={n.id} className="border rounded-lg p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {n.type === "comment" ? (
                    <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{n.title}</p>
                      {!n.read && <Badge variant="outline">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground text-pretty">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


