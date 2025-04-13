'use client'

import { useState } from 'react'

export default function Home() {
  const [fileName, setFileName] = useState('')
  const [docText, setDocText] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [editedText, setEditedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setDocText(data.text)
  }

  const handleEdit = async () => {
    if (!docText || !aiPrompt) return
  
    setLoading(true)
  
    const res = await fetch('/api/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalText: docText,
        instruction: aiPrompt,
      }),
    })
  
    if (!res.ok) {
      const errorText = await res.text()
      console.error('AI Edit Error:', errorText)
      alert('Something went wrong with the AI edit.')
      setLoading(false)
      return
    }
  
    const data = await res.json()
    setEditedText(data.result)
    setLoading(false)
  }
  
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload a .docx file</h1>

      <input type="file" accept=".docx" onChange={handleFileChange} />

      {fileName && <p className="mt-4">📄 Uploaded: {fileName}</p>}

      {docText && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Extracted Text:</h2>
          <pre className="whitespace-pre-wrap">{docText}</pre>

          <div className="mt-6">
            <label className="block font-medium mb-1">Edit with AI:</label>
            <input
              type="text"
              placeholder="e.g. Make this more formal"
              className="w-full p-2 border rounded mb-2"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleEdit}
              disabled={loading}
            >
              {loading ? 'Editing...' : 'Apply Edit'}
            </button>
          </div>

          {editedText && (
            <div className="mt-6 p-4 bg-white border rounded">
              <h2 className="font-semibold mb-2">🪄 Edited Text:</h2>
              <pre className="whitespace-pre-wrap">{editedText}</pre>
              <a
  href={`data:text/plain;charset=utf-8,${encodeURIComponent(editedText)}`}
  download="edited-document.txt"
  className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
>
  ⬇️ Download Edited Text
</a>

            </div>
          )}
        </div>
      )}
    </main>
  )
}
