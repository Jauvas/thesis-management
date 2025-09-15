"use client"
import { ReviewPanel, type ReviewItem } from "@/components/review-panel"
import { useRouter } from "next/navigation"

// Mock data - in real app this would be fetched based on the ID
const mockReviewItem: ReviewItem = {
  id: "1",
  type: "proposal",
  title: "AI-Powered Code Review Systems",
  student: {
    name: "John Doe",
    email: "john.doe@university.edu",
  },
  supervisor: {
    name: "Dr. Michael Chen",
    email: "m.chen@university.edu",
  },
  submittedAt: "2024-03-12",
  content: {
    abstract:
      "This research proposes the development of an AI-powered code review system that can automatically identify potential bugs, security vulnerabilities, and code quality issues. The system will use machine learning algorithms trained on large datasets of code repositories to provide intelligent feedback to developers.",
    keywords: ["Artificial Intelligence", "Code Review", "Machine Learning", "Software Engineering"],
    methodology:
      "The research will employ a mixed-methods approach, combining quantitative analysis of code repositories with qualitative evaluation of the AI system's effectiveness. We will use deep learning models, specifically transformer architectures, to analyze code patterns and provide recommendations.",
    objectives: [
      "Develop an AI model capable of identifying code quality issues",
      "Create a user-friendly interface for developers",
      "Evaluate the system's effectiveness compared to traditional code review methods",
      "Assess the impact on development productivity and code quality",
    ],
  },
  status: "pending",
  previousFeedback: [],
}

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleApprove = async (feedback: string) => {
    try {
      // TODO: Submit approval to API
      console.log("Approving with feedback:", feedback)
      alert("Proposal approved successfully!")
      router.push("/coordinator-dashboard")
    } catch (error) {
      console.error("Error approving:", error)
      alert("Failed to approve. Please try again.")
    }
  }

  const handleReject = async (feedback: string) => {
    try {
      // TODO: Submit rejection to API
      console.log("Rejecting with feedback:", feedback)
      alert("Proposal rejected.")
      router.push("/coordinator-dashboard")
    } catch (error) {
      console.error("Error rejecting:", error)
      alert("Failed to reject. Please try again.")
    }
  }

  const handleRequestChanges = async (feedback: string) => {
    try {
      // TODO: Submit change request to API
      console.log("Requesting changes with feedback:", feedback)
      alert("Change request sent to student.")
      router.push("/coordinator-dashboard")
    } catch (error) {
      console.error("Error requesting changes:", error)
      alert("Failed to request changes. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <ReviewPanel
          item={mockReviewItem}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
        />
      </div>
    </div>
  )
}
