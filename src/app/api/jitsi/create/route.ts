import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const JITSI_HOST = process.env.JITSI_HOST || 'meet.jit.si'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roomName, userName } = await request.json()

    if (!roomName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 })
    }

    const name = userName || session.user?.name || session.user?.email || 'User'
    const room = roomName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    
    const joinUrl = `https://${JITSI_HOST}/${room}?userName=${encodeURIComponent(name)}`

    return NextResponse.json({
      success: true,
      joinUrl,
      roomName: room
    })
  } catch (error: any) {
    console.error('Error creating Jitsi meeting:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create meeting' },
      { status: 500 }
    )
  }
}