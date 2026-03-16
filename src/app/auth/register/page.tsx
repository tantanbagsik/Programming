'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordChecks = [
    { label: 'At least 8 characters', ok: form.password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(form.password) },
    { label: 'Contains uppercase', ok: /[A-Z]/.test(form.password) },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }

      toast.success('Account created! Signing you in...')
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg shimmer-btn flex items-center justify-center text-sm font-bold font-sora">R</div>
            <span className="font-sora font-bold text-xl gradient-text">Raypanganiban</span>
          </Link>
          <h1 className="font-sora font-bold text-3xl mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm">Start learning for free today</p>
        </div>

        <div className="glow-card p-8">
          <div className="flex gap-3 mb-6">
            {[{ provider: 'google', label: 'Google', icon: 'G' }, { provider: 'github', label: 'GitHub', icon: '⌥' }].map(({ provider, label, icon }) => (
              <button key={provider} onClick={() => signIn(provider, { callbackUrl: '/dashboard' })}
                className="flex-1 flex items-center justify-center gap-2 border border-border hover:border-primary/50 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white transition-all">
                <span className="font-bold">{icon}</span> {label}
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative text-center"><span className="bg-card px-3 text-gray-500 text-xs">or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-base" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-base" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-base pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs ${c.ok ? 'text-green-400' : 'text-gray-500'}`}>
                      <Check className={`w-3 h-3 ${c.ok ? 'text-green-400' : 'text-gray-600'}`} />
                      {c.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="w-full shimmer-btn text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
