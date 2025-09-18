import { NextResponse } from "next/server"
import { getStudentsBySupervisor } from "@/lib/services/user-service"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const students = await getStudentsBySupervisor(params.id)
    return NextResponse.json({ students })
  } catch (e: any) {
    console.error("Failed to fetch students by supervisor:", e)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}


