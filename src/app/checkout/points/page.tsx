'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft, Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

export default function PointsCheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [userPoints, setUserPoints] = useState(0)

  const total = getTotal()
  const canAfford = userPoints >= total

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout/points')
    }
  }, [status, router])

  useEffect(() => {
    if (items.length === 0 && status === 'authenticated') {
      router.push('/courses')
    }
  }, [items, status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserPoints()
    }
  }, [status])

  const fetchUserPoints = async () => {
    try {
      const res = await fetch('/api/points')
      const data = await res.json()
      setUserPoints(data.points || 0)
    } catch (error) {
      console.error('Error fetching points:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!canAfford) {
      toast.error('Insufficient points. Please top up your account.')
      return
    }

    setProcessing(true)
    try {
      for (const item of items) {
        const res = await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: item.courseId,
            paymentId: 'points-purchase',
            amount: item.discountPrice || item.price,
            status: 'active'
          })
        })

        if (!res.ok) {
          throw new Error('Enrollment failed')
        }
      }

      const pointsRes = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: -total,
          paymentId: 'course-purchase'
        })
      })

      const pointsData = await pointsRes.json()
      
      clearCart()
      setUserPoints(pointsData.points || 0)
      
      toast.success('🎉 Purchase successful! You are now enrolled.')
      router.push('/dashboard/courses')
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('Purchase failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/cart" className="p-2 hover:bg-card rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-sora font-bold text-2xl">Checkout with Points</h1>
              <p className="text-gray-400 text-sm">Complete your purchase using your points balance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="glow-card p-6">
                <h2 className="font-sora font-semibold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.courseId} className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-card flex items-center justify-center text-sm">📚</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">by {item.instructor}</p>
                      </div>
                      <span className="text-sm font-medium">{item.discountPrice || item.price} pts</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-yellow-400">{total} pts</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="glow-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h2 className="font-sora font-semibold text-lg">Pay with Points</h2>
                </div>

                <div className="bg-dark rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Your Balance</span>
                    <span className="text-xl font-bold text-yellow-400 flex items-center gap-1">
                      <Zap className="w-5 h-5" />
                      {userPoints.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Order Total</span>
                    <span className="text-xl font-bold text-white">{total} pts</span>
                  </div>
                  <div className="h-px bg-border my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">After Purchase</span>
                    <span className={`text-xl font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                      {userPoints - total} pts
                    </span>
                  </div>
                </div>

                {canAfford ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                    <CheckCircle className="w-4 h-4" />
                    You have enough points for this purchase
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                    <AlertCircle className="w-4 h-4" />
                    You need {total - userPoints} more points
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={!canAfford || processing}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    canAfford
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark hover:from-yellow-500 hover:to-yellow-600'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : canAfford ? (
                    `Pay ${total} Points`
                  ) : (
                    'Insufficient Points'
                  )}
                </button>

                {!canAfford && (
                  <Link
                    href="/topup"
                    className="block text-center mt-3 text-primary text-sm hover:underline"
                  >
                    Top up points →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
