"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    school: "",
    department: "",
    role: "student" as "student" | "supervisor" | "coordinator" | "superuser",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Clerk authentication
    console.log("Login/Signup attempt:", formData)
    // Mock redirect based on role
    const redirectMap = {
      student: "/student-dashboard",
      supervisor: "/supervisor-dashboard",
      coordinator: "/coordinator-dashboard",
      superuser: "/superuser-dashboard",
    } as const
    window.location.href = redirectMap[formData.role]
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
              <GraduationCap className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="text-2xl">{isSignup ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isSignup ? "Sign up as a student to get started" : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "student" | "supervisor" | "coordinator" | "superuser") =>
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
                    <SelectItem value="superuser">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
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
                className="text-accent hover:text-accent/80 text-sm"
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
