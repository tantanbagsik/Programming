'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  courseId: string
  courseSlug: string
  price: number
  isEnrolled: boolean
  isLoggedIn: boolean
}

export function EnrollButton({ courseId, courseSlug, price, isEnrolled, isLoggedIn }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (isEnrolled) {
    return (
      <Link href={`/dashboard/courses/${courseSlug}`} className="btn-primary w-full text-center block py-4 text-base">
        ▶ Continue Learning
      </Link>
    )
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/auth/login?callbackUrl=/courses/${courseSlug}`} className="btn-primary w-full text-center block py-4 text-base">
        {price === 0 ? 'Enroll for Free' : `Enroll for $${price}`}
      </Link>
    )
  }

  async function handleEnroll() {
    setLoading(true)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Enrollment failed')
        return
      }

      if (data.url.startsWith('/')) {
        toast.success('Enrolled successfully!')
        router.push(data.url)
      } else {
        // Redirect to Stripe checkout
        window.location.href = data.url
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="shimmer-btn w-full text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {loading ? (
        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
      ) : price === 0 ? (
        'Enroll for Free'
      ) : (
        `Enroll Now — $${price}`
      )}
    </button>
  )
}
