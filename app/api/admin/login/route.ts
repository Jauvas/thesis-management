import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs" // TEMP: disabled for hardcoded auth
import jwt from "jsonwebtoken"

// TEMP: Hardcoded admin credentials for testing only
const TEST_ADMIN = {
  email: "admin@test.com",
  password: "admin123",
  username: "admin",
  role: "superuser"
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // TEMP: Hardcoded check (disable real bcrypt/email validation)
    if (email !== TEST_ADMIN.email || password !== TEST_ADMIN.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: "admin", 
        email: TEST_ADMIN.email, 
        role: TEST_ADMIN.role,
        username: TEST_ADMIN.username
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: "admin", 
        email: TEST_ADMIN.email, 
        role: TEST_ADMIN.role,
        username: TEST_ADMIN.username
      } 
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
