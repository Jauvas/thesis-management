import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getNotificationsByUserId } from "@/lib/services/user-service"

export async function GET() {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })

  const notifications = await getNotificationsByUserId(cu.id)
  return NextResponse.json({ notifications })
}


