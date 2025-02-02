import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

export async function GET(request: Request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string }
    return NextResponse.json({ userId: decoded.userId })
  } catch (error) {
    console.log(`An unexpected error occurred ${error}`)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

