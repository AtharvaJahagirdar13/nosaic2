"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Editor from "@/components/editor"
import { ArrowLeft, Save } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  createdBy: string
  shared: boolean
  starred: boolean
  folder: string
  type: 'note'
}

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load note from localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const doc = savedDocs.find((d) => d.id === params.id)
    
    if (doc) {
      setNote(doc)
      setTitle(doc.title)
      setContent(doc.content || "")
    } else if (params.id === "new") {
      // Create a new note
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: "Untitled Note",
        content: "",
        updatedAt: new Date().toISOString(),
        createdBy: "Current User",
        shared: false,
        starred: false,
        folder: "My Notes",
        type: "note"
      }
      setNote(newNote)
      setTitle(newNote.title)
      setContent(newNote.content)
    }
  }, [params.id])

  const handleSave = () => {
    if (!note) return

    setIsSaving(true)
    const updatedNote = {
      ...note,
      title,
      content,
      updatedAt: new Date().toISOString()
    }

    // Save to localStorage
    const savedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as Note[]
    const index = savedDocs.findIndex((d) => d.id === note.id)
    
    if (index !== -1) {
      savedDocs[index] = updatedNote
    } else {
      savedDocs.unshift(updatedNote)
    }

    localStorage.setItem("documents", JSON.stringify(savedDocs))
    setNote(updatedNote)
    setIsSaving(false)
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading note...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      <Editor
        value={content}
        onChange={setContent}
        readOnly={false}
      />
    </div>
  )
} 