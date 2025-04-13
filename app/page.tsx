'use client'

import { useState } from 'react'

export default function Home() {
  const [fileName, setFileName] = useState('')
  const [docText, setDocText] = useState('')


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

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload a .docx file</h1>

      <input type="file" accept=".docx" onChange={handleFileChange} />

      {fileName && <p className="mt-4">📄 Uploaded: {fileName}</p>}

      {docText && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Extracted Text:</h2>
          <pre className="whitespace-pre-wrap">{docText}</pre>
        </div>
      )}
    </main>
  )
}
