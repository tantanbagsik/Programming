'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Video as VideoIcon, 
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
  Settings
} from 'lucide-react'
import toast from 'react-hot-toast'
import Video, { Room, LocalTrack, RemoteParticipant, LocalVideoTrack, LocalAudioTrack, RemoteVideoTrack, RemoteAudioTrack } from 'twilio-video'

type CallProvider = 'twilio' | 'bbb'

interface Participant {
  id: string
  name: string
  email: string
  role: string
}

export default function VideoCallPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [callProvider, setCallProvider] = useState<CallProvider>('bbb')
  const [inCall, setInCall] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [room, setRoom] = useState<Room | null>(null)
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([])
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localTracksRef = useRef<LocalTrack[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadParticipants()
    }
  }, [status])

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [inCall])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect()
      }
      localTracksRef.current.forEach(track => {
        if (track.kind === 'video' || track.kind === 'audio') {
          track.stop()
        }
      })
    }
  }, [room])

  const attachTrack = (track: LocalVideoTrack | RemoteVideoTrack, element: HTMLVideoElement | null) => {
    if (element && 'attach' in track) {
      const mediaElement = track.attach()
      element.srcObject = mediaElement.srcObject
    }
  }

  const detachTrack = (track: LocalVideoTrack | LocalAudioTrack | RemoteVideoTrack | RemoteAudioTrack) => {
    if ('detach' in track) {
      track.detach().forEach(el => el.remove())
    }
  }

  const loadParticipants = async () => {
    try {
      // For demo, we'll use mock data
      // In production, this would fetch from /api/users
      setParticipants([
        { id: '1', name: 'Admin User', email: 'admin@edulearn.com', role: 'admin' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@edulearn.com', role: 'instructor' },
        { id: '3', name: 'Marcus Chen', email: 'marcus@edulearn.com', role: 'instructor' },
        { id: '4', name: 'Test Student', email: 'student@edulearn.com', role: 'student' },
      ])
    } catch (error) {
      console.error('Error loading participants:', error)
    } finally {
      setLoading(false)
    }
  }

  const startCall = async (participantId: string) => {
    setLoading(true)
    try {
      // First, initiate the call on our backend
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

      // Get Twilio token
      const tokenResponse = await fetch('/api/video-call/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identity: session?.user?.email || 'user',
          roomName: data.callId
        })
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || 'Failed to get video token')
      }

      // Create local tracks
      const localTracks = await Video.createLocalTracks({
        video: { width: 640, height: 480 },
        audio: true
      })

      localTracksRef.current = localTracks

      // Attach local video
      const videoTrack = localTracks.find(t => t.kind === 'video') as LocalVideoTrack
      if (videoTrack && localVideoRef.current) {
        attachTrack(videoTrack, localVideoRef.current)
      }

      // Connect to the room
      const connectedRoom = await Video.connect(tokenData.token, {
        name: data.callId,
        tracks: localTracks
      })

      setRoom(connectedRoom)

      // Handle existing participants
      connectedRoom.participants.forEach(participant => {
        handleParticipantConnected(participant)
      })

      // Set up event listeners
      connectedRoom.on('participantConnected', handleParticipantConnected)
      connectedRoom.on('participantDisconnected', handleParticipantDisconnected)

      setInCall(true)
      toast.success('Call started!')
    } catch (error: any) {
      console.error('Error starting call:', error)
      toast.error(error.message || 'Failed to start call')
    } finally {
      setLoading(false)
    }
  }

  const handleParticipantConnected = (participant: RemoteParticipant) => {
    setRemoteParticipants(prev => [...prev, participant])
    
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed && publication.track) {
        handleTrackSubscribed(publication.track as LocalVideoTrack | LocalAudioTrack | RemoteVideoTrack | RemoteAudioTrack)
      }
    })

    participant.on('trackSubscribed', handleTrackSubscribed)
    participant.on('trackUnsubscribed', handleTrackUnsubscribed)
  }

  const handleParticipantDisconnected = (participant: RemoteParticipant) => {
    setRemoteParticipants(prev => prev.filter(p => p !== participant))
  }

  const handleTrackSubscribed = (track: LocalVideoTrack | LocalAudioTrack | RemoteVideoTrack | RemoteAudioTrack) => {
    if (track.kind === 'video' && remoteVideoRef.current) {
      attachTrack(track as RemoteVideoTrack, remoteVideoRef.current)
    }
  }

  const handleTrackUnsubscribed = (track: LocalVideoTrack | LocalAudioTrack | RemoteVideoTrack | RemoteAudioTrack) => {
    detachTrack(track as RemoteVideoTrack | RemoteAudioTrack)
  }

  const endCall = async () => {
    if (!callId) return

    try {
      // Disconnect from room
      if (room) {
        room.disconnect()
        setRoom(null)
      }

      // Stop local tracks
      localTracksRef.current.forEach(track => {
        if (track.kind === 'video' || track.kind === 'audio') {
          track.stop()
        }
      })
      localTracksRef.current = []

      // Clear remote participants
      setRemoteParticipants([])

      // Notify backend
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
    setRemoteParticipants([])
    toast.success('Call ended')
  }

  const toggleVideo = async () => {
    const videoTrack = localTracksRef.current.find(t => t.kind === 'video') as LocalVideoTrack | undefined
    if (videoTrack) {
      if (isVideoOn) {
        videoTrack.disable()
      } else {
        videoTrack.enable()
      }
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleMic = async () => {
    const audioTrack = localTracksRef.current.find(t => t.kind === 'audio') as LocalAudioTrack | undefined
    if (audioTrack) {
      if (isMicOn) {
        audioTrack.disable()
      } else {
        audioTrack.enable()
      }
      setIsMicOn(!isMicOn)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Main Video (Remote) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {remoteParticipants.length > 0 ? (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <p className="text-white text-xl">Waiting for others to join...</p>
              </div>
            )}
          </div>

          {/* Local Video Preview */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg border border-border overflow-hidden">
            {isVideoOn ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-gray-500" />
              </div>
            )}
          </div>

          {/* Call Info */}
          <div className="absolute top-4 left-4 flex items-center gap-4">
            <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleMic}
              className={`p-4 rounded-full transition-colors ${
                isMicOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            <button
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            >
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

  // Pre-call view - Participant selection
  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glow-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <VideoIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-sora font-bold text-2xl">Video Call</h1>
              <p className="text-gray-400 text-sm">Start a video call with students or instructors</p>
            </div>
          </div>

          {/* Search */}
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

          {/* Participants List */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg mb-4">Available Participants</h2>
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
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs ${
                    participant.role === 'admin' ? 'bg-accent/20 text-accent' :
                    participant.role === 'instructor' ? 'bg-secondary/20 text-secondary' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {participant.role}
                  </span>
                  <button
                    onClick={() => startCall(participant.id)}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <VideoIcon className="w-4 h-4" />
                    Start Call
                  </button>
                </div>
              </div>
            ))}
            {filteredParticipants.length === 0 && (
              <p className="text-gray-500 text-center py-8">No participants found</p>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-sm text-gray-400">
              <strong>Note:</strong> Video calling requires Twilio credentials to be configured. 
              Please contact your administrator if you encounter issues starting calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
