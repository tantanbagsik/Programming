'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/Navbar'
import { Save, Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const user = session?.user as any

  const [form, setForm] = useState({ name: user?.name ?? '', bio: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Profile updated!')
        await update({ name: form.name })
      } else {
        toast.error('Failed to update profile')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setSavingPass(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Password updated!')
        setPasswords({ current: '', new: '', confirm: '' })
      } else {
        toast.error(data.error ?? 'Failed to update password')
      }
    } finally {
      setSavingPass(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-sora font-bold text-3xl">Account Settings</h1>
          </div>

          {/* Profile */}
          <div className="glow-card p-6 mb-6">
            <h2 className="font-sora font-semibold text-lg mb-5">Profile Information</h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
                <span className={`badge text-xs mt-1 inline-flex ${
                  user?.role === 'admin' ? 'text-accent border-accent/30 bg-accent/10' :
                  user?.role === 'instructor' ? 'text-secondary border-secondary/30 bg-secondary/10' :
                  'text-gray-400 border-gray-600 bg-gray-800'
                }`}>{user?.role}</span>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bio <span className="text-gray-500 font-normal">(optional)</span></label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="input-base resize-none"
                  rows={3}
                  maxLength={500}
                  placeholder="Tell us a bit about yourself..."
                />
                <p className="text-xs text-gray-600 mt-1">{form.bio.length}/500</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" value={user?.email ?? ''} className="input-base opacity-60 cursor-not-allowed" disabled />
                <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="glow-card p-6 mb-6">
            <h2 className="font-sora font-semibold text-lg mb-5">Change Password</h2>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Current Password</label>
                <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} className="input-base" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <input type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} className="input-base" required minLength={8} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} className="input-base" required />
              </div>
              <button type="submit" disabled={savingPass} className="btn-primary flex items-center gap-2">
                {savingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {savingPass ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger zone */}
          <div className="border border-red-500/30 rounded-2xl p-6">
            <h2 className="font-sora font-semibold text-lg text-red-400 mb-2">Danger Zone</h2>
            <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. All your progress and enrollments will be lost.</p>
            <button className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-medium transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
