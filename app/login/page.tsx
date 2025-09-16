"use client"

import type React from "react"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { authenticateUser } from "@/lib/demo-data"

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    school: "",
    department: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (isSignup) {
      // For signup, default role is student
      console.log("Signup attempt:", formData)
      // TODO: Add user to demo data
      alert("Account created successfully! You can now login.")
      setIsSignup(false)
      return
    }

    // For login, authenticate against demo data
    const user = authenticateUser(formData.username, formData.password)
    if (!user) {
      setError("Invalid username or password")
      return
    }

    // Redirect based on authenticated user's role
    const redirectMap = {
      student: "/student-dashboard",
      supervisor: "/supervisor-dashboard", 
      coordinator: "/coordinator-dashboard",
      superuser: "/superuser-dashboard",
    } as const
    
    // Store user in sessionStorage for demo purposes
    sessionStorage.setItem("currentUser", JSON.stringify(user))
    window.location.href = redirectMap[user.role]
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap style={{
                color: "var(--primary)",
                height: "48px",
                width: "48px"
              }}/>
            </div>
            <CardTitle className="text-2xl">{isSignup ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignup ? "Sign up as a student to get started" : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "student" | "supervisor" | "coordinator") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {isSignup && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Select
                      value={formData.school}
                      onValueChange={(value) => setFormData({ ...formData, school: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computing">School of Computing</SelectItem>
                        <SelectItem value="engineering">School of Engineering</SelectItem>
                        <SelectItem value="business">School of Business</SelectItem>
                        <SelectItem value="medicine">School of Medicine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="information-systems">Information Systems</SelectItem>
                        <SelectItem value="software-engineering">Software Engineering</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full">
                {isSignup ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                style={{
                  color:'black',
                }}
              >
                {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
