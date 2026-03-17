import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import Course from '@/models/Course'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

// GET /api/enrollments — get current user's enrollments
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const enrollments = await Enrollment.find({ user: user.id, status: 'active' })
      .populate({
        path: 'course',
        select: 'title slug thumbnail instructor level totalLessons totalDuration category',
        populate: { path: 'instructor', select: 'name image' },
      })
      .sort({ lastAccessedAt: -1 })
      .lean()

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('[ENROLLMENTS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

// POST /api/enrollments — create enrollment (from checkout or admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const { courseId, paymentId, amount, status: enrollmentStatus } = await req.json()

    if (!courseId) return NextResponse.json({ error: 'Course ID required' }, { status: 400 })

    const existing = await Enrollment.findOne({ user: user.id, course: courseId })
    if (existing) {
      return NextResponse.json({ message: 'Already enrolled', enrollment: existing })
    }

    const enrollment = await Enrollment.create({
      user: user.id,
      course: courseId,
      status: enrollmentStatus || 'active',
      progress: 0,
      amountPaid: amount || 0,
      paymentId: paymentId || 'free',
    })

    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } })

    return NextResponse.json({ success: true, enrollment })
  } catch (error) {
    console.error('[ENROLLMENTS POST]', error)
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
  }
}
