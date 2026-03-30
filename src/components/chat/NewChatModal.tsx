'use client'

import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

interface User {
  _id: string
  name: string
  email: string
  image?: string
  role: string
}

interface NewChatModalProps {
  onClose: () => void
  onConversationCreated: (conversationId: string) => void
}

export function NewChatModal({ onClose, onConversationCreated }: NewChatModalProps) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchUsers = async (query: string) => {
    setLoading(true)
    try {
      const url = query
        ? `/api/chat/users?search=${encodeURIComponent(query)}`
        : '/api/chat/users'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const startConversation = async (userId: string) => {
    setCreating(true)
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: userId }),
      })
      if (res.ok) {
        const data = await res.json()
        onConversationCreated(data.conversation._id)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-sora font-bold text-lg">New Conversation</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-border flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">
                {search ? 'No users found' : 'Type to search for users'}
              </p>
            </div>
          ) : (
            users.map((u) => (
              <button
                key={u._id}
                onClick={() => startConversation(u._id)}
                disabled={creating}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-border/50 transition-colors disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {u.image ? (
                    <img
                      src={u.image}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    u.name?.[0]?.toUpperCase() ?? 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-gray-600 capitalize">{u.role}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
