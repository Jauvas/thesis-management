"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSignUp, useUser, useClerk, useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { signIn } = useSignIn()
  const { user, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerk()
  const [emailAddress, setEmailAddress] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const router = useRouter()

  // Redirect if user is already signed in
  useEffect(() => {
    if (userLoaded && user) {
      // User is already signed in, redirect to appropriate dashboard
      const redirectUser = async () => {
        try {
          const meRes = await fetch("/api/auth/me")
          if (meRes.ok) {
            const userData = await meRes.json()
            const redirectMap: Record<string, string> = {
              student: "/student-dashboard",
              supervisor: "/supervisor-dashboard", 
              coordinator: "/coordinator-dashboard",
              superuser: "/superuser-dashboard",
            }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    // Check if user is already signed in
    if (user) {
      setError("You are already signed in. Redirecting...")
      setTimeout(() => {
        const redirectUser = async () => {
          try {
            const meRes = await fetch("/api/auth/me")
            if (meRes.ok) {
              const userData = await meRes.json()
              const redirectMap: Record<string, string> = {
                student: "/student-dashboard",
                supervisor: "/supervisor-dashboard", 
                coordinator: "/coordinator-dashboard",
                superuser: "/superuser-dashboard",
              }
              router.push(redirectMap[userData.role] || "/student-dashboard")
            } else {
              router.push("/student-dashboard")
            }
          } catch (err) {
            router.push("/student-dashboard")
          }
        }
        redirectUser()
      }, 1000)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Server-side create user (mirrors admin supervisor creation)
      const reg = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailAddress,
          username,
          password,
          firstName,
          lastName,
        }),
      })

      if (!reg.ok) {
        const j = await reg.json().catch(() => ({}))
        const parts = [j.error, j.code].filter(Boolean).join(" • ")
        setError(parts || "Registration failed")
        return
      }

      // Now sign in to create session and proceed
      if (!isLoaded || !signIn) return
      const result = await signIn.create({ identifier: username || emailAddress, password })
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        await fetch("/api/auth/bootstrap", { method: "POST" })
        router.push("/student-dashboard")
      } else {
        setError("Sign in after registration did not complete")
      }
    } catch (err: any) {
      console.error("Signup error (server route):", err)
      setError(err?.errors?.[0]?.message || err?.message || "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        await fetch("/api/auth/bootstrap", { method: "POST" })
        router.push("/student-dashboard")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      // Provide clearer error for common Clerk messages
      const msg = err?.errors?.[0]?.message || err?.message || "Verification failed"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking for existing session
  if (!userLoaded || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show signed-in state if user is already authenticated
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already Signed In</CardTitle>
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
                      const redirectMap: Record<string, string> = {
                        student: "/student-dashboard",
                        supervisor: "/supervisor-dashboard", 
                        coordinator: "/coordinator-dashboard",
                        superuser: "/superuser-dashboard",
                      }
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
    )
  }

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify Email</CardTitle>
            <CardDescription>Enter the verification code sent to your email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create a new student account</CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  )
}



