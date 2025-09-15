"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { UserPlus, X } from "lucide-react"

interface UserManagementFormProps {
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
  initialData?: Partial<UserFormData>
  mode: "create" | "edit"
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  role: "coordinator" | "supervisor"
  school: string
  department: string
  specializations: string[]
  bio?: string
  officeLocation?: string
  phoneNumber?: string
}

const schools = [
  "School of Computing",
  "School of Engineering",
  "School of Business",
  "School of Medicine",
  "School of Arts & Sciences",
]

const departments = {
  "School of Computing": ["Computer Science", "Information Systems", "Software Engineering", "Data Science"],
  "School of Engineering": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
  "School of Business": ["Business Administration", "Finance", "Marketing", "Management"],
  "School of Medicine": ["Medicine", "Nursing", "Public Health", "Biomedical Sciences"],
  "School of Arts & Sciences": ["Psychology", "Biology", "Chemistry", "Physics", "Mathematics"],
}

export function UserManagementForm({ onSubmit, onCancel, initialData, mode }: UserManagementFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    role: initialData?.role || "supervisor",
    school: initialData?.school || "",
    department: initialData?.department || "",
    specializations: initialData?.specializations || [],
    bio: initialData?.bio || "",
    officeLocation: initialData?.officeLocation || "",
    phoneNumber: initialData?.phoneNumber || "",
  })

  const [newSpecialization, setNewSpecialization] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, newSpecialization.trim()],
      })
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (specialization: string) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((s) => s !== specialization),
    })
  }

  const availableDepartments = formData.school ? departments[formData.school as keyof typeof departments] || [] : []

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {mode === "create" ? "Create New User" : "Edit User"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a new coordinator or supervisor to the system"
            : "Update user information and permissions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@university.edu"
              required
            />
          </div>

          {/* Role and Department */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "coordinator" | "supervisor") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="coordinator">Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School *</Label>
              <Select
                value={formData.school}
                onValueChange={(value) => setFormData({ ...formData, school: value, department: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
              disabled={!formData.school}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specializations */}
          <div className="space-y-2">
            <Label>Research Specializations</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add specialization"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
              />
              <Button type="button" onClick={addSpecialization} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec) => (
                <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                  {spec}
                  <button type="button" onClick={() => removeSpecialization(spec)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officeLocation">Office Location</Label>
              <Input
                id="officeLocation"
                value={formData.officeLocation}
                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                placeholder="Building, Room Number"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biography (Optional)</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief professional biography and research interests..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {mode === "create" ? "Create User" : "Update User"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
