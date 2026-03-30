import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const onlineUsers = new Map<string, { lastSeen: Date; name: string; image?: string }>()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()
    const userId = session.user.id as string
    const user = await User.findById(userId).select('name image').lean()

    if (status === 'online' && user) {
      onlineUsers.set(userId, {
        lastSeen: new Date(),
        name: user.name || 'Unknown',
        image: user.image
      })
    } else if (status === 'offline') {
      onlineUsers.delete(userId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const currentUserId = await getCurrentUserId()
    
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    
    const online: any[] = []
    const offline: any[] = []
    
    for (const [userId, data] of onlineUsers) {
      if (userId === currentUserId) continue
      
      if (data.lastSeen > fiveMinutesAgo) {
        online.push({ userId, ...data, online: true })
      } else {
        offline.push({ userId, ...data, online: false })
      }
    }

    return NextResponse.json({ online, offline: offline.slice(0, 10) })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function getCurrentUserId(): Promise<string> {
  const session = await getServerSession(authOptions)
  return (session?.user as any)?.id || ''
}