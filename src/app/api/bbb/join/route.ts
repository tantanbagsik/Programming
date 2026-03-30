import { NextRequest, NextResponse } from 'next/server'
import { getJoinUrl, isMeetingRunning } from '@/lib/bigbluebutton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetingId, role = 'attendee' } = await request.json()

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 })
    }

    const running = await isMeetingRunning(meetingId)
    if (!running) {
      return NextResponse.json({ error: 'Meeting is not currently running' }, { status: 404 })
    }

    const userName = session.user?.name || session.user?.email || 'User'
    const joinUrl = await getJoinUrl(meetingId, userName, role as 'moderator' | 'attendee')

    return NextResponse.json({
      success: true,
      joinUrl
    })
  } catch (error: any) {
    console.error('Error getting BBB join URL:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get join URL' },
      { status: 500 }
    )
  }
}
