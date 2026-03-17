import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = session.user as any

    await connectDB()
    const userData = await User.findById(user.id).select('points pointsHistory').lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      points: user.points || 0,
      history: user.pointsHistory || []
    })
  } catch (error) {
    console.error('[POINTS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = session.user as any

    const { amount, paymentId } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    await connectDB()

    const userData = await User.findByIdAndUpdate(
      user.id,
      {
        $inc: { points: amount },
        $push: {
          pointsHistory: {
            amount,
            type: 'topup',
            description: `Top up - Payment ID: ${paymentId || 'N/A'}`,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).select('points')

    return NextResponse.json({ success: true, points: userData?.points || 0 })
  } catch (error) {
    console.error('[POINTS POST]', error)
    return NextResponse.json({ error: 'Failed to add points' }, { status: 500 })
  }
}
