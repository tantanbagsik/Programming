import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = RegisterSchema.parse(body)

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const user = await User.create({ name, email, password })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('[REGISTER ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
