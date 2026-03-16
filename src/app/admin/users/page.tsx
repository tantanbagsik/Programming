'use client'
import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Search, Loader2, ChevronLeft, Shield, GraduationCap, User } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const roleOptions = ['All', 'student', 'instructor', 'admin']

const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  admin: { label: 'Admin', color: 'text-accent border-accent/30 bg-accent/10', icon: Shield },
  instructor: { label: 'Instructor', color: 'text-secondary border-secondary/30 bg-secondary/10', icon: GraduationCap },
  student: { label: 'Student', color: 'text-gray-400 border-gray-600 bg-gray-800', icon: User },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        ...(search && { search }),
        ...(role !== 'All' && { role }),
      })
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users ?? [])
      setTotalPages(data.pagination?.totalPages ?? 1)
      setTotal(data.pagination?.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, search, role])

  useEffect(() => { fetchUsers() }, [fetchUsers])
  useEffect(() => { setPage(1) }, [search, role])

  async function updateRole(userId: string, newRole: string) {
    setUpdating(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        toast.success(`Role updated to ${newRole}`)
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
      } else {
        toast.error('Failed to update role')
      }
    } finally {
      setUpdating(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-sora font-bold text-2xl">User Management</h1>
                <p className="text-gray-400 text-sm">{total.toLocaleString()} total users</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-base pl-10 py-2.5 text-sm"
              />
            </div>
            <div className="flex gap-2">
              {roleOptions.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                    role === r ? 'bg-primary text-white' : 'border border-border text-gray-400 hover:border-primary/50 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="glow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-black/20">
                    <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3">User</th>
                    <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3">Email</th>
                    <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3">Role</th>
                    <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3">Joined</th>
                    <th className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500 text-sm">No users found</td>
                    </tr>
                  ) : (
                    users.map(user => {
                      const rc = roleConfig[user.role] ?? roleConfig.student
                      const RoleIcon = rc.icon
                      return (
                        <tr key={user._id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {user.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-sm font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-400">{user.email}</td>
                          <td className="px-5 py-4">
                            <span className={`badge text-xs flex items-center gap-1 w-fit ${rc.color}`}>
                              <RoleIcon className="w-3 h-3" /> {rc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {updating === user._id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              ) : (
                                <select
                                  value={user.role}
                                  onChange={e => updateRole(user._id, e.target.value)}
                                  className="bg-card border border-border rounded-lg px-2 py-1 text-xs text-gray-300 cursor-pointer hover:border-primary/50 focus:outline-none focus:border-primary/60"
                                >
                                  <option value="student">Student</option>
                                  <option value="instructor">Instructor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-border">
                <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40">← Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-1.5 px-3 text-xs disabled:opacity-40">Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
