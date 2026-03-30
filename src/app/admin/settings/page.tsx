import Link from 'next/link'
import { 
  Settings, 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Upload,
  ArrowRight
} from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <>
      <div className="min-h-screen bg-dark">
        {/* Header */}
        <div className="bg-card border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-border rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="font-sora font-bold text-lg">Settings</h1>
                  <p className="text-gray-400 text-xs">Manage your EduLearn platform configuration</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sora font-semibold text-xl">General Settings</h2>
                <Link href="/admin/settings/general" className="btn-outline flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Configure
                </Link>
              </div>
              <p className="text-gray-400">Configure site-wide settings such as site name, contact information, and basic preferences.</p>
            </div>

            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sora font-semibold text-xl">User Management</h2>
                <Link href="/admin/users" className="btn-outline flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Manage Users
                </Link>
              </div>
              <p className="text-gray-400">Manage instructor, student, and administrator accounts.</p>
            </div>

            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sora font-semibold text-xl">Cloudinary Integration</h2>
                <Link href="/admin/settings/cloudinary" className="btn-outline flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Configure
                </Link>
              </div>
              <p className="text-gray-400">Set up Cloudinary for image and video uploads, including course media and user avatars.</p>
            </div>

            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sora font-semibold text-xl">Payment Settings</h2>
                <Link href="/admin/settings/payments" className="btn-outline flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Configure
                </Link>
              </div>
              <p className="text-gray-400">Configure payment gateways (Stripe, PayPal) for course purchases and subscriptions.</p>
            </div>

            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sora font-semibold text-xl">Email & Notifications</h2>
                <Link href="/admin/settings/notifications" className="btn-outline flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Configure
                </Link>
              </div>
              <p className="text-gray-400">Set up email templates, notification preferences, and integration with email services.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}