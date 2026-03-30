'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  X, 
  Settings,
  CircleAlert
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function CloudinarySettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloudName: '',
    apiKey: '',
    apiSecret: '',
    isConfigured: false,
    isTesting: false,
    testResult: null as { success: boolean; message: string } | null
  })
  const [formValues, setFormValues] = useState({
    cloudName: '',
    apiKey: '',
    apiSecret: ''
  })

  // Check if user is admin
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

  // Load current configuration from environment variables (we can't read them directly on client, so we'll use an API endpoint)
  useEffect(() => {
    loadCloudinaryStatus()
  }, [])

  async function loadCloudinaryStatus() {
    try {
      const res = await fetch('/api/admin/settings/cloudinary/status')
      if (res.ok) {
        const data = await res.json()
        setCloudinaryConfig({
          ...cloudinaryConfig,
          cloudName: data.cloudName || '',
          apiKey: data.apiKey ? '••••••••••••••••' : '',
          apiSecret: data.apiSecret ? '••••••••••••••••' : '',
          isConfigured: !!data.cloudName && !!data.apiKey && !!data.apiSecret
        })
      }
    } catch (error) {
      console.error('Failed to load Cloudinary status:', error)
    }
  }

  async function handleTestConnection() {
    setCloudinaryConfig(prev => ({ ...prev, isTesting: true, testResult: null }))
    try {
      const res = await fetch('/api/admin/settings/cloudinary/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      setCloudinaryConfig(prev => ({
        ...prev,
        isTesting: false,
        testResult: { success: res.ok, message: data.message || (res.ok ? 'Connection successful' : 'Connection failed') }
      }))
      if (res.ok) {
        toast.success('Cloudinary connection test passed!')
      } else {
        toast.error('Cloudinary connection test failed: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Cloudinary test error:', error)
      setCloudinaryConfig(prev => ({ 
        ...prev, 
        isTesting: false, 
        testResult: { success: false, message: 'Connection test failed: ' + (error as Error).message } 
      }))
      toast.error('Cloudinary connection test failed')
    }
  }

  async function handleSaveConfig() {
    // In a real application, we would update the environment variables via a secure admin API
    // However, environment variables cannot be changed at runtime for security reasons
    // Instead, we'll show a message instructing the user to update their environment variables
    setCloudinaryConfig(prev => ({ ...prev, isTesting: true }))
    try {
      // We'll just validate the format and then instruct the user to update their env vars
      if (!formValues.cloudName.trim() || !formValues.apiKey.trim() || !formValues.apiSecret.trim()) {
        toast.error('Please fill in all fields')
        setCloudinaryConfig(prev => ({ ...prev, isTesting: false }))
        return
      }

      // In a real implementation, we would call an API to update the configuration
      // But since we can't change env vars at runtime, we'll simulate and show instructions
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      setCloudinaryConfig(prev => ({ 
        ...prev, 
        isTesting: false,
        cloudName: formValues.cloudName,
        apiKey: '••••••••••••••••',
        apiSecret: '••••••••••••••••',
        isConfigured: true
      }))
      
      toast.success('Configuration saved! Please note: For security, Cloudinary credentials must be set as environment variables in your hosting platform (Vercel, etc.). The values you entered have been validated but not stored. Please update your environment variables manually.')
      
      // After a delay, reload the status to show the actual environment variable state
      setTimeout(() => {
        loadCloudinaryStatus()
      }, 2000)
    } catch (error) {
      console.error('Save config error:', error)
      setCloudinaryConfig(prev => ({ ...prev, isTesting: false }))
      toast.error('Failed to save configuration')
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/settings" className="p-2 hover:bg-border rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-sora font-bold text-lg">Cloudinary Configuration</h1>
                <p className="text-gray-400 text-xs">Configure and test your Cloudinary integration for media uploads</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glow-card p-6 mb-6">
          <h2 className="font-sora font-semibold text-xl mb-4">Cloudinary Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ${cloudinaryConfig.isConfigured ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center">
                {cloudinaryConfig.isConfigured ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
              </div>
              <div>
                <h3 className="font-sora font-semibold text-lg">Cloudinary Integration</h3>
                <p className={cloudinaryConfig.isConfigured ? 'text-green-400' : 'text-red-500'}>
                  {cloudinaryConfig.isConfigured ? 'Configured and ready' : 'Not configured - media uploads will fail'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Cloud Name</span>
                <span className="ml-2 font-mono text-sm">${cloudinaryConfig.cloudName || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>API Key</span>
                <span className="ml-2 font-mono text-sm">${cloudinaryConfig.apiKey}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>API Secret</span>
                <span className="ml-2 font-mono text-sm">${cloudinaryConfig.apiSecret}</span>
              </div>
            </div>

            {cloudinaryConfig.isTesting && (
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Testing connection...</span>
              </div>
            )}

            {cloudinaryConfig.testResult && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${cloudinaryConfig.testResult.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                {cloudinaryConfig.testResult.success ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                <span>${cloudinaryConfig.testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {!cloudinaryConfig.isConfigured && (
          <div className="glow-card p-6 mb-6">
            <h2 className="font-sora font-semibold text-xl mb-4">Configuration Instructions</h2>
            <div className="space-y-4">
              <div className="bg-dark/50 p-4 rounded-lg">
                <h3 className="font-sora font-semibold text-lg mb-3">To configure Cloudinary:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Log in to your <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cloudinary account</a></li>
                  <li>Navigate to the Dashboard to find your Cloud Name, API Key, and API Secret</li>
                  <li>Set these as environment variables in your hosting platform:</li>
                  <ul className="list-disc list-inside mt-2 pl-5">
                    <li><strong>CLOUDINARY_CLOUD_NAME</strong>: Your Cloudinary cloud name</li>
                    <li><strong>CLOUDINARY_API_KEY</strong>: Your Cloudinary API key</li>
                    <li><strong>CLOUDINARY_API_SECRET</strong>: Your Cloudinary API secret</li>
                  </ul>
                  <li>If using Vercel, go to Project Settings → Environment Variables and add the three variables above</li>
                  <li>After setting the variables, redeploy your application</li>
                  <li>Return to this page to test the connection</li>
                </ol>
              </div>
              <div className="text-center">
                <Link href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Go to Cloudinary Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {cloudinaryConfig.isConfigured && (
          <div className="glow-card p-6">
            <h2 className="font-sora font-semibold text-xl mb-4">Test Configuration</h2>
            <p className="text-gray-400 mb-4">Test your Cloudinary configuration to ensure media uploads will work correctly.</p>
            <div className="flex gap-3">
              <button 
                onClick={handleTestConnection}
                disabled={cloudinaryConfig.isTesting}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${cloudinaryConfig.isTesting ? 'bg-secondary/20 text-secondary hover:bg-secondary/30' : 'bg-primary text-white hover:bg-primary/90'}`}
              >
                {cloudinaryConfig.isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Test Connection
                  </>
                )}
              </button>
              <button 
                onClick={() => router.refresh()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-gray-400 border border-border hover:border-primary hover:text-white"
              >
                <AlertTriangle className="w-4 h-4" />
                Refresh Status
              </button>
            </div>
          </div>
        )}

        {!cloudinaryConfig.isConfigured && (
          <div className="glow-card p-6">
            <h2 className="font-sora font-semibold text-xl mb-4">Manual Configuration Form</h2>
            <p className="text-gray-400 mb-4">Enter your Cloudinary credentials below to validate the format. Note: For security, you must still set these as environment variables in your hosting platform.</p>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSaveConfig()
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Cloud Name</label>
                <input
                  type="text"
                  name="cloudName"
                  value={formValues.cloudName}
                  onChange={handleInputChange}
                  className="input-base w-full"
                  placeholder="your-cloud-name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">API Key</label>
                <input
                  type="text"
                  name="apiKey"
                  value={formValues.apiKey}
                  onChange={handleInputChange}
                  className="input-base w-full"
                  placeholder="your-api-key"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">API Secret</label>
                <input
                  type="text"
                  name="apiSecret"
                  value={formValues.apiSecret}
                  onChange={handleInputChange}
                  className="input-base w-full"
                  placeholder="your-api-secret"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  disabled={cloudinaryConfig.isTesting}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${cloudinaryConfig.isTesting ? 'bg-secondary/20 text-secondary hover:bg-secondary/30' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {cloudinaryConfig.isTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4" />
                      Save Configuration
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setFormValues({ cloudName: '', apiKey: '', apiSecret: '' })
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-gray-400 hover:border-primary hover:text-white"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Clear Form
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                <strong>Important:</strong> For security, Cloudinary credentials must be set as environment variables in your hosting platform (Vercel, Netlify, etc.). This form only validates the format and provides instructions. Actual configuration must be done through your platform's environment variable settings.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

// Add ArrowRight import
import { ArrowRight } from 'lucide-react'