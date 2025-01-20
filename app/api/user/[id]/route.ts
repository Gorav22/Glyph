import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const user = await db.collection("users").findOne({ _id: new ObjectId(params.id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ email: user.email })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { email, newPassword } = await request.json()

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const updateData: { email?: string; password?: string } = {}
    if (email) updateData.email = email
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10)

    const result = await db.collection("users").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
  }
}

