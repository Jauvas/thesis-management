import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  clerkId?: string | null // null for superuser
  email: string
  role: "superuser" | "coordinator" | "supervisor" | "student"
  school?: string
  department?: string
  firstName?: string
  lastName?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  clerkId?: string | null
  email: string
  role: "superuser" | "coordinator" | "supervisor" | "student"
  school?: string
  department?: string
  firstName?: string
  lastName?: string
}
