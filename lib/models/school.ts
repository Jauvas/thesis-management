import type { ObjectId } from "mongodb"

export interface School {
  _id?: ObjectId
  name: string
  departments: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  _id?: ObjectId
  name: string
  schoolId: ObjectId
  coordinatorId?: ObjectId
  createdAt: Date
  updatedAt: Date
}
