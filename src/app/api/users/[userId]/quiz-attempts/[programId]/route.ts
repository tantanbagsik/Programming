import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import UserQuizAttempt from '@/models/UserQuizAttempt'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

// GET /api/users/[userId]/quiz-attempts/[programId] - Get user's quiz attempts
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string, programId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only view their own attempts unless they're admin
    if (user.id !== params.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const attempts = await UserQuizAttempt.find({
      userId: params.userId,
      programId: params.programId
    })
      .sort({ completedAt: -1 })
      .lean()

    return NextResponse.json({ 
      attempts: attempts.map((a: any) => ({
        ...a,
        _id: a._id.toString(),
        userId: a.userId.toString(),
        programId: a.programId.toString(),
        courseId: a.courseId.toString()
      }))
    })
  } catch (error) {
    console.error('[USER QUIZ ATTEMPTS GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}