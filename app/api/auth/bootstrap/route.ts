import { NextResponse } from "next/server"
import { currentUser, clerkClient } from "@clerk/nextjs/server"
import { upsertUserByClerkId, getStudentProfile, createStudentProfile } from "@/lib/services/user-service"

export async function POST() {
  try {
    const cu = await currentUser()
    if (!cu) return new NextResponse("Unauthorized", { status: 401 })
    
    let role = (cu.publicMetadata?.role as string) || "student"
    // Ensure Clerk user has role in publicMetadata for consistency
    if (!cu.publicMetadata?.role) {
      try {
        const cc = await clerkClient()
        await cc.users.updateUser(cu.id, { publicMetadata: { role } })
      } catch (e) {
        console.warn("Failed to set Clerk publicMetadata role; continuing", e)
      }
    }
    const user = await upsertUserByClerkId(cu.id, {
      email: cu.emailAddresses?.[0]?.emailAddress || "",
      firstName: cu.firstName || "",
      lastName: cu.lastName || "",
      username: cu.username || cu.emailAddresses?.[0]?.emailAddress || "",
      role,
    })
    
    if (!user) {
      console.error("Failed to sync user to MongoDB")
      return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
    }
    
    // Auto-create student profile for students if missing
    if (role === "student") {
      const existing = await getStudentProfile(cu.id)
      if (!existing) {
        await createStudentProfile({ userId: cu.id })
      }
    }

    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error("Bootstrap error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


