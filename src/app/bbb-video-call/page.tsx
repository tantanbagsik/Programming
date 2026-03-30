'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Video, Users, Clock, Loader2, Plus, Play, StopCircle, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

interface Meeting {
  id: string
  name: string
  createdAt: string
  moderatorPassword?: string
  attendeePassword?: string
}

function BBBVideoCallContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newMeetingName, setNewMeetingName] = useState('')
  const [activeMeeting, setActiveMeeting] = useState<string | null>(null)

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
    const saved = localStorage.getItem('bbb-meetings')
    if (saved) {
      setMeetings(JSON.parse(saved))
    }
    setLoading(false)
  }

  const saveMeetings = (updated: Meeting[]) => {
    setMeetings(updated)
    localStorage.setItem('bbb-meetings', JSON.stringify(updated))
  }

  const createMeeting = async () => {
    if (!newMeetingName.trim()) {
      toast.error('Please enter a meeting name')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/bbb/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          meetingName: newMeetingName,
          courseId: searchParams.get('courseId') || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meeting')
      }

      const newMeeting: Meeting = {
        id: data.meetingId,
        name: newMeetingName,
        createdAt: new Date().toISOString(),
        moderatorPassword: data.moderatorPassword,
        attendeePassword: data.attendeePassword,
      }

      saveMeetings([newMeeting, ...meetings])
      setNewMeetingName('')
      toast.success('Meeting created!')
    } catch (error: any) {
      console.error('Error creating meeting:', error)
      toast.error(error.message || 'Failed to create meeting')
    } finally {
      setCreating(false)
    }
  }

  const joinMeeting = async (meeting: Meeting, asModerator: boolean = false) => {
    try {
      const response = await fetch('/api/bbb/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          meetingId: meeting.id,
          role: asModerator ? 'moderator' : 'attendee'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join meeting')
      }

      window.open(data.joinUrl, '_blank')
    } catch (error: any) {
      console.error('Error joining meeting:', error)
      toast.error(error.message || 'Failed to join meeting')
    }
  }

  const endMeeting = async (meeting: Meeting) => {
    if (!meeting.moderatorPassword) {
      toast.error('No moderator password available')
      return
    }

    try {
      await fetch('/api/bbb/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          meetingId: meeting.id,
          moderatorPassword: meeting.moderatorPassword
        })
      })

      toast.success('Meeting ended')
    } catch (error: any) {
      console.error('Error ending meeting:', error)
      toast.error(error.message || 'Failed to end meeting')
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glow-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-2xl">BigBlueButton Video Calls</h1>
              <p className="text-gray-400 text-sm">Create and join video meetings</p>
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
              Create Meeting
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              <strong className="text-blue-400">Note:</strong> BigBlueButton requires a self-hosted server. 
              Please configure BBB_API_URL and BBB_SECRET in your environment variables.
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
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-500" />
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
                      onClick={() => joinMeeting(meeting, true)}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <Play className="w-4 h-4" />
                      Join as Host
                    </button>
                    <button
                      onClick={() => joinMeeting(meeting, false)}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      Join
                    </button>
                    <button
                      onClick={() => endMeeting(meeting)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    >
                      <StopCircle className="w-4 h-4" />
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

export default function BBBVideoCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <BBBVideoCallContent />
    </Suspense>
  )
}
