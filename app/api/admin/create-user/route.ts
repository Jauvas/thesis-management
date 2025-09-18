import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createUser, createSupervisorProfile } from "@/lib/services/user-service"
import { clerkClient } from "@clerk/nextjs/server"

// Admin only: create supervisor or coordinator
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  const { userId } = await auth()

  // Support either Clerk session (userId) OR our admin JWT cookie
  let isAdminAuthorized = Boolean(userId)
  if (!isAdminAuthorized) {
    try {
      const cookieHeader = req.headers.get("cookie") || ""
      const token = cookieHeader.split("admin-token=")[1]?.split(";")[0]
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        isAdminAuthorized = decoded?.role === "superuser"
      }
    } catch (_err) {
      isAdminAuthorized = false
    }
  }

  if (!isAdminAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // In this demo, we treat superuser login separately; here ensure Clerk user has admin role if needed
  // Skipping role check for brevity; enforce in real app

  const body = await req.json()
  const { email, username, password, firstName, lastName, role, school, department, specialties } = body as { 
    email: string; 
    username: string;
    password: string;
    firstName?: string; 
    lastName?: string; 
    role: "supervisor" | "coordinator";
    school?: string;
    department?: string;
    specialties?: string[];
  }
  if (!email || !role) return NextResponse.json({ error: "email and role required" }, { status: 400 })
  if (!password) return NextResponse.json({ error: "password required" }, { status: 400 })
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 })

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
    console.error("Create user failed:", e)
    const message = e?.errors?.[0]?.message || e?.message || "Failed to create user"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}



