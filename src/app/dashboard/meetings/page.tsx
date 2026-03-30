'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  User
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

function MeetingsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

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

  const getHostMeetings = (): Meeting[] => {
    const userEmail = session?.user?.email || ''
    return meetings.filter(m => m.hostEmail === userEmail)
  }

  const getInvitedMeetings = (): Meeting[] => {
    const userEmail = session?.user?.email || ''
    return meetings.filter(m => m.invitees.includes(userEmail) && m.hostEmail !== userEmail)
  }

  const hostMeetings = getHostMeetings()
  const invitedMeetings = getInvitedMeetings()

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalMeetings = hostMeetings.length + invitedMeetings.length

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-2xl">My Meetings</h1>
              <p className="text-gray-400 text-sm">All your meetings and invitations</p>
            </div>
          </div>
          <Link href="/video-call" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Meeting
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glow-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">{hostMeetings.length}</div>
            <div className="text-gray-400 text-sm">Created by Me</div>
          </div>
          <div className="glow-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{invitedMeetings.length}</div>
            <div className="text-gray-400 text-sm">Invitations</div>
          </div>
          <div className="glow-card p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{totalMeetings}</div>
            <div className="text-gray-400 text-sm">Total Meetings</div>
          </div>
        </div>

        {/* Meetings I Created */}
        <div className="glow-card p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Meetings I Created ({hostMeetings.length})
          </h2>
          
          {hostMeetings.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">You haven't created any meetings yet.</p>
              <Link href="/video-call" className="btn-primary inline-block text-sm">
                Create Your First Meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {hostMeetings.map((meeting) => (
                <div 
                  key={meeting._id} 
                  className="p-4 bg-dark/50 rounded-xl border border-primary/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{meeting.name}</p>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {meeting.invitees.length} invited
                        </p>
                        <p className="text-gray-600 text-xs flex items-center gap-2 mt-1">
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
                      <button
                        onClick={() => deleteMeeting(meeting)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {meeting.invitees.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-gray-500 mb-2">Invited:</p>
                      <div className="flex flex-wrap gap-2">
                        {meeting.invitees.map((email) => (
                          <span 
                            key={email} 
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invited Meetings */}
        <div className="glow-card p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-400" />
            Meeting Invitations ({invitedMeetings.length})
          </h2>
          
          {invitedMeetings.length === 0 ? (
            <div className="text-center py-6">
              <Mail className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">You haven't been invited to any meetings yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitedMeetings.map((meeting) => (
                <div 
                  key={meeting._id} 
                  className="p-4 bg-dark/50 rounded-xl border border-green-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">{meeting.name}</p>
                        <p className="text-gray-500 text-sm">
                          Hosted by: <span className="text-green-400">{meeting.hostName}</span>
                        </p>
                        <p className="text-gray-600 text-xs flex items-center gap-2 mt-1">
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
                    </div>
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

export default function MeetingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <MeetingsContent />
    </Suspense>
  )
}