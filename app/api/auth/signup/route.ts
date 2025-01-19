import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { email, password, otp } = await request.json()

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    // Verify OTP
    const storedOtp = await db.collection('otps').findOne({ 
      email, 
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } // OTP valid for 10 minutes
    })

    if (!storedOtp || storedOtp.otp !== otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      shortcuts: []
    })

    // Delete used OTP
    await db.collection('otps').deleteOne({ email })

    return NextResponse.json({ userId: result.insertedId.toString() })
  } catch (error) {
    console.error('Error during signup:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}

