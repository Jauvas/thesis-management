"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, Clock } from "lucide-react"

const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@university.edu",
  role: "student" as const,
}

const mockVersions = [
  { id: 3, version: 3, date: "2024-03-12", notes: "Added results section", status: "under_review" },
  { id: 2, version: 2, date: "2024-03-02", notes: "Updated methodology", status: "approved" },
  { id: 1, version: 1, date: "2024-02-15", notes: "Initial submission", status: "approved" },
]

export default function ThesisVersionsPage() {
  return (
    <DashboardLayout user={mockUser} title="Thesis Versions">
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
          <CardDescription>Track changes and manage the final version</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockVersions.map((v) => (
              <div key={v.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Version {v.version}</span>
                    {v.status === "approved" ? (
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{v.date} • {v.notes}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" className="bg-transparent" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Final
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Clock className="h-4 w-4" />
            Latest version may take time to be reviewed by your supervisor.
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}


