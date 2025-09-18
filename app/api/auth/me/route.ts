import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getUserByClerkId, getStudentProfile, getSupervisorProfile } from "@/lib/services/user-service"

export async function GET() {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const user = await getUserByClerkId(cu.id)
    if (!user) {
      // Create user if doesn't exist (for new signups)
      const newUser = {
        clerkUserId: cu.id,
        email: cu.emailAddresses?.[0]?.emailAddress || "",
        firstName: cu.firstName || "",
        lastName: cu.lastName || "",
        role: (cu.publicMetadata?.role as string) || "student",
      }
      
      // This would need to be implemented in user-service
      return NextResponse.json({
        id: cu.id,
        email: cu.emailAddresses?.[0]?.emailAddress,
        name: cu.firstName ? `${cu.firstName} ${cu.lastName || ""}`.trim() : cu.username,
        role: newUser.role,
        profile: newUser,
      })
    }

    // Get additional profile data based on role
    let additionalProfile = null
    if (user.role === "student") {
      additionalProfile = await getStudentProfile(cu.id)
    } else if (user.role === "supervisor") {
      additionalProfile = await getSupervisorProfile(cu.id)
    }

    return NextResponse.json({
      id: cu.id,
      email: user.email,
      name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : cu.username,
      role: user.role,
      profile: { ...user, additionalProfile },
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}



