import "server-only"
import { getMongoClient } from "@/lib/mongodb"
import { User, StudentProfile, SupervisorProfile, Notification, Comment, ScheduleItem, MessageItem, StudentProposal } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function getUserByClerkId(clerkUserId: string): Promise<User | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const user = await db.collection("users").findOne({ clerkUserId })
    return user as User | null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const now = new Date()
    const user: User = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    } as User

    const result = await db.collection("users").insertOne(user)
    return { ...user, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function upsertUserByClerkId(clerkUserId: string, data: Partial<User>): Promise<User | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const now = new Date()
    await db.collection("users").updateOne(
      { clerkUserId },
      {
        $set: {
          ...data,
          clerkUserId,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    )
    const user = await db.collection("users").findOne({ clerkUserId })
    return user as User | null
  } catch (error) {
    console.error("Error upserting user:", error)
    return null
  }
}

export async function updateUser(clerkUserId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    await db.collection("users").updateOne(
      { clerkUserId },
      { $set: { ...updates, updatedAt: new Date() } }
    )
    return true
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

export async function createStudentProfile(profileData: Partial<StudentProfile>): Promise<StudentProfile | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const now = new Date()
    const profile: StudentProfile = {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    } as StudentProfile
    
    const result = await db.collection("studentProfiles").insertOne(profile)
    return { ...profile, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating student profile:", error)
    return null
  }
}

export async function createSupervisorProfile(profileData: Partial<SupervisorProfile>): Promise<SupervisorProfile | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const now = new Date()
    const profile: SupervisorProfile = {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    } as SupervisorProfile
    
    const result = await db.collection("supervisorProfiles").insertOne(profile)
    return { ...profile, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating supervisor profile:", error)
    return null
  }
}

export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const profile = await db.collection("studentProfiles").findOne({ userId })
    return profile as StudentProfile | null
  } catch (error) {
    console.error("Error fetching student profile:", error)
    return null
  }
}

export async function getSupervisorProfile(userId: string): Promise<SupervisorProfile | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const profile = await db.collection("supervisorProfiles").findOne({ userId })
    return profile as SupervisorProfile | null
  } catch (error) {
    console.error("Error fetching supervisor profile:", error)
    return null
  }
}

export async function getNotificationsByUserId(userId: string): Promise<Notification[]> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const notifications = await db.collection("notifications")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()
    return notifications as unknown as Notification[]
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function createNotification(notificationData: Partial<Notification>): Promise<Notification | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const now = new Date()
    const notification: Notification = {
      ...notificationData,
      createdAt: now,
      updatedAt: now,
    } as Notification
    
    const result = await db.collection("notifications").insertOne(notification)
    return { ...notification, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    await db.collection("notifications").updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { isRead: true, updatedAt: new Date() } }
    )
    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

export async function getStudentsBySupervisor(supervisorId: string): Promise<StudentProfile[]> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const students = await db.collection("studentProfiles")
      .find({ supervisorId })
      .toArray()
    return students as unknown as StudentProfile[]
  } catch (error) {
    console.error("Error fetching students by supervisor:", error)
    return []
  }
}

export async function getProposalsByStatus(status: string): Promise<StudentProposal[]> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const proposals = await db.collection("proposals")
      .find({ status })
      .sort({ submittedAt: -1 })
      .toArray()
    return proposals as unknown as StudentProposal[]
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return []
  }
}

export async function createProposal(proposalData: Partial<StudentProposal>): Promise<StudentProposal | null> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const now = new Date()
    const proposal: StudentProposal = {
      ...proposalData,
      submittedAt: now,
    } as StudentProposal
    
    const result = await db.collection("proposals").insertOne(proposal)
    return { ...proposal, _id: result.insertedId }
  } catch (error) {
    console.error("Error creating proposal:", error)
    return null
  }
}

export async function updateProposal(proposalId: string, updates: Partial<StudentProposal>): Promise<boolean> {
  try {
    const client = await getMongoClient()
    const db = client.db()
    await db.collection("proposals").updateOne(
      { _id: new ObjectId(proposalId) },
      { $set: { ...updates, reviewedAt: new Date() } }
    )
    return true
  } catch (error) {
    console.error("Error updating proposal:", error)
    return false
  }
}
