import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { z } from 'zod'

const PasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionUser = session.user as any

    const { currentPassword, newPassword } = PasswordSchema.parse(await req.json())

    await connectDB()
    const user = await User.findById(sessionUser.id).select('+password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!user.password) return NextResponse.json({ error: 'Cannot change password for OAuth accounts' }, { status: 400 })

    const valid = await user.comparePassword(currentPassword)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

    user.password = newPassword
    await user.save()

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}
