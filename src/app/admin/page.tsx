import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight, Video } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard' }

async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/stats`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (!session || user?.role !== 'admin') redirect('/')

  const data = await getStats()
  const stats = data?.stats

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', sub: `+${stats?.newUsersThisMonth ?? 0} this month`, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Published Courses', value: stats?.publishedCourses ?? '—', sub: `${stats?.totalCourses ?? 0} total`, icon: BookOpen, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Total Enrollments', value: stats?.totalEnrollments ?? '—', sub: `+${stats?.enrollmentsThisMonth ?? 0} this month`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Revenue (month)', value: `$${(stats?.revenueThisMonth ?? 0).toLocaleString()}`, sub: 'Stripe payments', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10' },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-sora font-bold text-3xl mb-1">Admin <span className="gradient-text">Dashboard</span></h1>
              <p className="text-gray-400 text-sm">Overview of platform activity</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/courses" className="btn-outline text-sm">Manage Courses</Link>
              <Link href="/admin/users" className="btn-primary text-sm">Manage Users</Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cards.map((c, i) => (
              <div key={i} className="glow-card p-5">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <div className="font-sora font-bold text-2xl mb-0.5">{c.value}</div>
                <div className="text-gray-500 text-xs">{c.label}</div>
                <div className="text-gray-600 text-xs mt-1">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top courses */}
            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-sora font-semibold text-lg">Top Courses</h2>
                <Link href="/admin/courses" className="text-primary text-xs flex items-center gap-1 hover:underline">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {(data?.topCourses ?? []).map((c: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-gray-600 font-mono text-sm w-4">{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">📚</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{c.title}</div>
                      <div className="text-gray-500 text-xs">{c.category} • ⭐ {c.rating?.toFixed(1)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-sora font-semibold text-sm">{c.enrollmentCount}</div>
                      <div className="text-gray-500 text-xs">students</div>
                    </div>
                  </div>
                ))}
                {!data?.topCourses?.length && <p className="text-gray-500 text-sm text-center py-4">No courses yet</p>}
              </div>
            </div>

            {/* Recent users */}
            <div className="glow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-sora font-semibold text-lg">Recent Users</h2>
                <Link href="/admin/users" className="text-primary text-xs flex items-center gap-1 hover:underline">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {(data?.recentUsers ?? []).map((u: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{u.name}</div>
                      <div className="text-gray-500 text-xs truncate">{u.email}</div>
                    </div>
                    <span className={`badge text-xs ${
                      u.role === 'admin' ? 'text-accent border-accent/30 bg-accent/10' :
                      u.role === 'instructor' ? 'text-secondary border-secondary/30 bg-secondary/10' :
                      'text-gray-400 border-gray-600 bg-gray-800'
                    }`}>{u.role}</span>
                  </div>
                ))}
                {!data?.recentUsers?.length && <p className="text-gray-500 text-sm text-center py-4">No users yet</p>}
              </div>
            </div>
          </div>

           {/* Quick links */}
           <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
             {[
               { href: '/admin/users', label: 'Manage Users', icon: '👥' },
               { href: '/admin/courses', label: 'Manage Courses', icon: '📚' },
               { href: '/admin/video-call', label: 'Video Calls', icon: '📹' },
               { href: '/admin/payments', label: 'View Payments', icon: '💳' },
               { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
               { href: '/admin/settings/cloudinary', label: 'Cloudinary', icon: '☁️' },
             ].map((l, i) => (
               <Link key={i} href={l.href} className="glow-card p-4 flex items-center gap-3 hover:border-primary/50 transition-all group">
                 <span className="text-2xl">{l.icon}</span>
                 <span className="text-sm font-medium group-hover:text-white transition-colors">{l.label}</span>
               </Link>
             ))}
           </div>
        </div>
      </div>
    </>
  )
}
