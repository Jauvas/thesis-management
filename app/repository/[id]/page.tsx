import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  ArrowLeft,
  User,
  Calendar,
  BookOpen,
  Award,
  Eye,
  Share2,
  Bookmark,
  Quote,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would be fetched based on the ID
const mockThesis = {
  id: 1,
  title: "Machine Learning Applications in Healthcare Data Analysis",
  author: "Sarah Johnson",
  school: "School of Computing",
  department: "Computer Science",
  year: 2024,
  abstract:
    "This thesis explores the application of machine learning algorithms in analyzing healthcare data to improve patient outcomes and diagnostic accuracy. The research focuses on developing predictive models for early disease detection and treatment optimization using large-scale medical datasets. The study demonstrates significant improvements in diagnostic accuracy compared to traditional methods, with potential applications in personalized medicine and population health management.",
  keywords: ["Machine Learning", "Healthcare", "Data Analysis", "Predictive Modeling", "Medical Informatics"],
  supervisor: "Dr. Michael Chen",
  pages: 156,
  citations: 23,
  downloads: 342,
  publishedAt: "2024-03-15",
  grade: "A+",
  category: "Research",
  fileUrl: "#",
  methodology:
    "This research employed a mixed-methods approach combining quantitative analysis of large healthcare datasets with qualitative evaluation of clinical outcomes. The study utilized deep learning architectures, specifically convolutional neural networks and recurrent neural networks, to analyze medical imaging data and electronic health records. Data preprocessing included normalization, feature extraction, and handling of missing values using advanced imputation techniques.",
  objectives: [
    "Develop machine learning models for early disease detection using healthcare data",
    "Evaluate the effectiveness of different algorithms in medical diagnosis",
    "Create a framework for integrating ML models into clinical workflows",
    "Assess the impact on patient outcomes and healthcare efficiency",
  ],
  findings: [
    "Achieved 94.2% accuracy in early diabetes detection using ensemble methods",
    "Reduced false positive rates by 23% compared to traditional screening methods",
    "Demonstrated cost savings of approximately $2.3M annually in a mid-size hospital system",
    "Identified key biomarkers that improve prediction accuracy by 15%",
  ],
  relatedTheses: [
    {
      id: 2,
      title: "Deep Learning in Medical Image Analysis",
      author: "John Smith",
      year: 2023,
    },
    {
      id: 3,
      title: "Predictive Analytics in Population Health",
      author: "Maria Garcia",
      year: 2023,
    },
  ],
}

export default function ThesisDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/repository"
              className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Repository</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <CardTitle className="text-2xl mb-3 text-balance">{mockThesis.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{mockThesis.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{mockThesis.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{mockThesis.pages} pages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>Grade: {mockThesis.grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{mockThesis.school}</Badge>
                    <Badge variant="outline">{mockThesis.department}</Badge>
                    <Badge variant="outline">{mockThesis.category}</Badge>
                    <Badge className="bg-green-100 text-green-800">Published</Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{mockThesis.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Quote className="h-4 w-4" />
                      <span>{mockThesis.citations} citations</span>
                    </div>
                    <span>Published: {mockThesis.publishedAt}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="abstract" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="abstract">Abstract</TabsTrigger>
                <TabsTrigger value="methodology">Methodology</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
                <TabsTrigger value="citation">Citation</TabsTrigger>
              </TabsList>

              <TabsContent value="abstract" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Abstract</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{mockThesis.abstract}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Research Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mockThesis.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground text-pretty">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="methodology" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Research Methodology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{mockThesis.methodology}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="findings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockThesis.findings.map((finding, index) => (
                        <div key={index} className="border-l-4 border-accent pl-4">
                          <p className="text-muted-foreground text-pretty">{finding}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="citation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Citation Information</CardTitle>
                    <CardDescription>Use these formats to cite this thesis in your work</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">APA Format</h4>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono">
                        {mockThesis.author} ({mockThesis.year}). <em>{mockThesis.title}</em>. [Master's thesis,{" "}
                        {mockThesis.school}]. University Repository.
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">MLA Format</h4>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono">
                        {mockThesis.author}. "{mockThesis.title}." Master's thesis, {mockThesis.school},{" "}
                        {mockThesis.year}.
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Chicago Format</h4>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono">
                        {mockThesis.author}. "{mockThesis.title}." Master's thesis, {mockThesis.school},{" "}
                        {mockThesis.year}.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockThesis.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="cursor-pointer hover:bg-accent">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supervisor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supervision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Supervisor:</span>
                    <p className="font-medium">{mockThesis.supervisor}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <p className="font-medium">{mockThesis.department}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">School:</span>
                    <p className="font-medium">{mockThesis.school}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{mockThesis.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Citations:</span>
                    <span className="font-medium">{mockThesis.citations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="font-medium">{mockThesis.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grade:</span>
                    <span className="font-medium">{mockThesis.grade}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Theses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Research</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockThesis.relatedTheses.map((related) => (
                    <div key={related.id} className="border rounded-lg p-3">
                      <Link
                        href={`/repository/${related.id}`}
                        className="font-medium text-sm hover:text-accent transition-colors text-balance"
                      >
                        {related.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {related.author} • {related.year}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View More Related
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
