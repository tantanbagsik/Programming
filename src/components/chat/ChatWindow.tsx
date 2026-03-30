'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft } from 'lucide-react'

interface MessageSender {
  _id: string
  name: string
  image?: string
  email: string
}

interface Message {
  _id: string
  conversation: string
  sender: MessageSender
  content: string
  read: boolean
  createdAt: string
}

interface Participant {
  _id: string
  name: string
  email: string
  image?: string
  role: string
}

interface ChatWindowProps {
  conversationId: string
  participants: Participant[]
  currentUserId: string
  onBack: () => void
}

export function ChatWindow({
  conversationId,
  participants,
  currentUserId,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const other = participants.find((p) => p._id !== currentUserId)

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data.message])
      } else {
        setNewMessage(content)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setNewMessage(content)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  const shouldShowDate = (msg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true
    const d1 = new Date(msg.createdAt).toDateString()
    const d2 = new Date(prevMsg.createdAt).toDateString()
    return d1 !== d2
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 rounded-lg hover:bg-card flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
          {other?.image ? (
            <img
              src={other.image}
              alt={other.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            other?.name?.[0]?.toUpperCase() ?? 'U'
          )}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{other?.name || 'Unknown User'}</h3>
          <p className="text-xs text-gray-500">{other?.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">No messages yet</p>
              <p className="text-gray-600 text-xs">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.sender._id === currentUserId
            const prevMsg = messages[i - 1]
            const showDate = shouldShowDate(msg, prevMsg)

            return (
              <div key={msg._id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-gray-500 bg-dark px-3 py-1 rounded-full">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm
                      ${
                        isMine
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-card border border-border text-gray-200 rounded-bl-md'
                      }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isMine ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input-base flex-1"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
