"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GraduationCap, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    name?: string
    username?: string
    email?: string
    role: "student" | "supervisor" | "coordinator" | "superuser"
    school?: string
    department?: string
  }
  title: string
}

const roleColors = {
  student: "bg-blue-100 text-blue-800",
  supervisor: "bg-green-100 text-green-800",
  coordinator: "bg-purple-100 text-purple-800",
  superuser: "bg-red-100 text-red-800",
}

const roleLabels = {
  student: "Student",
  supervisor: "Supervisor",
  coordinator: "Coordinator",
  superuser: "Administrator",
}

export function DashboardLayout({ children, user, title }: DashboardLayoutProps) {
  const { signOut } = useClerk()
  const router = useRouter()
  const displayName = (user.name && user.name.trim())
    || (user.username && user.username.trim())
    || (user.email ? user.email.split("@")[0] : "User")

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleSignOut = async () => {
    try {
      if (user.role === "superuser") {
        await fetch("/api/admin/logout", { method: "POST" })
        router.push("/superuser-login")
      } else {
        await signOut()
        router.push("/sign-in")
      }
    } catch (_err) {
      router.push(user.role === "superuser" ? "/superuser-login" : "/sign-in")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">Thesis Management</span>
              </Link>
              <div className="hidden md:block">
                <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden md:inline-flex">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <span className="text-xs font-medium">{initials}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{displayName}</div>
                    <div className="text-xs text-muted-foreground">{user.email || user.username}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium">{displayName}</div>
                  <div className="text-xs text-muted-foreground">{user.email || user.username}</div>
                  {user.school && (
                    <div className="text-xs text-muted-foreground">
                      {user.school} • {user.department}
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={user.role === "superuser" ? "/admin/settings" : "/admin/settings"}>
                    <div className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
          <p className="text-muted-foreground">Welcome back, {displayName.split(" ")[0]}!</p>
        </div>
        {children}
      </main>
    </div>
  )
}
