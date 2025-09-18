import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getStudentProfile } from "@/lib/services/user-service"

export async function GET() {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })

  const profile = await getStudentProfile(cu.id)
  return NextResponse.json({ profile })
}


