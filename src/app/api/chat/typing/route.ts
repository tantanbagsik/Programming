import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Conversation } from '@/models/Chat'

function getUserId(session: any): string {
  return session?.user?.id || session?.user?._id || ''
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, isTyping } = await request.json()
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    await connectDB()
    const userId = getUserId(session)

    const conversation = await Conversation.findById(conversationId).lean() as any
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const otherParticipants = conversation.participants?.filter(
      (p: any) => p.toString() !== userId
    ) || []

    return NextResponse.json({ 
      success: true, 
      isTyping,
      otherParticipants 
    })
  } catch (error: any) {
    console.error('Error handling typing status:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
