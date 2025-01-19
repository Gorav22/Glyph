import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { MongoClient } from 'mongodb'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: Request) {
  const { email } = await request.json()

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    // Store OTP in MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()
    await db.collection('otps').insertOne({ email, otp, createdAt: new Date() })

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your OTP for Arc-inspired Browser',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    })

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

