"use client"

import { SystemSettings, type SystemSettings as SystemSettingsType } from "@/components/system-settings"
import { useRouter } from "next/navigation"

export default function AdminSettingsPage() {
  const router = useRouter()

  const handleSave = async (settings: SystemSettingsType) => {
    try {
      // TODO: Submit to API
      console.log("Saving settings:", settings)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <SystemSettings onSave={handleSave} />
      </div>
    </div>
  )
}
