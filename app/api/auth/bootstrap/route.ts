import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { upsertUserByClerkId } from "@/lib/services/user-service"

export async function POST() {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })
  const role = (cu.publicMetadata?.role as string) || "student"
  const user = await upsertUserByClerkId(cu.id, {
    email: cu.emailAddresses?.[0]?.emailAddress || "",
    firstName: cu.firstName || "",
    lastName: cu.lastName || "",
    role,
  })
  if (!user) return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
  return NextResponse.json({ ok: true, user })
}


