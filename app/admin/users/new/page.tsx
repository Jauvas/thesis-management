"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

// Mock admin user
const mockUser = {
  name: "System Administrator",
  email: "admin@thesis.com",
  role: "superuser" as const,
}

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    role: "",
    school: "",
    department: "",
    specialties: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username || undefined,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          school: formData.school,
          department: formData.department,
          specialties: formData.specialties.split(",").map(s => s.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      setSuccess("User created successfully!")
      setTimeout(() => {
      router.push("/superuser-dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    if (field === "school") {
      setFormData(prev => ({ ...prev, school: value, department: "" }))
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const schools = [
    "School of Computing",
    "School of Engineering",
    "School of Business",
    "School of Medicine",
    "School of Arts & Sciences",
  ]

  const departmentsBySchool: Record<string, string[]> = {
    "School of Computing": ["Computer Science", "Information Systems", "Software Engineering", "Data Science"],
    "School of Engineering": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
    "School of Business": ["Business Administration", "Finance", "Marketing", "Management"],
    "School of Medicine": ["Medicine", "Nursing", "Public Health", "Biomedical Sciences"],
    "School of Arts & Sciences": ["Psychology", "Biology", "Chemistry", "Physics", "Mathematics"],
  }

  const availableDepartments = formData.school ? departmentsBySchool[formData.school] || [] : []


  return (
    <DashboardLayout user={mockUser} title="Create New User">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/superuser-dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new supervisor or coordinator to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Select value={formData.school} onValueChange={(value) => handleChange("school", value)}>
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleChange("department", value)} disabled={!formData.school}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder={formData.school ? "Select department" : "Select school first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "supervisor" && (
                <div className="space-y-2">
                  <Label htmlFor="specialties">Research Specialties</Label>
                  <Textarea
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => handleChange("specialties", e.target.value)}
                    placeholder="Enter specialties separated by commas (e.g., Machine Learning, Data Science, AI)"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    These specialties will be used to match students with appropriate supervisors
                  </p>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {success && (
                <div className="text-green-500 text-sm">{success}</div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating User..." : "Create User"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/superuser-dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}