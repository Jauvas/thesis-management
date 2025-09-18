"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Calendar, User, ArrowLeft, Filter, SortAsc, Eye, BookOpen } from "lucide-react"
import Link from "next/link"

// Empty array - would be populated from API in real app
const mockTheses: any[] = []

const schools = [
  "All Schools",
  "School of Computing",
  "School of Engineering",
  "School of Business",
  "School of Medicine",
]
const years = ["All Years", "2024", "2023", "2022", "2021"]
const categories = ["All Categories", "Research", "Applied Research", "Technology Innovation", "Theoretical Research"]

export default function RepositoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("All Schools")
  const [selectedYear, setSelectedYear] = useState("All Years")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("recent")
  const [filteredTheses, setFilteredTheses] = useState(mockTheses)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const filtered = mockTheses.filter((thesis) => {
      const matchesSearch =
        searchQuery === "" ||
        thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thesis.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thesis.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSchool = selectedSchool === "All Schools" || thesis.school === selectedSchool
      const matchesYear = selectedYear === "All Years" || thesis.year.toString() === selectedYear
      const matchesCategory = selectedCategory === "All Categories" || thesis.category === selectedCategory

      return matchesSearch && matchesSchool && matchesYear && matchesCategory
    })

    // Sort results
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case "cited":
        filtered.sort((a, b) => b.citations - a.citations)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredTheses(filtered)
  }, [searchQuery, selectedSchool, selectedYear, selectedCategory, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSchool("All Schools")
    setSelectedYear("All Years")
    setSelectedCategory("All Categories")
    setSortBy("recent")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary">Research Repository</h1>
              <p className="text-sm text-muted-foreground">Explore published academic research</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Research
                </CardTitle>
                <CardDescription>Discover academic theses and research publications</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <div className="flex items-center gap-1 border rounded-md" role="group" aria-label="View mode">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-5 gap-4">
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Downloaded</SelectItem>
                    <SelectItem value="cited">Most Cited</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-primary">
              {filteredTheses.length} Research Publication{filteredTheses.length !== 1 ? "s" : ""} Found
            </h2>
            {(searchQuery || selectedSchool !== "All Schools" || selectedYear !== "All Years") && (
              <p className="text-sm text-muted-foreground mt-1">
                Filtered results • {mockTheses.length} total publications available
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SortAsc className="h-4 w-4" />
            Sorted by:{" "}
            {sortBy === "recent"
              ? "Most Recent"
              : sortBy === "popular"
                ? "Most Downloaded"
                : sortBy === "cited"
                  ? "Most Cited"
                  : "Title A-Z"}
          </div>
        </div>

        {/* Results */}
        <div className={viewMode === "grid" ? "grid lg:grid-cols-2 gap-6" : "space-y-4"}>
          {filteredTheses.map((thesis) => (
            <Card key={thesis.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-balance">
                      <Link href={`/repository/${thesis.id}`} className="hover:text-accent transition-colors">
                        {thesis.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {thesis.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {thesis.year}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {thesis.pages} pages
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{thesis.school}</Badge>
                      <Badge variant="outline">{thesis.department}</Badge>
                      <Badge variant="outline">{thesis.category}</Badge>
                      <Badge className="bg-green-100 text-green-800">Grade: {thesis.grade}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" asChild>
                      <Link href={`/repository/${thesis.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-pretty line-clamp-3">{thesis.abstract}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {thesis.keywords.slice(0, 4).map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {thesis.keywords.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{thesis.keywords.length - 4} more
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{thesis.downloads} downloads</span>
                    <span>{thesis.citations} citations</span>
                  </div>
                  <span>Supervisor: {thesis.supervisor}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTheses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No research found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination would go here in a real app */}
        {filteredTheses.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
