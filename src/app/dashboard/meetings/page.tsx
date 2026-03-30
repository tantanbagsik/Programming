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
  Check,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Meeting {
  id: string
  name: string
  createdAt: string
  hostEmail: string
  hostName: string
  invitees: string[]
  joinUrl: string
}

function InviteMeetingsContent() {
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

  const loadMeetings = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('user-meetings')
    if (saved) {
      setMeetings(JSON.parse(saved))
    }
    setLoading(false)
  }

  const getInvitedMeetings = (): Meeting[] => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('user-meetings')
    if (!saved) return []
    const allMeetings: Meeting[] = JSON.parse(saved)
    const userEmail = session?.user?.email || ''
    return allMeetings.filter(m => m.invitees.includes(userEmail))
  }

  const invitedMeetings = getInvitedMeetings()

  const joinMeeting = (meeting: Meeting) => {
    window.open(meeting.joinUrl, '_blank')
  }

  const copyLink = (meeting: Meeting) => {
    navigator.clipboard.writeText(meeting.joinUrl)
    toast.success('Meeting link copied!')
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
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Mail className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="font-sora font-bold text-2xl">Meeting Invitations</h1>
            <p className="text-gray-400 text-sm">Video meetings you've been invited to</p>
          </div>
        </div>

        <div className="glow-card p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invited Meetings ({invitedMeetings.length})
          </h2>
          
          {invitedMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No meeting invitations yet.</p>
              <Link href="/video-call" className="btn-primary inline-block">
                Create a Meeting
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {invitedMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className="p-4 bg-dark/50 rounded-xl border border-green-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Video className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{meeting.name}</p>
                        <p className="text-gray-500 text-sm">
                          Hosted by: <span className="text-primary">{meeting.hostName}</span>
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
                        className="btn-primary flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Join Meeting
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

        <div className="mt-6 glow-card p-6">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="flex gap-3">
            <Link href="/video-call" className="btn-outline text-sm">
              Create Meeting
            </Link>
            <Link href="/video-call/manage" className="btn-outline text-sm">
              My Meetings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InviteMeetingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <InviteMeetingsContent />
    </Suspense>
  )
}