'use client'

import { useState } from 'react'
import { Video, Phone, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface VideoCallButtonProps {
  participantId: string
  participantName: string
  courseId?: string
  variant?: 'primary' | 'secondary' | 'icon'
  disabled?: boolean
}

export default function VideoCallButton({ 
  participantId, 
  participantName, 
  courseId,
  variant = 'primary',
  disabled = false 
}: VideoCallButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleStartCall = async () => {
    if (!participantId) {
      toast.error('No participant selected')
      return
    }

    setLoading(true)
    try {
      // Create a call session
      const response = await fetch('/api/video-call/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          participantId,
          courseId: courseId || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate call')
      }

      // Open video call modal or redirect to call page
      window.open(`/video-call/${data.callId}`, '_blank', 'width=800,height=600')
      toast.success('Call initiated!')
    } catch (error: any) {
      console.error('Error starting call:', error)
      toast.error(error.message || 'Failed to start call')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleStartCall}
        disabled={disabled || loading}
        className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
        title={`Video call with ${participantName}`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
      </button>
    )
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={handleStartCall}
        disabled={disabled || loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
        Call {participantName}
      </button>
    )
  }

  return (
    <button
      onClick={handleStartCall}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
      Start Video Call
    </button>
  )
}
