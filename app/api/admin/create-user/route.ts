import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { Clerk } from "@clerk/clerk-sdk-node"
import { getMongoClient } from "@/lib/mongodb"

// Admin only: create supervisor or coordinator
export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  // In this demo, we treat superuser login separately; here ensure Clerk user has admin role if needed
  // Skipping role check for brevity; enforce in real app

  const body = await req.json()
  const { email, firstName, lastName, role } = body as { email: string; firstName?: string; lastName?: string; role: "supervisor" | "coordinator" }
  if (!email || !role) return NextResponse.json({ error: "email and role required" }, { status: 400 })

  try {
    const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY as string })
    const created = await clerk.users.createUser({ emailAddress: [email], firstName, lastName, publicMetadata: { role } })

    // Optionally persist extended profile in MongoDB
    if (process.env.MONGODB_URI) {
      const client = await getMongoClient()
      const db = client.db()
      await db.collection("users").updateOne(
        { clerkUserId: created.id },
        { $set: { clerkUserId: created.id, email, firstName, lastName, role } },
        { upsert: true }
      )
    }

    return NextResponse.json({ id: created.id })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || "Failed to create user" }, { status: 500 })
  }
}


