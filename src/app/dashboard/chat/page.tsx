'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Send, Loader2, User, Circle } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserType {
  _id: string
  name: string
  email: string
  image?: string
}

interface Message {
  _id: string
  content: string
  createdAt: string
  sender: UserType
}

interface Conversation {
  _id: string
  participant: UserType
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [allUsers, setAllUsers] = useState<UserType[]>([])
  const [showNewChat, setShowNewChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = (session?.user as any)?.id
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadConversations()
      loadAllUsers()
      loadOnlineUsers()
      updatePresence('online')
      const interval = setInterval(loadConversations, 5000)
      const presenceInterval = setInterval(loadOnlineUsers, 30000)
      return () => {
        clearInterval(interval)
        clearInterval(presenceInterval)
        updatePresence('offline')
      }
    }
  }, [status])

  const updatePresence = async (status: string) => {
    try {
      await fetch('/api/user/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
    } catch (error) {}
  }

  const loadOnlineUsers = async () => {
    try {
      const res = await fetch('/api/user/presence')
      const data = await res.json()
      if (res.ok) setOnlineUsers(data.online || [])
    } catch (error) {}
  }

  useEffect(() => {
    if (selectedConversation) {
      loadMessages()
      markAsRead()
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/chat/conversations')
      const data = await res.json()
      if (res.ok) setConversations(data.conversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllUsers = async () => {
    try {
      const res = await fetch('/api/user/all')
      const data = await res.json()
      if (res.ok) setAllUsers(data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadMessages = async () => {
    if (!selectedConversation) return
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${selectedConversation._id}`)
      const data = await res.json()
      if (res.ok) setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const startConversation = async (userId: string) => {
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: userId })
      })
      const data = await res.json()
      if (res.ok) {
        setSelectedConversation(data.conversation)
        setShowNewChat(false)
        loadConversations()
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    setSending(true)
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversation._id, content: newMessage })
      })
      const data = await res.json()
      if (res.ok) {
        setMessages([...messages, data.message])
        setNewMessage('')
        loadConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const markAsRead = async () => {
    if (!selectedConversation || !currentUserId) return
    try {
      await fetch('/api/chat/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversation._id })
      })
      loadConversations()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-6xl mx-auto px-0 py-0">
        <div className="flex h-[calc(100vh-80px)] bg-dark/50 border border-border rounded-xl overflow-hidden">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-border`}>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-sora font-bold text-xl flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Messages
                </h1>
                <button onClick={() => setShowNewChat(true)} className="btn-primary text-sm">New Chat</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No conversations yet</p>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 border-b border-border/50 cursor-pointer hover:bg-card ${selectedConversation?._id === conv._id ? 'bg-card' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {conv.participant.image ? (
                          <img src={conv.participant.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{conv.participant.name}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs truncate">{conv.lastMessage || 'Start a conversation'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${selectedConversation ? 'flex' : 'hidden'} flex-1 flex-col`}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedConversation(null)} className="md:hidden">
                      <User className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      {selectedConversation.participant.image ? (
                        <img src={selectedConversation.participant.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedConversation.participant.name}</p>
                      <p className="text-gray-500 text-xs">{selectedConversation.participant.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => {
                    const isMe = msg.sender._id === currentUserId || msg.sender._id === currentUserId
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-xl ${isMe ? 'bg-primary text-white' : 'bg-card'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="input-base flex-1"
                    />
                    <button onClick={sendMessage} disabled={sending || !newMessage.trim()} className="btn-primary p-3">
                      {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>

          {/* Online Users Sidebar */}
          <div className="w-64 border-l border-border hidden lg:flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <Circle className="w-3 h-3 text-green-400 fill-green-400" />
                Online ({onlineUsers.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {onlineUsers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No users online</p>
              ) : (
                onlineUsers.map(user => (
                  <div
                    key={user.userId}
                    onClick={() => startConversation(user.userId)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-card cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <Circle className="w-3 h-3 text-green-400 fill-green-400 absolute -bottom-0 -right-0 bg-dark rounded-full" />
                    </div>
                    <span className="text-sm font-medium truncate">{user.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewChat(false)}>
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-xl mb-4">New Conversation</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allUsers.filter(u => u._id !== currentUserId).map(user => (
                <div
                  key={user._id}
                  onClick={() => startConversation(user._id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {user.image ? <img src={user.image} alt="" className="w-10 h-10 rounded-full" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}