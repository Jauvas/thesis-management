"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, MessageSquare, Download, Eye, Calendar } from "lucide-react"

interface ReviewPanelProps {
  item: ReviewItem
  onApprove: (feedback: string) => void
  onReject: (feedback: string) => void
  onRequestChanges: (feedback: string) => void
}

export interface ReviewItem {
  id: string
  type: "proposal" | "thesis_chapter" | "final_thesis"
  title: string
  student: {
    name: string
    email: string
  }
  supervisor?: {
    name: string
    email: string
  }
  submittedAt: string
  content: {
    abstract?: string
    keywords?: string[]
    methodology?: string
    objectives?: string[]
    fileUrl?: string
    version?: number
  }
  status: "pending" | "approved" | "rejected" | "changes_requested"
  previousFeedback?: string[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  changes_requested: "bg-orange-100 text-orange-800",
}

export function ReviewPanel({ item, onApprove, onReject, onRequestChanges }: ReviewPanelProps) {
  const [feedback, setFeedback] = useState("")
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | "changes" | null>(null)

  const handleSubmitReview = () => {
    if (!feedback.trim()) {
      alert("Please provide feedback before submitting your review.")
      return
    }

    switch (activeAction) {
      case "approve":
        onApprove(feedback)
        break
      case "reject":
        onReject(feedback)
        break
      case "changes":
        onRequestChanges(feedback)
        break
    }

    setFeedback("")
    setActiveAction(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-balance">{item.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="space-y-1">
                  <div>
                    Student: {item.student.name} ({item.student.email})
                  </div>
                  {item.supervisor && <div>Supervisor: {item.supervisor.name}</div>}
                  <div className="flex items-center gap-2">
                    <span>Submitted: {item.submittedAt}</span>
                    <Badge className={statusColors[item.status]}>{item.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {item.content.fileUrl && (
                <>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
          <TabsTrigger value="review">Submit Review</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.content.abstract && (
                <div>
                  <h4 className="font-medium mb-2">Abstract</h4>
                  <p className="text-sm text-muted-foreground text-pretty">{item.content.abstract}</p>
                </div>
              )}

              {item.content.keywords && item.content.keywords.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.content.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {item.content.objectives && item.content.objectives.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Research Objectives</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {item.content.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.content.methodology && (
                <div>
                  <h4 className="font-medium mb-2">Methodology</h4>
                  <p className="text-sm text-muted-foreground text-pretty">{item.content.methodology}</p>
                </div>
              )}

              {item.content.version && (
                <div>
                  <h4 className="font-medium mb-2">Document Version</h4>
                  <p className="text-sm text-muted-foreground">Version {item.content.version}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              {item.previousFeedback && item.previousFeedback.length > 0 ? (
                <div className="space-y-4">
                  {item.previousFeedback.map((feedback, index) => (
                    <div key={index} className="border-l-4 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Previous Review #{index + 1}</span>
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty">{feedback}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>No previous reviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Review</CardTitle>
              <CardDescription>Provide detailed feedback and make a decision on this submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">
                  Feedback and Comments *
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback on the submission..."
                  rows={6}
                  className={activeAction ? "border-2" : ""}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveAction("approve")}
                  variant={activeAction === "approve" ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>

                <Button
                  onClick={() => setActiveAction("changes")}
                  variant={activeAction === "changes" ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Request Changes
                </Button>

                <Button
                  onClick={() => setActiveAction("reject")}
                  variant={activeAction === "reject" ? "destructive" : "outline"}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>

              {activeAction && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    {activeAction === "approve" && "Approve Submission"}
                    {activeAction === "changes" && "Request Changes"}
                    {activeAction === "reject" && "Reject Submission"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeAction === "approve" &&
                      "This submission meets the requirements and can proceed to the next stage."}
                    {activeAction === "changes" &&
                      "This submission needs revisions before it can be approved. The student will be notified."}
                    {activeAction === "reject" && "This submission does not meet the requirements and cannot proceed."}
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitReview} size="sm">
                      Submit Review
                    </Button>
                    <Button onClick={() => setActiveAction(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
