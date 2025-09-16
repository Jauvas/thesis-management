export type StudentStatus = "current" | "ended"

export interface StudentProfile {
  id: string
  userId: string
  name: string
  regNo: string
  course: string
  school: string
  department: string
  supervisorId: string
  researchTopic: string
  researchSummary: string
  status: StudentStatus
}

export interface SupervisorProfile {
  id: string
  userId: string
  name: string
  school: string
  department: string
  specialties: string[]
}

export interface ThesisVersion {
  id: string
  studentId: string
  versionNumber: number
  title: string
  uploadedAt: string
  notes?: string
  fileUrl: string
  isFinal?: boolean
}

export interface ScheduleItem {
  id: string
  supervisorId: string
  studentId: string
  title: string
  description?: string
  startAt: string
  endAt: string
  status: "pending" | "confirmed" | "rescheduled"
}

export interface MessageItem {
  id: string
  fromUserId: string
  toUserId: string
  sentAt: string
  content: string
}

// Demo supervisors
export const supervisors: SupervisorProfile[] = [
  { id: "sup-1", userId: "2", name: "Dr. Michael Chen", school: "School of Computing", department: "Computer Science", specialties: ["machine learning", "healthcare", "data analysis", "ai"] },
  { id: "sup-2", userId: "6", name: "Dr. Sarah Williams", school: "School of Engineering", department: "Software Engineering", specialties: ["performance", "web applications", "optimization", "software engineering"] },
]

// Demo students
export const students: StudentProfile[] = [
  {
    id: "stu-1",
    userId: "1",
    name: "Sarah Johnson",
    regNo: "SC/CS/2021/001",
    course: "BSc. Computer Science",
    school: "School of Computing",
    department: "Computer Science",
    supervisorId: "sup-1",
    researchTopic: "Machine Learning Applications in Healthcare Data Analysis",
    researchSummary: "Explores application of ML algorithms to healthcare datasets for predictive insights.",
    status: "current",
  },
  {
    id: "stu-2",
    userId: "5",
    name: "David Kim",
    regNo: "SC/SE/2020/023",
    course: "BSc. Software Engineering",
    school: "School of Computing",
    department: "Software Engineering",
    supervisorId: "sup-2",
    researchTopic: "Performance Optimization Techniques for Web Applications",
    researchSummary: "Investigates performance bottlenecks and modern optimization patterns in large SPAs.",
    status: "current",
  },
  {
    id: "stu-3",
    userId: "7",
    name: "Emily Carter",
    regNo: "SC/CS/2019/045",
    course: "BSc. Computer Science",
    school: "School of Computing",
    department: "Computer Science",
    supervisorId: "sup-1",
    researchTopic: "Natural Language Processing for Educational Feedback Systems",
    researchSummary: "Designs NLP-driven tools to analyze and summarize student feedback in LMS platforms.",
    status: "ended",
  },
]

// Demo versions
export const thesisVersions: ThesisVersion[] = [
  { id: "ver-1", studentId: "stu-1", versionNumber: 1, title: "Initial Draft", uploadedAt: "2024-01-05T10:00:00Z", notes: "First complete draft", fileUrl: "#" },
  { id: "ver-2", studentId: "stu-1", versionNumber: 2, title: "Revised Methodology", uploadedAt: "2024-02-12T09:30:00Z", notes: "Added evaluation metrics", fileUrl: "#" },
  { id: "ver-3", studentId: "stu-1", versionNumber: 3, title: "Final Submission", uploadedAt: "2024-03-20T14:15:00Z", notes: "Incorporated supervisor feedback", fileUrl: "#", isFinal: true },
  { id: "ver-4", studentId: "stu-2", versionNumber: 1, title: "Architecture Draft", uploadedAt: "2024-02-01T11:00:00Z", fileUrl: "#" },
]

// Demo schedules
export const schedules: ScheduleItem[] = [
  { id: "sch-1", supervisorId: "sup-1", studentId: "stu-1", title: "Methodology Review", description: "Discuss evaluation metrics", startAt: "2024-04-20T10:00:00Z", endAt: "2024-04-20T10:30:00Z", status: "pending" },
  { id: "sch-2", supervisorId: "sup-2", studentId: "stu-2", title: "Performance Benchmarks", startAt: "2024-04-22T13:00:00Z", endAt: "2024-04-22T13:30:00Z", status: "confirmed" },
]

// Demo messages
export const messages: MessageItem[] = []

// Helpers
export function getStudentsBySupervisor(supervisorId: string): StudentProfile[] {
  return students.filter(s => s.supervisorId === supervisorId)
}

export function searchStudentsForSupervisor(supervisorId: string, query: string): StudentProfile[] {
  const q = query.toLowerCase().trim()
  return getStudentsBySupervisor(supervisorId).filter(s =>
    s.name.toLowerCase().includes(q) || s.researchTopic.toLowerCase().includes(q)
  )
}

export function getStudentById(studentId: string): StudentProfile | undefined {
  return students.find(s => s.id === studentId)
}

export function getThesisVersions(studentId: string): ThesisVersion[] {
  return thesisVersions.filter(v => v.studentId === studentId).sort((a, b) => a.versionNumber - b.versionNumber)
}

export function addSchedule(item: Omit<ScheduleItem, "id" | "status"> & { status?: ScheduleItem["status"] }): ScheduleItem {
  const newItem: ScheduleItem = { id: `sch-${schedules.length + 1}`, status: item.status ?? "pending", ...item }
  schedules.push(newItem)
  return newItem
}

export function reschedule(id: string, startAt: string, endAt: string): ScheduleItem | undefined {
  const s = schedules.find(x => x.id === id)
  if (!s) return undefined
  s.startAt = startAt
  s.endAt = endAt
  s.status = "rescheduled"
  return s
}

export function sendMessage(fromUserId: string, toUserId: string, content: string): MessageItem {
  const msg: MessageItem = { id: `msg-${messages.length + 1}`, fromUserId, toUserId, content, sentAt: new Date().toISOString() }
  messages.push(msg)
  return msg
}


// Allocation logic: proposals and coordinator-driven supervisor assignment
export interface StudentProposal {
  id: string
  studentId: string
  topic: string
  summary?: string
  submittedAt: string
  assignedSupervisorId?: string
}

export const proposals: StudentProposal[] = []

export function findSupervisorByUserId(userId: string): SupervisorProfile | undefined {
  return supervisors.find(s => s.userId === userId)
}

export function getSupervisorById(supervisorId: string | undefined): SupervisorProfile | undefined {
  if (!supervisorId) return undefined
  return supervisors.find(s => s.id === supervisorId)
}

export function getSupervisorNameById(supervisorId: string | undefined): string | undefined {
  return getSupervisorById(supervisorId)?.name
}

export function requestProposal(studentId: string, topic: string, summary?: string): StudentProposal {
  const prop: StudentProposal = {
    id: `prop-${proposals.length + 1}`,
    studentId,
    topic,
    summary,
    submittedAt: new Date().toISOString(),
  }
  proposals.push(prop)
  return prop
}

export function autoAllocateSupervisorByTopic(studentId: string, topic: string): string | undefined {
  const lower = topic.toLowerCase()
  let best: { sup: SupervisorProfile; score: number } | undefined
  for (const sup of supervisors) {
    const score = sup.specialties.reduce((acc, spec) => acc + (lower.includes(spec) ? 1 : 0), 0)
    if (score > 0 && (!best || score > best.score)) best = { sup, score }
  }
  if (best) {
    coordinatorAssignSupervisor("coord-1", studentId, best.sup.id)
    const p = proposals.find(p => p.studentId === studentId && !p.assignedSupervisorId)
    if (p) p.assignedSupervisorId = best.sup.id
    return best.sup.id
  }
  return undefined
}

export function coordinatorAssignSupervisor(coordinatorId: string, studentId: string, supervisorId: string): void {
  const student = students.find(s => s.id === studentId)
  if (!student) return
  student.supervisorId = supervisorId
}


