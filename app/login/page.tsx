"use client"

import type React from "react"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useSignIn, useSignUp, useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const { user, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    school: "",
    department: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if user is already signed in
  useEffect(() => {
    if (userLoaded && user) {
      // User is already signed in, redirect to appropriate dashboard
      const redirectUser = async () => {
        try {
          const meRes = await fetch("/api/auth/me")
          if (meRes.ok) {
            const userData = await meRes.json()
            const redirectMap = {
              student: "/student-dashboard",
              supervisor: "/supervisor-dashboard", 
              coordinator: "/coordinator-dashboard",
              superuser: "/superuser-dashboard",
            } as const
            router.push(redirectMap[userData.role] || "/student-dashboard")
          } else {
            router.push("/student-dashboard")
          }
        } catch (err) {
          router.push("/student-dashboard")
        }
      }
      redirectUser()
    }
  }, [user, userLoaded, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      if (isSignup) {
        // Sign up with Clerk
        if (!signUp) return
        
        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
        
        if (result.status === "complete") {
          // Bootstrap user data to MongoDB
          await fetch("/api/auth/bootstrap", { method: "POST" })
          router.push("/student-dashboard")
        } else {
          // Email verification required
          setError("Please check your email and verify your account")
        }
      } else {
        // Sign in with Clerk
        if (!signIn) return
        
        const result = await signIn.create({
          identifier: formData.username,
          password: formData.password,
        })
        
        if (result.status === "complete") {
          // Bootstrap user data to MongoDB
          await fetch("/api/auth/bootstrap", { method: "POST" })
          
          // Get user role and redirect accordingly
          const meRes = await fetch("/api/auth/me")
          if (meRes.ok) {
            const userData = await meRes.json()
            const redirectMap = {
              student: "/student-dashboard",
              supervisor: "/supervisor-dashboard", 
              coordinator: "/coordinator-dashboard",
              superuser: "/superuser-dashboard",
            } as const
            router.push(redirectMap[userData.role] || "/student-dashboard")
          } else {
            router.push("/student-dashboard")
          }
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking for existing session
  if (!userLoaded || !signInLoaded || !signUpLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show signed-in state if user is already authenticated
  if (user) {
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
              <CardTitle className="text-2xl">Already Signed In</CardTitle>
              <CardDescription>
                You are already signed in as {user.username || user.emailAddresses[0]?.emailAddress}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => {
                  const redirectUser = async () => {
                    try {
                      const meRes = await fetch("/api/auth/me")
                      if (meRes.ok) {
                        const userData = await meRes.json()
                        const redirectMap = {
                          student: "/student-dashboard",
                          supervisor: "/supervisor-dashboard", 
                          coordinator: "/coordinator-dashboard",
                          superuser: "/superuser-dashboard",
                        } as const
                        router.push(redirectMap[userData.role] || "/student-dashboard")
                      } else {
                        router.push("/student-dashboard")
                      }
                    } catch (err) {
                      router.push("/student-dashboard")
                    }
                  }
                  redirectUser()
                }}
                className="w-full"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => signOut()}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !signInLoaded || !signUpLoaded}>
                {isLoading ? "Please wait..." : (isSignup ? "Create Account" : "Sign In")}
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
