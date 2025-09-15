export type MockUser = {
  id: string
  name: string
  email: string
  role: "student" | "supervisor" | "coordinator" | "superuser"
  school?: string
  department?: string
}

export type MockThesis = {
  id: number
  title: string
  author: string
  school: string
  department: string
  year: number
  abstract: string
  keywords: string[]
  supervisor: string
  pages: number
  citations: number
  downloads: number
  publishedAt: string
  grade: string
  category: string
}

export const mockUsers: MockUser[] = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "student",
    school: "School of Computing",
    department: "Computer Science",
  },
  {
    id: "u2",
    name: "Dr. Michael Chen",
    email: "m.chen@university.edu",
    role: "supervisor",
    school: "School of Computing",
    department: "Computer Science",
  },
]

export const mockTheses: MockThesis[] = [
  {
    id: 1,
    title: "Machine Learning Applications in Healthcare Data Analysis",
    author: "Sarah Johnson",
    school: "School of Computing",
    department: "Computer Science",
    year: 2024,
    abstract:
      "This thesis explores the application of machine learning algorithms in analyzing healthcare data to improve patient outcomes and diagnostic accuracy.",
    keywords: ["Machine Learning", "Healthcare", "Data Analysis", "Predictive Modeling"],
    supervisor: "Dr. Michael Chen",
    pages: 156,
    citations: 23,
    downloads: 342,
    publishedAt: "2024-03-15",
    grade: "A+",
    category: "Research",
  },
]

export const mockSchools = [
  "School of Computing",
  "School of Engineering",
  "School of Business",
  "School of Medicine",
]

export const mockDepartments = [
  "Computer Science",
  "Information Systems",
  "Software Engineering",
  "Data Science",
]

export async function simulateNetworkDelay(ms: number = 500): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}


