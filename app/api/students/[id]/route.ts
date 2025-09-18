import { NextResponse } from "next/server"
import { getStudentProfile } from "@/lib/services/user-service"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const profile = await getStudentProfile(params.id)
    if (!profile) return new NextResponse("Not found", { status: 404 })
    return NextResponse.json({ profile })
  } catch (e: any) {
    console.error("Failed to fetch student:", e)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}


