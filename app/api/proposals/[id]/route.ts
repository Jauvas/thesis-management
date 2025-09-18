import { NextResponse } from "next/server"
import { updateProposal } from "@/lib/services/user-service"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const ok = await updateProposal(params.id, body)
  return NextResponse.json({ ok })
}


