"use client"
import { ThesisUpload, type ThesisUploadData } from "@/components/thesis-upload"
import { useRouter } from "next/navigation"

export default function ThesisUploadPage() {
  const router = useRouter()

  const handleUpload = async (data: ThesisUploadData) => {
    try {
      // TODO: Upload to API
      console.log("Uploading thesis:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to student dashboard
      router.push("/student-dashboard")
    } catch (error) {
      console.error("Error uploading thesis:", error)
      alert("Failed to upload thesis. Please try again.")
    }
  }

  const handleCancel = () => {
    router.push("/student-dashboard")
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <ThesisUpload onUpload={handleUpload} onCancel={handleCancel} currentVersion={2} />
      </div>
    </div>
  )
}
