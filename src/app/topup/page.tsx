'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, ArrowLeft, CreditCard, Zap, Gift, CheckCircle, History } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

declare global {
  interface Window {
    paypal: any
  }
}

const POINTS_PACKAGES = [
  { points: 100, price: 10, bonus: 0, popular: false },
  { points: 500, price: 45, bonus: 25, popular: false },
  { points: 1000, price: 85, bonus: 100, popular: true },
  { points: 2500, price: 200, bonus: 300, popular: false },
  { points: 5000, price: 380, bonus: 700, popular: false },
]

export default function TopUpPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState(POINTS_PACKAGES[2])
  const [processing, setProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/topup')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPoints()
    }
  }, [status])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'}&currency=USD`
    script.async = true
    script.onload = () => setPaypalLoaded(true)
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !selectedPackage) return

    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: selectedPackage.price.toFixed(2) },
            description: `${selectedPackage.points + selectedPackage.bonus} Points Top Up`
          }]
        })
      },
      onApprove: async (data: any, actions: any) => {
        setProcessing(true)
        try {
          const order = await actions.order.capture()
          
          const totalPoints = selectedPackage.points + selectedPackage.bonus
          
          const res = await fetch('/api/points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: totalPoints,
              paymentId: order.id
            })
          })

          const result = await res.json()

          if (result.success) {
            setPoints(result.points)
            toast.success(`🎉 Successfully added ${totalPoints} points to your account!`)
            fetchPoints()
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          console.error('Payment error:', error)
          toast.error('Payment processing failed. Please contact support.')
        } finally {
          setProcessing(false)
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err)
        toast.error('Payment failed. Please try again.')
        setProcessing(false)
      }
    }).render('#paypal-button-container')
  }, [paypalLoaded, selectedPackage])

  const fetchPoints = async () => {
    try {
      const res = await fetch('/api/points')
      const data = await res.json()
      setPoints(data.points || 0)
      setHistory(data.history || [])
    } catch (error) {
      console.error('Error fetching points:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-sora font-bold text-3xl flex items-center gap-2">
                <Zap className="w-7 h-7 text-yellow-400" />
                Top Up Points
              </h1>
              <p className="text-gray-400 text-sm">Add points to your account to purchase courses</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sora font-semibold text-lg">Select Points Package</h2>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Your Balance</p>
                    <p className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                      <Zap className="w-5 h-5" />
                      {points.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {POINTS_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.points}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPackage.points === pkg.points
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-border hover:border-yellow-400/50'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2 right-2 text-xs bg-yellow-400 text-dark px-2 py-0.5 rounded-full font-bold">
                          POPULAR
                        </span>
                      )}
                      {pkg.bonus > 0 && (
                        <span className="absolute -top-2 left-2 text-xs bg-green-400 text-dark px-2 py-0.5 rounded-full font-bold">
                          +{pkg.bonus} BONUS
                        </span>
                      )}
                      <div className="text-2xl font-bold text-white mb-1">
                        {pkg.points.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">points</div>
                      <div className="text-yellow-400 font-semibold mt-2">
                        ${pkg.price}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">You'll receive</p>
                      <p className="text-2xl font-bold text-green-400 flex items-center gap-1">
                        <Zap className="w-6 h-6" />
                        {(selectedPackage.points + selectedPackage.bonus).toLocaleString()} Points
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Price</p>
                      <p className="text-2xl font-bold text-white">${selectedPackage.price}</p>
                    </div>
                  </div>

                  <div className="bg-dark rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-3">Pay with PayPal</p>
                    <div id="paypal-button-container" className="min-h-[50px]"></div>
                    {processing && (
                      <div className="flex items-center justify-center gap-2 text-primary mt-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Processing payment...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="glow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <h2 className="font-sora font-semibold text-lg">How Points Work</h2>
                </div>
                <div className="space-y-3 text-gray-400 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <p>1 point = $1 USD value for course purchases</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <p>Buy bonus points with selected packages and save more</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <p>Points never expire - use them anytime</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="glow-card p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-gray-400" />
                  <h2 className="font-sora font-semibold text-lg">Recent Transactions</h2>
                </div>
                {history.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.slice(0, 10).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-dark/50">
                        <div>
                          <p className="text-gray-300">{item.description}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-semibold ${item.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.amount > 0 ? '+' : ''}{item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
