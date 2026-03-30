import { NextRequest, NextResponse } from 'next/server'
import { createMeeting } from '@/lib/bigbluebutton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetingName, courseId } = await request.json()

    if (!meetingName) {
      return NextResponse.json({ error: 'Meeting name is required' }, { status: 400 })
    }

    const meetingId = courseId 
      ? `course-${courseId}-${Date.now()}`
      : `session-${session.user?.email}-${Date.now()}`

    const result = await createMeeting(meetingId, meetingName)

    return NextResponse.json({
      success: true,
      meetingId: result.meetingId,
      internalMeetingId: result.internalMeetingId,
      moderatorPassword: result.moderatorPassword,
      attendeePassword: result.attendeePassword,
    })
  } catch (error: any) {
    console.error('Error creating BBB meeting:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create meeting' },
      { status: 500 }
    )
  }
}
