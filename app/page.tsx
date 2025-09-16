import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, FileText, Shield } from "lucide-react"
import Link from "next/link";
import styles from "./styles.module.css";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Thesis Management System</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/superuser-login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-6 text-balance">Streamline Your Academic Journey</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            A comprehensive platform for managing thesis submissions, reviews, and approvals. Designed for students,
            supervisors, coordinators, and administrators.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/repository">Browse Research</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-primary mb-12">Built for Everyone</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <GraduationCap className={styles.logo}/>
                <CardTitle>Students</CardTitle>
                <CardDescription>Submit proposals, track progress, and manage thesis documents</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className={styles.logo}/>
                <CardTitle>Supervisors</CardTitle>
                <CardDescription>Review submissions, provide feedback, and guide students</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <FileText className={styles.logo}/>
                <CardTitle>Coordinators</CardTitle>
                <CardDescription>Oversee department workflows and manage approvals</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Thesis Management System. Built for academic excellence.</p>
        </div>
      </footer>
    </div>
  )
}
