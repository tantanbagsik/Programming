import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

// GET /api/chat/users — list users available for chat
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = session.user as any

    await connectDB()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''

    const query: any = { _id: { $ne: user.id } }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(query)
      .select('name email image role')
      .limit(20)
      .lean()

    return NextResponse.json({ users })
  } catch (error) {
    console.error('[CHAT USERS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
