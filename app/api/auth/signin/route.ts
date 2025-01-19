import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }

    // Create JWT token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({ userId: user._id.toString() })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error during signin:', error)
    return NextResponse.json({ error: 'Signin failed' }, { status: 500 })
  }
}

