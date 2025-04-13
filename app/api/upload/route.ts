import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import mammoth from 'mammoth'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const tempPath = join(tmpdir(), file.name)
  await writeFile(tempPath, buffer)

  try {
    const result = await mammoth.extractRawText({ path: tempPath })
    return NextResponse.json({ text: result.value })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 })
  }
}
