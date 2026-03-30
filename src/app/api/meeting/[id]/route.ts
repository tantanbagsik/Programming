import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Meeting from '@/models/Meeting'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetingId, invitee, action } = await request.json()

    if (!meetingId || !invitee) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()
    const meeting = await Meeting.findById(meetingId)

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    if (meeting.hostEmail !== session.user.email) {
      return NextResponse.json({ error: 'Only host can invite' }, { status: 403 })
    }

    if (action === 'add') {
      if (!meeting.invitees.includes(invitee)) {
        meeting.invitees.push(invitee)
        await meeting.save()
      }
    } else if (action === 'remove') {
      meeting.invitees = meeting.invitees.filter((e: string) => e !== invitee)
      await meeting.save()
    }

    return NextResponse.json({ success: true, meeting })
  } catch (error: any) {
    console.error('Error updating meeting:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const meetingId = searchParams.get('id')

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID required' }, { status: 400 })
    }

    await connectDB()
    const meeting = await Meeting.findById(meetingId)

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    if (meeting.hostEmail !== session.user.email) {
      return NextResponse.json({ error: 'Only host can delete' }, { status: 403 })
    }

    await Meeting.findByIdAndDelete(meetingId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting meeting:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}