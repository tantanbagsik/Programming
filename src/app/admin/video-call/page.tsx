'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  CalendarDays
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CallSession {
  _id: string
  callId: string
  initiatorId: { name: string; email: string }
  participantId: { name: string; email: string }
  status: string
  startedAt: string
  endedAt: string
  durationSeconds: number
}

interface Participant {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminVideoCallPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
      // Load mock data for demo
      setParticipants([
        { id: '1', name: 'Admin User', email: 'admin@edulearn.com', role: 'admin' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@edulearn.com', role: 'instructor' },
        { id: '3', name: 'Marcus Chen', email: 'marcus@edulearn.com', role: 'instructor' },
        { id: '4', name: 'Test Student', email: 'student@edulearn.com', role: 'student' },
        { id: '5', name: 'John Doe', email: 'john@edulearn.com', role: 'student' },
        { id: '6', name: 'Jane Smith', email: 'jane@edulearn.com', role: 'student' },
      ])

      // Mock call history
      setCallHistory([
        {
          _id: '1',
          callId: 'call_001',
          initiatorId: { name: 'Admin User', email: 'admin@edulearn.com' },
          participantId: { name: 'Sarah Johnson', email: 'sarah@edulearn.com' },
          status: 'completed',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          endedAt: new Date(Date.now() - 3000000).toISOString(),
          durationSeconds: 600
        },
        {
          _id: '2',
          callId: 'call_002',
          initiatorId: { name: 'Admin User', email: 'admin@edulearn.com' },
          participantId: { name: 'Marcus Chen', email: 'marcus@edulearn.com' },
          status: 'completed',
          startedAt: new Date(Date.now() - 86400000).toISOString(),
          endedAt: new Date(Date.now() - 85800000).toISOString(),
          durationSeconds: 1000
        }
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startCall = async (participantId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/video-call/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start call')
      }

      setCallId(data.callId)
      setInCall(true)
      toast.success('Call started!')
    } catch (error: any) {
      console.error('Error starting call:', error)
      toast.error(error.message || 'Failed to start call')
    } finally {
      setLoading(false)
    }
  }

  const endCall = async () => {
    if (!callId) return

    try {
      await fetch('/api/video-call/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId })
      })
    } catch (error) {
      console.error('Error ending call:', error)
    }

    setInCall(false)
    setCallId(null)
    setCallDuration(0)
    toast.success('Call ended')
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

  // In-call view
  if (inCall) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <div className="flex-1 relative bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-primary" />
              </div>
              <p className="text-white text-xl">Connecting...</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg border border-border overflow-hidden">
            {isVideoOn ? (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="w-8 h-8 text-gray-500" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-4">
            <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 rounded-full transition-colors ${
                isMicOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
              <Monitor className="w-6 h-6" />
            </button>
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-card rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-sora font-bold text-2xl">Video Calls</h1>
            <p className="text-gray-400 text-sm">Manage video calls with students and instructors</p>
          </div>
        </div>

        {/* Tabs */}
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
            Schedule
          </button>
        </div>

        {/* Start Call Tab */}
        {activeTab === 'start' && (
          <div className="glow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-sora font-bold text-xl">Start Video Call</h2>
                <p className="text-gray-400 text-sm">Initiate a one-on-one video call with a participant</p>
              </div>
            </div>

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
                    onClick={() => startCall(participant.id)}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
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

        {/* Call History Tab */}
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
                      <p className="font-medium">{call.participantId.name}</p>
                      <p className="text-gray-500 text-sm">{call.participantId.email}</p>
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

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="glow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-sora font-bold text-xl">Schedule Video Call</h2>
                <p className="text-gray-400 text-sm">Plan a future video call with participants</p>
              </div>
            </div>

            <div className="p-8 text-center">
              <CalendarDays className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Schedule feature coming soon!</p>
              <p className="text-gray-500 text-sm">
                You can currently start immediate video calls. Scheduled calls will be available in a future update.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
