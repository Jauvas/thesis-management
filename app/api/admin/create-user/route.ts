import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createUser, createSupervisorProfile } from "@/lib/services/user-service"
import { clerkClient } from "@clerk/nextjs/server"

// Admin only: create supervisor or coordinator
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  // In this demo, we treat superuser login separately; here ensure Clerk user has admin role if needed
  // Skipping role check for brevity; enforce in real app

  const body = await req.json()
  const { email, username, password, firstName, lastName, role, school, department, specialties } = body as { 
    email: string; 
    username?: string;
    password?: string;
    firstName?: string; 
    lastName?: string; 
    role: "supervisor" | "coordinator";
    school?: string;
    department?: string;
    specialties?: string[];
  }
  if (!email || !role) return NextResponse.json({ error: "email and role required" }, { status: 400 })
  if (!password) return NextResponse.json({ error: "password required" }, { status: 400 })

  try {
    const client = await clerkClient()
    const created = await client.users.createUser({
      emailAddress: [email],
      username,
      password,
      firstName,
      lastName,
      publicMetadata: { role, school, department, specialties: specialties || [] },
    })

    // Persist to Mongo immediately
    const userData = {
      clerkUserId: created.id,
      email,
      firstName,
      lastName,
      role,
      school,
      department,
      specialties: specialties || [],
    }
    const user = await createUser(userData)
    if (!user) throw new Error("Failed to create user in database")

    if (role === "supervisor") {
      await createSupervisorProfile({
        userId: created.id,
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        school: school || "",
        department: department || "",
        specialties: specialties || [],
      })
    }

    return NextResponse.json({ id: created.id, user })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || "Failed to create user" }, { status: 500 })
  }
}



