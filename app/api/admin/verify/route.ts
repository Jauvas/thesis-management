import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("admin-token=")[1]?.split(";")[0]
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    return NextResponse.json({ 
      authenticated: true, 
      user: { 
        id: decoded.userId, 
        email: decoded.email, 
        role: decoded.role,
        username: decoded.username
      } 
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
