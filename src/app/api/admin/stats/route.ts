import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Course from '@/models/Course'
import Enrollment from '@/models/Enrollment'
import { Payment } from '@/models/Review'
import { startOfMonth, subMonths } from 'date-fns'

function requireAdmin(session: any) {
  if (!session?.user) return false
  return (session.user as any).role === 'admin'
}

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!requireAdmin(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const now = new Date()
    const thisMonth = startOfMonth(now)
    const lastMonth = startOfMonth(subMonths(now, 1))

    const [
      totalUsers,
      newUsersThisMonth,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      enrollmentsThisMonth,
      revenueThisMonth,
      revenueLast6Months,
      topCourses,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thisMonth } }),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments({ status: { $in: ['active', 'completed'] } }),
      Enrollment.countDocuments({ createdAt: { $gte: thisMonth }, status: { $in: ['active', 'completed'] } }),
      Payment.aggregate([
        { $match: { status: 'succeeded', createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        {
          $match: {
            status: 'succeeded',
            createdAt: { $gte: startOfMonth(subMonths(now, 5)) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Course.find({ isPublished: true })
        .sort({ enrollmentCount: -1 })
        .limit(5)
        .select('title slug thumbnail enrollmentCount rating category')
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select('name email image role createdAt')
        .lean(),
    ])

    return NextResponse.json({
      stats: {
        totalUsers,
        newUsersThisMonth,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        enrollmentsThisMonth,
        revenueThisMonth: revenueThisMonth[0]?.total ?? 0,
      },
      revenueLast6Months,
      topCourses,
      recentUsers,
    })
  } catch (error) {
    console.error('[ADMIN STATS]', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
