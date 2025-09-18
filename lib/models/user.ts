import { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  clerkUserId: string
  email: string
  firstName?: string
  lastName?: string
  role: "student" | "supervisor" | "coordinator" | "superuser"
  school?: string
  department?: string
  specialties?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface StudentProfile {
  _id?: ObjectId
  userId: string
  name: string
  regNumber: string
  course: string
  supervisorId?: string
  status: "current" | "ended"
  createdAt: Date
  updatedAt: Date
}

export interface SupervisorProfile {
  _id?: ObjectId
  userId: string
  name: string
  school: string
  department: string
  specialties: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ThesisVersion {
  _id?: ObjectId
  studentId: string
  version: number
  title: string
  fileUrl: string
  uploadedAt: Date
  isFinal: boolean
  comments?: string[]
}

export interface Notification {
  _id?: ObjectId
  userId: string
  type: "comment" | "meeting" | "message" | "assignment"
  title: string
  message: string
  isRead: boolean
  isResolved?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id?: ObjectId
  thesisId: string
  supervisorId: string
  content: string
  isResolved: boolean
  isApproved?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ScheduleItem {
  _id?: ObjectId
  supervisorId: string
  studentId: string
  title: string
  description?: string
  scheduledAt: Date
  status: "scheduled" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface MessageItem {
  _id?: ObjectId
  fromUserId: string
  toUserId: string
  subject: string
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StudentProposal {
  _id?: ObjectId
  studentId: string
  topic: string
  summary?: string
  assignedSupervisorId?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
}