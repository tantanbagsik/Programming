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
  ArrowLeft,
  History,
  Phone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CallSession {
  _id: string
  callId: string
  initiatorId: { name: string; email: string }
  participantId: { name: string; email: string }
  status: string
  startedAt: string
  durationSeconds: number
}

export default function DashboardVideoCallPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inCall, setInCall] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)
  const [callHistory, setCallHistory] = useState<CallSession[]>([])
  const [loading, setLoading] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadCallHistory()
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

  const loadCallHistory = async () => {
    try {
      const res = await fetch('/api/video-call')
      if (res.ok) {
        const data = await res.json()
        setCallHistory(data.calls || [])
      }
    } catch (error) {
      console.error('Error loading call history:', error)
    } finally {
      setLoading(false)
    }
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-card rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-sora font-bold text-2xl">Video Calls</h1>
            <p className="text-gray-400 text-sm">Join or manage your video calls</p>
          </div>
        </div>

        {/* Call History */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-sora font-bold text-xl">Your Calls</h2>
              <p className="text-gray-400 text-sm">View your recent video call history</p>
            </div>
          </div>

          {callHistory.length > 0 ? (
            <div className="space-y-3">
              {callHistory.map(call => (
                <div key={call._id} className="flex items-center justify-between p-4 bg-dark/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {call.initiatorId?.name === session?.user?.name ? 
                          `Call with ${call.participantId?.name}` : 
                          `Call from ${call.initiatorId?.name}`}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {call.initiatorId?.email === session?.user?.email ? 
                          call.participantId?.email : 
                          call.initiatorId?.email}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {formatDate(call.startedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge text-xs ${
                      call.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      call.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {call.status}
                    </span>
                    {call.durationSeconds > 0 && (
                      <p className="text-gray-400 text-sm mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDuration(call.durationSeconds)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No video calls yet</p>
              <p className="text-gray-600 text-sm">
                Your video call history will appear here when you start or join calls.
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm text-gray-400">
            <strong>Note:</strong> Video calling requires Twilio credentials to be configured. 
            Contact your administrator if you need to schedule or join video calls.
          </p>
        </div>
      </div>
    </div>
  )
}
