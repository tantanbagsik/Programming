import { NextRequest, NextResponse } from 'next/server'
import { endMeeting } from '@/lib/bigbluebutton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { meetingId, moderatorPassword } = await request.json()

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 })
    }

    if (!moderatorPassword) {
      return NextResponse.json({ error: 'Moderator password required to end meeting' }, { status: 400 })
    }

    const success = await endMeeting(meetingId, moderatorPassword)

    return NextResponse.json({
      success
    })
  } catch (error: any) {
    console.error('Error ending BBB meeting:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to end meeting' },
      { status: 500 }
    )
  }
}
