import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Message, Conversation } from '@/models/Chat'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function getUserId(session: any): string {
  return session?.user?.id || session?.user?._id || ''
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = getUserId(session)
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return new Response('Conversation ID required', { status: 400 })
    }

    await connectDB()

    const encoder = new TextEncoder()
    let lastMessageId = searchParams.get('lastMessageId') || ''

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        }

        sendEvent('connected', { message: 'SSE connection established' })

        const checkForNewMessages = async () => {
          try {
            const query: any = { conversationId }
            if (lastMessageId) {
              query._id = { $gt: lastMessageId }
            }

            const newMessages = await Message.find(query)
              .populate('sender', 'name email image')
              .sort({ createdAt: 1 })
              .lean() as any[]

            for (const message of newMessages) {
              sendEvent('message', {
                _id: message._id.toString(),
                content: message.content,
                messageType: message.messageType,
                sender: message.sender,
                createdAt: message.createdAt,
                status: message.status || 'delivered'
              })
              lastMessageId = message._id.toString()
            }
          } catch (error) {
            console.error('Error checking for new messages:', error)
          }
        }

        const interval = setInterval(checkForNewMessages, 2000)

        await checkForNewMessages()

        return () => {
          clearInterval(interval)
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('SSE Error:', error)
    return new Response(error.message, { status: 500 })
  }
}
