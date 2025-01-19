import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  try {
    const result = await model.generateContent(query)
    const response = await result.response
    const text = response.text()
    return NextResponse.json({ result: text })
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 })
  }
}

