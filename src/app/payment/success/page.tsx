import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="glow-card p-12">
          <div className="w-20 h-20 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-6 animate-glow">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-sora font-bold text-3xl mb-3">You're enrolled! 🎉</h1>
          <p className="text-gray-400 mb-8">
            Your payment was successful. You now have full access to the course. Happy learning!
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/courses" className="btn-primary text-center">Go to My Courses</Link>
            <Link href="/courses" className="btn-outline text-center">Browse More Courses</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
