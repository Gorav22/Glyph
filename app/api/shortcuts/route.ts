import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ shortcuts: user.shortcuts })
  } catch (error) {
    console.error('Error fetching shortcuts:', error)
    return NextResponse.json({ error: 'Failed to fetch shortcuts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId, shortcut } = await request.json()

  if (!userId || !shortcut) {
    return NextResponse.json({ error: 'User ID and shortcut are required' }, { status: 400 })
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { shortcuts: shortcut } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'User not found or shortcut not added' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Shortcut added successfully' })
  } catch (error) {
    console.error('Error adding shortcut:', error)
    return NextResponse.json({ error: 'Failed to add shortcut' }, { status: 500 })
  }
}

