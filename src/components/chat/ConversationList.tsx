'use client'

import { useState } from 'react'
import { Search, Plus, MessageCircle } from 'lucide-react'

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

interface ConversationListProps {
  conversations: Conversation[]
  activeId: string | null
  currentUserId: string
  onSelect: (id: string) => void
  onNewChat: () => void
  loading: boolean
}

export function ConversationList({
  conversations,
  activeId,
  currentUserId,
  onSelect,
  onNewChat,
  loading,
}: ConversationListProps) {
  const [search, setSearch] = useState('')

  const getOtherParticipant = (conv: Conversation) =>
    conv.participants.find((p) => p._id !== currentUserId)

  const filtered = conversations.filter((conv) => {
    if (!search) return true
    const other = getOtherParticipant(conv)
    return (
      other?.name?.toLowerCase().includes(search.toLowerCase()) ||
      other?.email?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-sora font-bold text-lg">Messages</h2>
          <button
            onClick={onNewChat}
            className="w-8 h-8 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {search ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!search && (
              <button
                onClick={onNewChat}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Start a new chat
              </button>
            )}
          </div>
        ) : (
          filtered.map((conv) => {
            const other = getOtherParticipant(conv)
            const isActive = activeId === conv._id
            return (
              <button
                key={conv._id}
                onClick={() => onSelect(conv._id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${isActive ? 'bg-primary/10 border-r-2 border-primary' : 'hover:bg-card'}`}
              >
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">
                      {other?.name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
