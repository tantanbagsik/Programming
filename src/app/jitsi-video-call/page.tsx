'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Video, Users, Clock, Loader2, Plus, Play, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Meeting {
  id: string
  name: string
  createdAt: string
}

export default function JitsiVideoCallPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newMeetingName, setNewMeetingName] = useState('')
  const [activeMeeting, setActiveMeeting] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadMeetings()
    }
  }, [status])

  const loadMeetings = async () => {
    const saved = localStorage.getItem('jitsi-meetings')
    if (saved) {
      setMeetings(JSON.parse(saved))
    }
    setLoading(false)
  }

  const saveMeetings = (updated: Meeting[]) => {
    setMeetings(updated)
    localStorage.setItem('jitsi-meetings', JSON.stringify(updated))
  }

  const createMeeting = async () => {
    if (!newMeetingName.trim()) {
      toast.error('Please enter a meeting name')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/jitsi/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomName: newMeetingName,
          userName: session?.user?.name || session?.user?.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meeting')
      }

      const newMeeting: Meeting = {
        id: data.roomName,
        name: newMeetingName,
        createdAt: new Date().toISOString(),
      }

      saveMeetings([newMeeting, ...meetings])
      setNewMeetingName('')
      
      window.open(data.joinUrl, '_blank')
      toast.success('Meeting created!')
    } catch (error: any) {
      console.error('Error creating meeting:', error)
      toast.error(error.message || 'Failed to create meeting')
    } finally {
      setCreating(false)
    }
  }

  const joinMeeting = (meeting: Meeting) => {
    const joinUrl = `https://meet.jit.si/${meeting.id}`
    window.open(joinUrl, '_blank')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (activeMeeting) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <div className="bg-card border-b border-border p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">Jitsi Video Meeting</h1>
                <p className="text-gray-400 text-sm">Room: {activeMeeting}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveMeeting(null)}
              className="btn-secondary"
            >
              Leave Meeting
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <iframe
            ref={iframeRef}
            src={`https://meet.jit.si/${activeMeeting}`}
            allow="camera; microphone; display-capture"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glow-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-2xl">Jitsi Video Calls</h1>
              <p className="text-gray-400 text-sm">Free video meetings in your browser</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newMeetingName}
              onChange={(e) => setNewMeetingName(e.target.value)}
              placeholder="Enter meeting name..."
              className="input-base flex-1"
              onKeyDown={(e) => e.key === 'Enter' && createMeeting()}
            />
            <button
              onClick={createMeeting}
              disabled={creating}
              className="btn-primary flex items-center gap-2"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Start Meeting
            </button>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              <strong className="text-green-400">Free:</strong> Jitsi is free to use, no account required. 
              Works directly in your browser.
            </p>
          </div>
        </div>

        <div className="glow-card p-6">
          <h2 className="font-semibold text-lg mb-4">Your Meetings</h2>
          
          {meetings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No meetings created yet</p>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className="flex items-center justify-between p-4 bg-dark/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{meeting.name}</p>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(meeting.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => joinMeeting(meeting)}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4" />
                      Join
                    </button>
                    <button
                      onClick={() => {
                        const url = `https://meet.jit.si/${meeting.id}`
                        navigator.clipboard.writeText(url)
                        toast.success('Link copied!')
                      }}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}