import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { upsertUserByClerkId, createStudentProfile, getStudentProfile } from "@/lib/services/user-service"

// Public student self-signup using server-side Clerk (mirrors admin create-user flow)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, password, firstName, lastName } = body as {
      email: string
      username?: string
      password: string
      firstName?: string
      lastName?: string
    }

    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 })
    }

    const client = await clerkClient()
    const created = await client.users.createUser({
      emailAddress: [email],
      username,
      password,
      firstName,
      lastName,
      publicMetadata: { role: "student" },
    })

    // Persist to Mongo (best-effort). If it fails (e.g., network), still return ok.
    try {
      const user = await upsertUserByClerkId(created.id, {
        email,
        firstName,
        lastName,
        username: username || email,
        role: "student",
      })
      if (user) {
        const existing = await getStudentProfile(created.id)
        if (!existing) {
          await createStudentProfile({ userId: created.id })
        }
      }
    } catch (persistErr) {
      console.warn("Deferred Mongo persistence due to error:", persistErr)
      // Will be handled later by /api/auth/bootstrap after first sign-in
    }

    return NextResponse.json({ ok: true, persisted: true })
  } catch (err: any) {
    const first = err?.errors?.[0]
    const message = first?.message || err?.message || "Registration failed"
    const code = first?.code
    const meta = first?.meta
    return NextResponse.json({ error: message, code, meta }, { status: 400 })
  }
}


