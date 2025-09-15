import type { ObjectId } from "mongodb"

export interface Proposal {
  _id?: ObjectId
  studentId: ObjectId
  supervisorId?: ObjectId
  coordinatorId?: ObjectId
  title: string
  abstract: string
  keywords: string[]
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  submittedAt?: Date
  reviewedAt?: Date
  feedback?: string
  createdAt: Date
  updatedAt: Date
}

export interface Thesis {
  _id?: ObjectId
  proposalId: ObjectId
  studentId: ObjectId
  supervisorId: ObjectId
  coordinatorId?: ObjectId
  title: string
  abstract: string
  keywords: string[]
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published"
  versions: ThesisVersion[]
  defenseDate?: Date
  examiners?: ObjectId[]
  finalGrade?: string
  submittedAt?: Date
  approvedAt?: Date
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ThesisVersion {
  version: number
  fileUrl: string
  uploadedAt: Date
  feedback?: string
}

export interface Repository {
  _id?: ObjectId
  thesisId: ObjectId
  title: string
  author: string
  school: string
  department: string
  year: number
  abstract: string
  keywords: string[]
  fileUrl: string
  downloadCount: number
  publishedAt: Date
}
