"use client"

import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

export function DocumentEditor({
  initialContent = "",
  onChange,
}: {
  initialContent?: string
  onChange: (content: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing your document...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}

