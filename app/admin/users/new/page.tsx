"use client"

import { UserManagementForm, type UserFormData } from "@/components/user-management-form"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const router = useRouter()

  const handleSubmit = async (data: UserFormData) => {
    try {
      // TODO: Submit to API
      console.log("Creating user:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("User created successfully!")
      router.push("/superuser-dashboard")
    } catch (error) {
      console.error("Error creating user:", error)
      alert("Failed to create user. Please try again.")
    }
  }

  const handleCancel = () => {
    router.push("/superuser-dashboard")
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <UserManagementForm onSubmit={handleSubmit} onCancel={handleCancel} mode="create" />
      </div>
    </div>
  )
}
