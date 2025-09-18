import { NextResponse } from "next/server"
import { getSupervisorProfile } from "@/lib/services/user-service"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const profile = await getSupervisorProfile(params.id)
  if (!profile) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json({ profile })
}


