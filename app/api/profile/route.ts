import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcrypt"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ email: user.email })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { userId, newPassword } = await request.json()

  if (!userId || !newPassword) {
    return NextResponse.json({ error: "User ID and new password are required" }, { status: 400 })
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string)
    const db = client.db()

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "User not found or password not updated" }, { status: 404 })
    }

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}

