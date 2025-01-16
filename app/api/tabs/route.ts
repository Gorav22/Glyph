import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("browser_db")
    const tabs = await db.collection("tabs").find({}).toArray()
    return NextResponse.json(tabs)
  } catch (error) {
    console.error('Failed to fetch tabs:', error)
    return NextResponse.json({ error: 'Failed to fetch tabs. Please check your database connection.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("browser_db")
    const { title, url } = await request.json()
    const result = await db.collection("tabs").insertOne({ title, url })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to create tab:', error)
    return NextResponse.json({ error: 'Failed to create tab. Please check your database connection.' }, { status: 500 })
  }
}

