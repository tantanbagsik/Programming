import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-sora font-bold text-8xl gradient-text mb-4">404</div>
        <h1 className="font-sora font-bold text-3xl mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <Link href="/courses" className="btn-outline">Browse Courses</Link>
        </div>
      </div>
    </div>
  )
}
