import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { z } from 'zod'

const ProfileSchema = z.object({
  name: z.string().min(2).max(80),
  bio: z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionUser = session.user as any

    const body = await req.json()
    const { name, bio } = ProfileSchema.parse(body)

    await connectDB()
    const user = await User.findByIdAndUpdate(
      sessionUser.id,
      { name, ...(bio !== undefined && { bio }) },
      { new: true }
    ).select('-password')

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
