import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("browser_db")
    const { title, url } = await request.json()
    const result = await db.collection("tabs").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { title, url } }
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to update tab:', error)
    return NextResponse.json({ error: 'Failed to update tab. Please check your database connection.' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("browser_db")
    const result = await db.collection("tabs").deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to delete tab:', error)
    return NextResponse.json({ error: 'Failed to delete tab. Please check your database connection.' }, { status: 500 })
  }
}

