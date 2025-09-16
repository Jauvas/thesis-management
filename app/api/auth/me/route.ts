import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getMongoClient } from "@/lib/mongodb"

export async function GET() {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })

  let profile: any = null
  try {
    if (process.env.MONGODB_URI) {
      const client = await getMongoClient()
      const db = client.db()
      profile = await db.collection("users").findOne({ clerkUserId: cu.id })
    }
  } catch {}

  const role = (profile?.role as string) || ((cu.publicMetadata?.role as string) || "student")

  return NextResponse.json({
    id: cu.id,
    email: cu.emailAddresses?.[0]?.emailAddress,
    name: cu.firstName ? `${cu.firstName} ${cu.lastName || ""}`.trim() : cu.username,
    role,
    profile,
  })
}


