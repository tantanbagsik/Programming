import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Enrollment from '@/models/Enrollment'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

async function checkAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'admin') return null
  return session
}

// GET /api/admin/users
export async function GET(req: NextRequest) {
  try {
    const session = await checkAdmin(req)
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const search = searchParams.get('search')
    const role = searchParams.get('role')

    const query: any = {}
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
    if (role) query.role = role

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password')
        .lean(),
      User.countDocuments(query),
    ])

    // Get enrollment counts for each user
    const userIds = users.map((u: any) => u._id)
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { user: { $in: userIds }, status: 'active' } },
      { $group: { _id: '$user', count: { $sum: 1 } } }
    ])
    
    const countMap = Object.fromEntries(enrollmentCounts.map((e: any) => [e._id.toString(), e.count]))
    
    const usersWithEnrollments = users.map((u: any) => ({
      ...u,
      _id: u._id.toString(),
      enrollmentCount: countMap[u._id.toString()] || 0
    }))

    return NextResponse.json({
      users: usersWithEnrollments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// PATCH /api/admin/users — update user role
export async function PATCH(req: NextRequest) {
  try {
    const session = await checkAdmin(req)
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId, role } = await req.json()
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
