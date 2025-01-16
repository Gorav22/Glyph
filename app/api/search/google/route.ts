import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  const cx = process.env.GOOGLE_CSE_ID

  if (!apiKey || !cx) {
    return NextResponse.json({ error: 'API key or Custom Search Engine ID is missing' }, { status: 500 })
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`

  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (response.status === 403) {
      console.error('Google API authentication error:', data.error?.message || 'Unknown error')
      return NextResponse.json({ error: 'Google API authentication failed. Please check your API key and settings.' }, { status: 403 })
    }
    
    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Google search results:', error)
    return NextResponse.json({ error: 'Failed to fetch search results. Please try again later.' }, { status: 500 })
  }
}

