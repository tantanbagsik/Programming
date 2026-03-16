import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import Course from '@/models/Course'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, courseId, status } = await req.json()

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID required' }, { status: 400 })
    }

    await connectDB()

    const course = await Course.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user: userId, course: courseId })
    if (existing) {
      return NextResponse.json({ error: 'User already enrolled in this course' }, { status: 409 })
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      status: status === 'pending' ? 'active' : status, // pending still stores as active but could track separately
      progress: 0,
      amountPaid: status === 'pending' ? 0 : (course.discountPrice ?? course.price),
      currency: course.currency ?? 'usd',
      lastAccessedAt: new Date()
    })

    // If active, increment enrollment count
    if (status === 'active') {
      await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } })
    }

    return NextResponse.json({ 
      enrollment: { ...enrollment.toObject(), _id: enrollment._id.toString() },
      message: status === 'pending' ? 'Enrollment pending payment' : 'User enrolled successfully'
    })
  } catch (error) {
    console.error('[ADMIN ENROLLMENT ERROR]', error)
    return NextResponse.json({ error: 'Failed to enroll user' }, { status: 500 })
  }
}