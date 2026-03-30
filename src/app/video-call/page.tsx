'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Video, 
  Users, 
  Clock, 
  Loader2, 
  Plus, 
  Play, 
  Copy,
  Trash2,
  Mail,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Meeting {
  _id: string
  name: string
  createdAt: string
  hostEmail: string
  hostName: string
  invitees: string[]
  joinUrl: string
  roomId: string
}

function VideoCallContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newMeetingName, setNewMeetingName] = useState('')
  const [inviteeEmail, setInviteeEmail] = useState('')

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
    try {
      const response = await fetch('/api/meeting')
      const data = await response.json()
      if (response.ok) {
        setMeetings(data.meetings || [])
      }
    } catch (error) {
      console.error('Error loading meetings:', error)
    } finally {
      setLoading(false)
    }
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
          userName: session?.user?.name || 'User'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meeting')
      }

      const meetingResponse = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newMeetingName,
          roomId: data.roomName,
          joinUrl: data.joinUrl,
          invitees: []
        })
      })

      const meetingData = await meetingResponse.json()

      if (!meetingResponse.ok) {
        throw new Error(meetingData.error || 'Failed to save meeting')
      }

      setMeetings([meetingData.meeting, ...meetings])
      setNewMeetingName('')
      toast.success('Meeting created! Invite others below.')
    } catch (error: any) {
      console.error('Error creating meeting:', error)
      toast.error(error.message || 'Failed to create meeting')
    } finally {
      setCreating(false)
    }
  }

  const addInvitee = async (meeting: Meeting) => {
    if (!inviteeEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteeEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      const response = await fetch(`/api/meeting/${meeting._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: meeting._id, invitee: inviteeEmail, action: 'add' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to invite')
      }

      setMeetings(meetings.map(m => m._id === meeting._id ? data.meeting : m))
      toast.success(`Invited ${inviteeEmail}`)
      setInviteeEmail('')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const removeInvitee = async (meeting: Meeting, email: string) => {
    try {
      const response = await fetch(`/api/meeting/${meeting._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: meeting._id, invitee: email, action: 'remove' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove invitee')
      }

      setMeetings(meetings.map(m => m._id === meeting._id ? data.meeting : m))
      toast.success('Invitee removed')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const joinMeeting = (meeting: Meeting) => {
    window.open(meeting.joinUrl, '_blank')
  }

  const copyLink = (meeting: Meeting) => {
    navigator.clipboard.writeText(meeting.joinUrl)
    toast.success('Meeting link copied!')
  }

  const deleteMeeting = async (meeting: Meeting) => {
    try {
      const response = await fetch(`/api/meeting/${meeting._id}?id=${meeting._id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMeetings(meetings.filter(m => m._id !== meeting._id))
        toast.success('Meeting deleted')
      }
    } catch (error) {
      toast.error('Failed to delete meeting')
    }
  }

  const isMyMeeting = (meeting: Meeting) => {
    return meeting.hostEmail === session?.user?.email
  }

  const isInvited = (meeting: Meeting) => {
    return meeting.invitees.includes(session?.user?.email || '')
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
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-2xl">Video Calls</h1>
              <p className="text-gray-400 text-sm">Create meetings and invite others to join</p>
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
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create Meeting
            </button>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-400">
              <strong className="text-green-400">Jitsi Meet:</strong> Free video calls. Create a meeting, invite participants, and start immediately.
            </p>
          </div>
        </div>

        <div className="glow-card p-6">
          <h2 className="font-semibold text-lg mb-4">All Meetings</h2>
          
          {meetings.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No meetings yet. Create your first meeting above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div 
                  key={meeting._id} 
                  className="p-4 bg-dark/50 rounded-xl border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-green-500" />
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
                        onClick={() => copyLink(meeting)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {isMyMeeting(meeting) && (
                        <button
                          onClick={() => deleteMeeting(meeting)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Delete meeting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isMyMeeting(meeting) && (
                    <div className="border-t border-border pt-4 mt-4">
                      <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Invite participants:
                      </p>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="email"
                          value={inviteeEmail}
                          onChange={(e) => setInviteeEmail(e.target.value)}
                          placeholder="Enter email to invite..."
                          className="input-base flex-1 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addInvitee(meeting)
                          }}
                        />
                        <button
                          onClick={() => addInvitee(meeting)}
                          className="btn-secondary text-sm"
                        >
                          Invite
                        </button>
                      </div>
                      {meeting.invitees.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {meeting.invitees.map((email) => (
                            <span 
                              key={email} 
                              className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                            >
                              {email}
                              <button 
                                onClick={() => removeInvitee(meeting, email)}
                                className="hover:text-red-400"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!isMyMeeting(meeting) && isInvited(meeting) && (
                    <div className="mt-3 p-2 bg-green-500/20 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-green-400 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        You have been invited to this meeting
                      </span>
                      <button
                        onClick={() => joinMeeting(meeting)}
                        className="btn-primary text-sm"
                      >
                        Join Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VideoCallContent />
    </Suspense>
  )
}