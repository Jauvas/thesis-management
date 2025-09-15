"use client"
import { ProposalForm, type ProposalFormData } from "@/components/proposal-form"
import { useRouter } from "next/navigation"

export default function NewProposalPage() {
  const router = useRouter()

  const handleSubmit = async (data: ProposalFormData) => {
    try {
      // TODO: Submit to API
      console.log("Submitting proposal:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to student dashboard
      router.push("/student-dashboard")
    } catch (error) {
      console.error("Error submitting proposal:", error)
      alert("Failed to submit proposal. Please try again.")
    }
  }

  const handleCancel = () => {
    router.push("/student-dashboard")
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <ProposalForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
