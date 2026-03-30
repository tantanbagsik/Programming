import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Conversation from '@/models/Conversation'
import Message from '@/models/Message'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

// GET /api/chat/conversations — list current user's conversations
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const conversations = await Conversation.find({ participants: user.id })
      .populate({ path: 'participants', select: 'name image email role' })
      .sort({ lastMessageAt: -1 })
      .lean()

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv: any) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: user.id },
          read: false,
        })
        return { ...conv, unreadCount }
      })
    )

    return NextResponse.json({ conversations: conversationsWithUnread })
  } catch (error) {
    console.error('[CONVERSATIONS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

// POST /api/chat/conversations — create or get existing conversation
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const { participantId } = await req.json()

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID required' }, { status: 400 })
    }

    if (participantId === user.id) {
      return NextResponse.json({ error: 'Cannot start a conversation with yourself' }, { status: 400 })
    }

    // Check if conversation already exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [user.id, participantId], $size: 2 },
    })
      .populate({ path: 'participants', select: 'name image email role' })
      .lean()

    if (!conversation) {
      const newConv = await Conversation.create({
        participants: [user.id, participantId],
      })
      conversation = await Conversation.findById(newConv._id)
        .populate({ path: 'participants', select: 'name image email role' })
        .lean()
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('[CONVERSATIONS POST]', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
