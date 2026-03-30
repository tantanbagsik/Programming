'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/Navbar'
import { ConversationList } from '@/components/chat/ConversationList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { NewChatModal } from '@/components/chat/NewChatModal'
import { MessageCircle } from 'lucide-react'

interface Participant {
  _id: string
  name: string
  email: string
  image?: string
  role: string
}

interface Conversation {
  _id: string
  participants: Participant[]
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showNewChat, setShowNewChat] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const user = session?.user as any

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchConversations()
    }
  }, [session, fetchConversations])

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!session) return
    const interval = setInterval(fetchConversations, 5000)
    return () => clearInterval(interval)
  }, [session, fetchConversations])

  const handleSelectConversation = (id: string) => {
    setActiveId(id)
    setMobileShowChat(true)
  }

  const handleNewChat = () => {
    setShowNewChat(true)
  }

  const handleConversationCreated = (conversationId: string) => {
    setShowNewChat(false)
    fetchConversations()
    setActiveId(conversationId)
    setMobileShowChat(true)
  }

  const handleBack = () => {
    setMobileShowChat(false)
  }

  const activeConversation = conversations.find((c) => c._id === activeId)

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-dark flex items-center justify-center pt-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    )
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-dark flex items-center justify-center pt-20">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="font-sora font-bold text-xl mb-2">Sign in to access messages</h2>
            <p className="text-gray-500 text-sm mb-4">You need to be logged in to use the chat feature.</p>
            <a href="/auth/login?callbackUrl=/chat" className="btn-primary inline-block">
              Sign In
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-16">
        <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
          <div className="h-full flex">
            {/* Sidebar - hidden on mobile when chat is open */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-border flex-shrink-0
                ${mobileShowChat ? 'hidden md:flex md:flex-col' : 'flex flex-col'}`}
            >
              <ConversationList
                conversations={conversations}
                activeId={activeId}
                currentUserId={user.id}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                loading={loading}
              />
            </div>

            {/* Chat area - hidden on mobile when no chat selected */}
            <div
              className={`flex-1 flex flex-col
                ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}
            >
              {activeConversation ? (
                <ChatWindow
                  conversationId={activeConversation._id}
                  participants={activeConversation.participants}
                  currentUserId={user.id}
                  onBack={handleBack}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="font-sora font-semibold text-lg text-gray-400 mb-1">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose a conversation or start a new one
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onConversationCreated={handleConversationCreated}
        />
      )}
    </>
  )
}
