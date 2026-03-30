'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Video, Phone, Users, Globe, Loader2, ExternalLink, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VideoCallOptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(false)
    }
  }, [status])

  const videoOptions = [
    {
      id: 'jitsi',
      name: 'Jitsi Meet',
      description: 'Free, open-source video calling. No account required.',
      icon: '📹',
      color: 'green',
      href: '/jitsi-video-call',
      features: ['Free forever', 'No installation', 'Works in browser', 'Screen sharing']
    },
    {
      id: 'bbb',
      name: 'BigBlueButton',
      description: 'Advanced video conferencing with recordings. Requires server setup.',
      icon: '🎥',
      color: 'blue',
      href: '/bbb-video-call',
      features: ['Screen sharing', 'Chat', 'Recording', 'Whiteboard'],
      requiresSetup: true
    },
    {
      id: 'twilio',
      name: 'Twilio Video',
      description: '1-on-1 video calls with Twilio. Requires API credentials.',
      icon: '📱',
      color: 'purple',
      href: '/video-call',
      features: ['1-on-1 calls', 'Video/Audio', 'Low latency', 'Cloud recording'],
      requiresSetup: true
    }
  ]

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
        <div className="text-center mb-8">
          <h1 className="font-sora font-bold text-3xl mb-2">Video Call Options</h1>
          <p className="text-gray-400">Choose how you want to start a video call</p>
        </div>

        <div className="grid gap-6">
          {videoOptions.map((option) => (
            <div 
              key={option.id}
              className="glow-card p-6 hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => {
                if (option.requiresSetup) {
                  toast(option.id === 'bbb' 
                    ? 'Configure BBB_API_URL and BBB_SECRET in environment variables'
                    : 'Configure Twilio credentials in environment variables'
                  )
                }
                router.push(option.href)
              }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-${option.color}-500/20`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-sora font-bold text-xl">{option.name}</h2>
                    {option.requiresSetup && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                        Setup Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4">{option.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature) => (
                      <span key={feature} className="text-xs bg-dark/50 text-gray-400 px-3 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="btn-primary flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(option.href)
                    }}
                  >
                    {option.id === 'jitsi' ? 'Start' : 'Go to'}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 glow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold">Admin Settings</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Configure video call providers in the admin panel
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/admin/settings')}
              className="btn-secondary text-sm"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}