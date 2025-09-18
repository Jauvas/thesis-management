import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { createProposal, getProposalsByStatus } from "@/lib/services/user-service"

export async function GET() {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })
  const proposals = await getProposalsByStatus("pending")
  return NextResponse.json({ proposals })
}

export async function POST(req: Request) {
  const cu = await currentUser()
  if (!cu) return new NextResponse("Unauthorized", { status: 401 })
  const body = await req.json()
  const { topic, summary } = body as { topic: string; summary?: string }
  if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 })
  const proposal = await createProposal({ studentId: cu.id, topic, summary, status: "pending" })
  return NextResponse.json({ proposal })
}


