import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Conversation, Message } from '@/models/Chat'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function getUserId(session: any): string {
  return session?.user?.id || session?.user?._id || ''
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    await connectDB()

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email image')
      .sort({ createdAt: 1 })
      .lean()

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, content } = await request.json()

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Conversation ID and content required' }, { status: 400 })
    }

    await connectDB()
    const senderId = getUserId(session)

    const message = await Message.create({
      conversationId,
      sender: senderId,
      content,
      messageType: 'text',
      readBy: [senderId]
    })

    await message.populate('sender', 'name email image')

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
      lastSender: senderId
    })

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}