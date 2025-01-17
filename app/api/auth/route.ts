import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: Request) {
  try {
    await client.connect()
    const db = client.db('browser_auth')
    const users = db.collection('users')

    const { action, email, password } = await request.json()

    if (action === 'signup') {
      const existingUser = await users.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const otp = crypto.randomInt(100000, 999999).toString()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes

      await users.insertOne({ email, password: hashedPassword, otp, otpExpiry, verified: false })

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your account',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      })

      return NextResponse.json({ message: 'User created. Please verify your email.' })
    } else if (action === 'verify') {
      const { otp } = await request.json()
      const user = await users.findOne({ email, otp, otpExpiry: { $gt: new Date() } })

      if (!user) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
      }

      await users.updateOne({ email }, { $set: { verified: true }, $unset: { otp: '', otpExpiry: '' } })

      return NextResponse.json({ message: 'Email verified successfully' })
    } else if (action === 'signin') {
      const user = await users.findOne({ email })

      if (!user || !user.verified) {
        return NextResponse.json({ error: 'Invalid credentials or unverified account' }, { status: 400 })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
      }

      // In a real-world scenario, you'd generate and return a JWT token here
      return NextResponse.json({ message: 'Signed in successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'An error occurred during authentication' }, { status: 500 })
  } finally {
    await client.close()
  }
}

