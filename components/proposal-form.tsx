"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface ProposalFormProps {
  onSubmit: (data: ProposalFormData) => void
  onCancel: () => void
  initialData?: Partial<ProposalFormData>
}

export interface ProposalFormData {
  title: string
  abstract: string
  keywords: string[]
  supervisorId?: string
  methodology: string
  objectives: string[]
  timeline: string
}

export function ProposalForm({ onSubmit, onCancel, initialData }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalFormData>({
    title: initialData?.title || "",
    abstract: initialData?.abstract || "",
    keywords: initialData?.keywords || [],
    supervisorId: initialData?.supervisorId || "",
    methodology: initialData?.methodology || "",
    objectives: initialData?.objectives || [""],
    timeline: initialData?.timeline || "",
  })

  const [newKeyword, setNewKeyword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword.trim()],
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    })
  }

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, ""],
    })
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData({
      ...formData,
      objectives: newObjectives,
    })
  }

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    })
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Thesis Proposal</CardTitle>
        <CardDescription>Submit your thesis proposal for review and approval</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Thesis Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your thesis title"
              required
            />
          </div>

          {/* Supervisor Selection */}
          <div className="space-y-2">
            <Label htmlFor="supervisor">Preferred Supervisor</Label>
            <Select
              value={formData.supervisorId}
              onValueChange={(value) => setFormData({ ...formData, supervisorId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supervisor (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Dr. Michael Chen - Machine Learning</SelectItem>
                <SelectItem value="2">Dr. Sarah Williams - Software Engineering</SelectItem>
                <SelectItem value="3">Prof. David Kim - Cybersecurity</SelectItem>
                <SelectItem value="4">Dr. Lisa Anderson - Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              placeholder="Provide a detailed abstract of your proposed research (300-500 words)"
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.abstract.length} characters</p>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add a keyword"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <button type="button" onClick={() => removeKeyword(keyword)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="space-y-2">
            <Label>Research Objectives *</Label>
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  placeholder={`Objective ${index + 1}`}
                  required
                />
                {formData.objectives.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeObjective(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addObjective} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          </div>

          {/* Methodology */}
          <div className="space-y-2">
            <Label htmlFor="methodology">Methodology *</Label>
            <Textarea
              id="methodology"
              value={formData.methodology}
              onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
              placeholder="Describe your research methodology and approach"
              rows={4}
              required
            />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline">Expected Timeline *</Label>
            <Textarea
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              placeholder="Provide an estimated timeline for your research (e.g., 12-18 months)"
              rows={3}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Submit Proposal
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
