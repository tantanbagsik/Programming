import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import { z } from 'zod'

// GET /api/courses — list published courses with filters
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '12')
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') ?? 'popular' // popular | newest | price-asc | price-desc

    const query: any = { isPublished: true }
    if (category && category !== 'all') query.category = category
    if (level) query.level = level
    if (search) query.$text = { $search: search }

    const sortMap: Record<string, any> = {
      popular: { enrollmentCount: -1 },
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { rating: -1 },
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort(sortMap[sort] ?? sortMap.popular)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('instructor', 'name image bio')
        .lean(),
      Course.countDocuments(query),
    ])

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[COURSES GET]', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

const CreateCourseSchema = z.object({
  title: z.string().min(5),
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(20),
  thumbnail: z.string().url(),
  category: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']),
  price: z.number().min(0),
  discountPrice: z.number().optional(),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  whatYouLearn: z.array(z.string()).optional(),
})

// POST /api/courses — create new course (instructor/admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = session.user as any
    if (user.role !== 'instructor' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only instructors can create courses' }, { status: 403 })
    }

    const body = await req.json()
    const data = CreateCourseSchema.parse(body)

    await connectDB()

    // Auto-generate unique slug
    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    let slug = baseSlug
    let counter = 1
    while (await Course.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`
    }

    const course = await Course.create({ ...data, slug, instructor: user.id })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('[COURSE CREATE]', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
