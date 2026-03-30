import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Conversation from '@/models/Conversation'
import Message from '@/models/Message'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

// GET /api/chat/conversations/[id]/messages — get messages for a conversation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const { id } = await params
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Verify user is a participant
    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.some((p: any) => p.toString() === user.id)) {
      return NextResponse.json({ error: 'Not authorized to view this conversation' }, { status: 403 })
    }

    const skip = (page - 1) * limit

    const messages = await Message.find({ conversation: id })
      .populate({ path: 'sender', select: 'name image email' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Message.countDocuments({ conversation: id })

    // Mark unread messages from others as read
    await Message.updateMany(
      { conversation: id, sender: { $ne: user.id }, read: false },
      { $set: { read: true } }
    )

    return NextResponse.json({
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[MESSAGES GET]', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/chat/conversations/[id]/messages — send a message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const { id } = await params
    const { content } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Verify user is a participant
    const conversation = await Conversation.findById(id)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.some((p: any) => p.toString() === user.id)) {
      return NextResponse.json({ error: 'Not authorized to send messages in this conversation' }, { status: 403 })
    }

    const message = await Message.create({
      conversation: id,
      sender: user.id,
      content: content.trim(),
    })

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(id, {
      lastMessage: content.trim(),
      lastMessageAt: new Date(),
    })

    const populatedMessage = await Message.findById(message._id)
      .populate({ path: 'sender', select: 'name image email' })
      .lean()

    return NextResponse.json({ message: populatedMessage }, { status: 201 })
  } catch (error) {
    console.error('[MESSAGES POST]', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
