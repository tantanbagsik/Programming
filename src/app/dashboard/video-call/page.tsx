'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Video, 
  Users, 
  Clock, 
  Loader2, 
  Play, 
  Copy,
  Mail,
  Plus,
  Trash2,
  Bell
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

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

export default function VideoCallDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newMeetingName, setNewMeetingName] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadMeetings()
      const interval = setInterval(loadMeetings, 5000)
      return () => clearInterval(interval)
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
      toast.success('Meeting created!')
    } catch (error: any) {
      console.error('Error creating meeting:', error)
      toast.error(error.message || 'Failed to create meeting')
    } finally {
      setCreating(false)
    }
  }

  const addInvitee = async (meeting: Meeting, email: string) => {
    if (!email.trim()) {
      toast.error('Please enter an email')
      return
    }

    try {
      const response = await fetch(`/api/meeting/${meeting._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: meeting._id, invitee: email, action: 'add' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to invite')
      }

      setMeetings(meetings.map(m => m._id === meeting._id ? data.meeting : m))
      toast.success(`Invited ${email}`)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const joinMeeting = (meeting: Meeting) => {
    window.open(meeting.joinUrl, '_blank')
  }

  const copyLink = (meeting: Meeting) => {
    navigator.clipboard.writeText(meeting.joinUrl)
    toast.success('Link copied!')
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
      toast.error('Failed to delete')
    }
  }

  const isMyMeeting = (meeting: Meeting) => meeting.hostEmail === session?.user?.email
  const isInvited = (meeting: Meeting) => meeting.invitees.includes(session?.user?.email || '') && !isMyMeeting(meeting)

  const hostMeetings = meetings.filter(m => isMyMeeting(m))
  const invitedMeetings = meetings.filter(m => isInvited(m))

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-2xl">Video Call Dashboard</h1>
              <p className="text-gray-400 text-sm">Real-time meeting invites & management</p>
            </div>
          </div>
          <Link href="/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="glow-card p-4">
            <div className="text-xl font-bold text-primary">{hostMeetings.length}</div>
            <div className="text-xs text-gray-400">Created by Me</div>
          </div>
          <div className="glow-card p-4">
            <div className="text-xl font-bold text-green-400">{invitedMeetings.length}</div>
            <div className="text-xs text-gray-400">Invitations</div>
          </div>
          <div className="glow-card p-4">
            <div className="text-xl font-bold text-yellow-400">{invitedMeetings.length > 0 ? 'New!' : '-'}</div>
            <div className="text-xs text-gray-400">Unread</div>
          </div>
          <div className="glow-card p-4">
            <div className="text-xl font-bold">{meetings.length}</div>
            <div className="text-xs text-gray-400">Total Meetings</div>
          </div>
        </div>

        {/* Invite Section */}
        <div className="glow-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Create New Meeting</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMeetingName}
              onChange={(e) => setNewMeetingName(e.target.value)}
              placeholder="Enter meeting name..."
              className="input-base flex-1"
              onKeyDown={(e) => e.key === 'Enter' && createMeeting()}
            />
            <button onClick={createMeeting} disabled={creating} className="btn-primary">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Meeting'}
            </button>
          </div>
        </div>

        {/* Invitations */}
        <div className="glow-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-400" />
            My Invitations ({invitedMeetings.length})
          </h2>
          
          {invitedMeetings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No invitations yet</p>
          ) : (
            <div className="space-y-3">
              {invitedMeetings.map(meeting => (
                <div key={meeting._id} className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div>
                    <p className="font-medium">{meeting.name}</p>
                    <p className="text-sm text-gray-400">Hosted by {meeting.hostName}</p>
                    <p className="text-xs text-gray-500">{new Date(meeting.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => joinMeeting(meeting)} className="btn-primary">Join Now</button>
                    <button onClick={() => copyLink(meeting)} className="p-2 rounded bg-gray-700"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Meetings */}
        <div className="glow-card p-6">
          <h2 className="font-semibold text-lg mb-4">All Meetings</h2>
          
          {meetings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No meetings yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-border">
                  <th className="pb-2">Meeting</th>
                  <th className="pb-2">Host</th>
                  <th className="pb-2">Invited</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map(meeting => (
                  <tr key={meeting._id} className="border-b border-border/50">
                    <td className="py-3 font-medium">{meeting.name}</td>
                    <td className="py-3 text-gray-400">{meeting.hostName}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {meeting.invitees.slice(0, 3).map(e => (
                          <span key={e} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{e.split('@')[0]}</span>
                        ))}
                        {meeting.invitees.length > 3 && <span className="text-xs text-gray-500">+{meeting.invitees.length - 3}</span>}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => joinMeeting(meeting)} className="btn-primary text-sm">Join</button>
                        <button onClick={() => copyLink(meeting)} className="p-2 rounded bg-gray-700"><Copy className="w-4 h-4" /></button>
                        {isMyMeeting(meeting) && (
                          <button onClick={() => deleteMeeting(meeting)} className="p-2 rounded bg-red-500/20 text-red-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                        {isMyMeeting(meeting) && (
                          <div className="flex gap-1">
                            <input 
                              type="email" 
                              placeholder="Invite email..." 
                              className="input-base text-sm w-32"
                              id={`invite-${meeting._id}`}
                            />
                            <button 
                              onClick={() => addInvitee(meeting, (document.getElementById(`invite-${meeting._id}`) as HTMLInputElement)?.value)}
                              className="btn-secondary text-sm"
                            >
                              Invite
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}