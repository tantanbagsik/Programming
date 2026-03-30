import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Meeting from '@/models/Meeting'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, roomId, joinUrl, invitees } = await request.json()

    if (!name || !roomId || !joinUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const meeting = await Meeting.create({
      name,
      hostEmail: session.user.email,
      hostName: session.user.name || 'User',
      invitees: invitees || [],
      joinUrl,
      roomId,
    })

    return NextResponse.json({ success: true, meeting })
  } catch (error: any) {
    console.error('Error creating meeting:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const userEmail = session.user.email

    const meetings = await Meeting.find({
      $or: [
        { hostEmail: userEmail },
        { invitees: userEmail }
      ]
    }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ meetings })
  } catch (error: any) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}