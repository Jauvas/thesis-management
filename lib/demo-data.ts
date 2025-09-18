export interface DemoUser {
  id: string
  username: string
  email: string
  password: string
  role: "student" | "supervisor" | "coordinator" | "superuser"
  name: string
  school?: string
  department?: string
}

export interface Notification {
  id: string
  userId: string
  type: "comment" | "approval" | "rejection" | "status_change"
  title: string
  message: string
  fromUserId?: string
  fromUserName?: string
  thesisId?: string
  commentId?: string
  isRead: boolean
  isResolved: boolean
  createdAt: string
  resolvedAt?: string
}

export interface Comment {
  id: string
  thesisId: string
  supervisorId: string
  supervisorName: string
  studentId: string
  content: string
  isResolved: boolean
  isApproved: boolean
  createdAt: string
  resolvedAt?: string
  approvedAt?: string
}

// Demo users with different roles
export const demoUsers: DemoUser[] = [
  {
    id: "1",
    username: "sarah",
    email: "sarah.johnson@university.edu",
    password: "student123",
    role: "student",
    name: "Sarah Johnson",
    school: "School of Computing",
    department: "Computer Science"
  },
  {
    id: "2",
    username: "penta",
    email: "m.chen@university.edu",
    password: "supervisor123",
    role: "supervisor",
    name: "Dr. Michael Chen",
    school: "School of Computing",
    department: "Computer Science"
  },
  {
    id: "3",
    username: "caleb",
    email: "l.anderson@university.edu",
    password: "coordinator123",
    role: "coordinator",
    name: "Prof. Lisa Anderson",
    school: "School of Computing",
    department: "Computer Science"
  },
  {
    id: "4",
    username: "admin",
    email: "admin@thesis.com",
    password: "admin123",
    role: "superuser",
    name: "System Administrator"
  },
  {
    id: "5",
    username: "ruth",
    email: "david.kim@university.edu",
    password: "student123",
    role: "student",
    name: "David Kim",
    school: "School of Computing",
    department: "Computer Science"
  },
  {
    id: "6",
    username: "jay",
    email: "s.williams@university.edu",
    password: "supervisor123",
    role: "supervisor",
    name: "Dr. Sarah Williams",
    school: "School of Engineering",
    department: "Software Engineering"
  }
]

// Demo notifications
export const demoNotifications: Notification[] = [
  {
    id: "1",
    userId: "1", // Sarah Johnson (student)
    type: "comment",
    title: "Supervisor commented on your thesis",
    message: "Please clarify the evaluation metrics in your methodology section. The current approach needs more detail on how you will measure success.",
    fromUserId: "2",
    fromUserName: "Dr. Michael Chen",
    thesisId: "1",
    commentId: "1",
    isRead: false,
    isResolved: false,
    createdAt: "2024-03-12T10:15:00Z"
  },
  {
    id: "2",
    userId: "1",
    type: "approval",
    title: "Proposal approved",
    message: "Your proposal has been approved. You can proceed with your thesis research.",
    fromUserId: "2",
    fromUserName: "Dr. Michael Chen",
    thesisId: "1",
    isRead: true,
    isResolved: true,
    createdAt: "2024-03-11T09:00:00Z",
    resolvedAt: "2024-03-11T09:00:00Z"
  },
  {
    id: "3",
    userId: "5", // David Kim (student)
    type: "comment",
    title: "Supervisor feedback on Chapter 2",
    message: "The literature review needs more recent sources. Please add at least 5 papers from 2023-2024.",
    fromUserId: "6",
    fromUserName: "Dr. Sarah Williams",
    thesisId: "2",
    commentId: "2",
    isRead: false,
    isResolved: false,
    createdAt: "2024-03-13T14:30:00Z"
  }
]

// Demo comments
export const demoComments: Comment[] = [
  {
    id: "1",
    thesisId: "1",
    supervisorId: "2",
    supervisorName: "Dr. Michael Chen",
    studentId: "1",
    content: "Please clarify the evaluation metrics in your methodology section. The current approach needs more detail on how you will measure success.",
    isResolved: false,
    isApproved: false,
    createdAt: "2024-03-12T10:15:00Z"
  },
  {
    id: "2",
    thesisId: "2",
    supervisorId: "6",
    supervisorName: "Dr. Sarah Williams",
    studentId: "5",
    content: "The literature review needs more recent sources. Please add at least 5 papers from 2023-2024.",
    isResolved: false,
    isApproved: false,
    createdAt: "2024-03-13T14:30:00Z"
  }
]

// Authentication functions
export function authenticateUser(username: string, password: string): DemoUser | null {
  const user = demoUsers.find(u => u.username === username && u.password === password)
  return user || null
}

export function getUserById(id: string): DemoUser | null {
  return demoUsers.find(u => u.id === id) || null
}

export function getNotificationsByUserId(userId: string): Notification[] {
  return demoNotifications.filter(n => n.userId === userId)
}

export function getCommentsByThesisId(thesisId: string): Comment[] {
  return demoComments.filter(c => c.thesisId === thesisId)
}

export function markNotificationAsRead(notificationId: string): void {
  const notification = demoNotifications.find(n => n.id === notificationId)
  if (notification) {
    notification.isRead = true
  }
}

export function markCommentAsResolved(commentId: string): void {
  const comment = demoComments.find(c => c.id === commentId)
  if (comment) {
    comment.isResolved = true
    comment.resolvedAt = new Date().toISOString()
  }
  
  // Also mark related notification as resolved
  const notification = demoNotifications.find(n => n.commentId === commentId)
  if (notification) {
    notification.isResolved = true
    notification.resolvedAt = new Date().toISOString()
  }
}

export function approveComment(commentId: string): void {
  const comment = demoComments.find(c => c.id === commentId)
  if (comment) {
    comment.isApproved = true
    comment.approvedAt = new Date().toISOString()
  }
}

// Create a supervisor comment for a student and notify the student
export function addSupervisorComment(params: {
  studentUserId: string
  supervisorUserId: string
  thesisId: string
  content: string
}): { commentId: string; notificationId: string } {
  const supervisor = getUserById(params.supervisorUserId)
  const student = getUserById(params.studentUserId)
  if (!supervisor || !student) {
    throw new Error("Invalid user IDs for comment creation")
  }

  const newCommentId = String(demoComments.length + 1)
  demoComments.push({
    id: newCommentId,
    thesisId: params.thesisId,
    supervisorId: supervisor.id,
    supervisorName: supervisor.name,
    studentId: student.id,
    content: params.content,
    isResolved: false,
    isApproved: false,
    createdAt: new Date().toISOString(),
  })

  const newNotificationId = String(demoNotifications.length + 1)
  demoNotifications.push({
    id: newNotificationId,
    userId: student.id,
    type: "comment",
    title: "New supervisor comment",
    message: params.content,
    fromUserId: supervisor.id,
    fromUserName: supervisor.name,
    thesisId: params.thesisId,
    commentId: newCommentId,
    isRead: false,
    isResolved: false,
    createdAt: new Date().toISOString(),
  })

  return { commentId: newCommentId, notificationId: newNotificationId }
}
