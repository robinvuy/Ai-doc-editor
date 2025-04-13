import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL, // this now points to Groq
  })

export async function POST(req: NextRequest) {
  try {
    const { originalText, instruction } = await req.json()

    if (!originalText || !instruction) {
      return NextResponse.json({ error: 'Missing input' }, { status: 400 })
    }

    const prompt = `Here is a document:\n\n"${originalText}"\n\nFollow this instruction to rewrite it:\n${instruction}`

    const chatCompletion = await openai.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful document editing assistant.' },
          { role: 'user', content: prompt },
        ],
      })
      

    const result = chatCompletion.choices[0].message?.content || ''
    return NextResponse.json({ result })
  } catch (err) {
    console.error('🔥 API ERROR:', err)
    return NextResponse.json({ error: 'AI edit failed' }, { status: 500 })
  }
}
