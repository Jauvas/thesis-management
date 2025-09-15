"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface ThesisUploadProps {
  onUpload: (data: ThesisUploadData) => void
  onCancel: () => void
  currentVersion?: number
}

export interface ThesisUploadData {
  file: File
  version: number
  notes: string
  chapterTitle?: string
}

export function ThesisUpload({ onUpload, onCancel, currentVersion = 0 }: ThesisUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [chapterTitle, setChapterTitle] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx"]
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf("."))

      if (!allowedTypes.includes(fileExtension)) {
        alert("Please upload a PDF, DOC, or DOCX file")
        return
      }

      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB")
        return
      }

      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate upload completion
    setTimeout(() => {
      onUpload({
        file,
        version: currentVersion + 1,
        notes,
        chapterTitle: chapterTitle || undefined,
      })
      setIsUploading(false)
      setUploadProgress(0)
    }, 2500)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Thesis Document</CardTitle>
        <CardDescription>Upload a new version of your thesis for review</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Document File *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {!file ? (
                <div>
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your thesis document here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX (max 50MB)</p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="mt-4"
                    required
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Version Info */}
          {file && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Version {currentVersion + 1}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This will be uploaded as version {currentVersion + 1} of your thesis document.
              </p>
            </div>
          )}

          {/* Chapter Title (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="chapterTitle">Chapter/Section Title (Optional)</Label>
            <Input
              id="chapterTitle"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="e.g., Chapter 3: Methodology"
            />
          </div>

          {/* Upload Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Version Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the changes or additions in this version..."
              rows={4}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Important Notes:</p>
                <ul className="text-yellow-700 space-y-1 text-xs">
                  <li>• Ensure your document is properly formatted and proofread</li>
                  <li>• Include page numbers and proper citations</li>
                  <li>• Your supervisor will be notified of this upload</li>
                  <li>• Previous versions will remain accessible for reference</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={!file || isUploading} className="flex-1">
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUploading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
