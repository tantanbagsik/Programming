'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor,
  Users,
  Clock,
  Loader2,
  Plus,
  Search,
  Calendar,
  User,
  Phone,
  ArrowLeft,
  BarChart3,
  History,
  CalendarDays,
  Play,
  ExternalLink,
  Copy
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CallSession {
  _id: string
  callId: string
  participantName: string
  participantEmail: string
  status: string
  startedAt: string
  durationSeconds: number
}

interface Participant {
  id: string
  name: string
  email: string
  role: string
}

interface Meeting {
  id: string
  name: string
  createdAt: string
}

function AdminVideoCallContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'start' | 'history' | 'schedule'>('start')
  const [inCall, setInCall] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [callHistory, setCallHistory] = useState<CallSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [newMeetingName, setNewMeetingName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      const user = session?.user as any
      if (user?.role !== 'admin') {
        router.push('/')
      }
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadData()
    }
  }, [status])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [inCall])

  const loadData = async () => {
    try {
      setParticipants([
        { id: '1', name: 'Admin User', email: 'admin@edulearn.com', role: 'admin' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@edulearn.com', role: 'instructor' },
        { id: '3', name: 'Marcus Chen', email: 'marcus@edulearn.com', role: 'instructor' },
        { id: '4', name: 'Test Student', email: 'student@edulearn.com', role: 'student' },
        { id: '5', name: 'John Doe', email: 'john@edulearn.com', role: 'student' },
        { id: '6', name: 'Jane Smith', email: 'jane@edulearn.com', role: 'student' },
      ])

      setCallHistory([
        {
          _id: '1',
          callId: 'call_001',
          participantName: 'Sarah Johnson',
          participantEmail: 'sarah@edulearn.com',
          status: 'completed',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          durationSeconds: 600
        },
        {
          _id: '2',
          callId: 'call_002',
          participantName: 'Marcus Chen',
          participantEmail: 'marcus@edulearn.com',
          status: 'completed',
          startedAt: new Date(Date.now() - 86400000).toISOString(),
          durationSeconds: 1000
        }
      ])

      const savedMeetings = localStorage.getItem('admin-bbb-meetings')
      if (savedMeetings) {
        setMeetings(JSON.parse(savedMeetings))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startJitsiMeeting = async () => {
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
          userName: session?.user?.name || 'Admin'
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

      const updatedMeetings = [newMeeting, ...meetings]
      setMeetings(updatedMeetings)
      localStorage.setItem('admin-bbb-meetings', JSON.stringify(updatedMeetings))
      
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

  const copyMeetingLink = (meetingId: string) => {
    const url = `https://meet.jit.si/${meetingId}`
    navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-card rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-sora font-bold text-2xl">Video Calls</h1>
            <p className="text-gray-400 text-sm">Manage video calls with students and instructors</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('start')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'start' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Start Call
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Call History
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'schedule' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4 inline mr-2" />
            Meetings
          </button>
        </div>

        {activeTab === 'start' && (
          <div className="glow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="font-sora font-bold text-xl">Start Video Call (Jitsi)</h2>
                <p className="text-gray-400 text-sm">Start a free video call with Jitsi Meet</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newMeetingName}
                onChange={(e) => setNewMeetingName(e.target.value)}
                placeholder="Enter meeting name..."
                className="input-base flex-1"
                onKeyDown={(e) => e.key === 'Enter' && startJitsiMeeting()}
              />
              <button
                onClick={startJitsiMeeting}
                disabled={creating}
                className="btn-primary flex items-center gap-2"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Start Meeting
              </button>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400">
                <strong className="text-green-400">Jitsi Meet:</strong> Free video calls, no account required. Works instantly in your browser.
              </p>
            </div>

            <h3 className="font-semibold mb-4">Or start a call with a specific participant:</h3>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search participants..."
                className="input-base pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParticipants.map(participant => (
                <div 
                  key={participant.id} 
                  className="flex items-center justify-between p-4 bg-dark/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-gray-500 text-sm">{participant.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewMeetingName(`call-with-${participant.name.toLowerCase().replace(/\s+/g, '-')}`)
                      startJitsiMeeting()
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                </div>
              ))}
            </div>

            {filteredParticipants.length === 0 && (
              <p className="text-gray-500 text-center py-8">No participants found</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-sora font-bold text-xl">Call History</h2>
                <p className="text-gray-400 text-sm">View past video calls and their details</p>
              </div>
            </div>

            <div className="space-y-4">
              {callHistory.map(call => (
                <div key={call._id} className="flex items-center justify-between p-4 bg-dark/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">{call.participantName}</p>
                      <p className="text-gray-500 text-sm">{call.participantEmail}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(call.startedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge text-xs bg-green-500/20 text-green-400">
                      {call.status}
                    </span>
                    <p className="text-gray-400 text-sm mt-2">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDuration(call.durationSeconds)}
                    </p>
                  </div>
                </div>
              ))}
              {callHistory.length === 0 && (
                <p className="text-gray-500 text-center py-8">No call history yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="glow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-sora font-bold text-xl">Your Meetings</h2>
                <p className="text-gray-400 text-sm">View and manage your video meetings</p>
              </div>
            </div>

            {meetings.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No meetings yet. Create your first meeting above!</p>
              </div>
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
                        onClick={() => copyMeetingLink(meeting.id)}
                        className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminVideoCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <AdminVideoCallContent />
    </Suspense>
  )
}
