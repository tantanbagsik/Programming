import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Conversation, Message } from '@/models/Chat'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function getUserId(session: any): string {
  return session?.user?.id || session?.user?._id || ''
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const userId = getUserId(session)

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email image')
      .populate('lastSender', 'name email image')
      .sort({ lastMessageAt: -1 })
      .lean()

    const formatted = conversations.map((conv: any) => {
      const other = conv.participants?.find((p: any) => p?._id?.toString() !== userId)
      const unread = conv.unreadCount?.get(userId) || 0
      
      return {
        _id: conv._id,
        participant: other,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: unread,
      }
    })

    return NextResponse.json({ conversations: formatted })
  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { participantId } = await request.json()
    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID required' }, { status: 400 })
    }

    await connectDB()
    const userId = getUserId(session)

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    }).populate('participants', 'name email image')

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, participantId]
      })
      conversation = await Conversation.findById(conversation._id).populate('participants', 'name email image')
    }

    const other = conversation.participants?.find((p: any) => p?._id?.toString() !== userId)

    return NextResponse.json({ 
      conversation: {
        _id: conversation._id,
        participant: other,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCount: 0,
      }
    })
  } catch (error: any) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}