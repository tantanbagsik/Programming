import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import User from '@/models/User'
import mongoose from 'mongoose'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    await connectDB()

    const query: any = {}
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (filter === 'published') query.isPublished = true
    if (filter === 'draft') query.isPublished = false

    const skip = (page - 1) * limit
    
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query)
    ])

    return NextResponse.json({
      courses: courses.map((c: any) => ({
        ...c,
        _id: c._id.toString(),
        instructor: c.instructor ? {
          _id: c.instructor._id?.toString(),
          name: c.instructor.name,
          email: c.instructor.email
        } : null
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('[ADMIN COURSES GET]', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, description, shortDescription, thumbnail, category, level, price, discountPrice, requirements, whatYouLearn, sections, files, ebooks, instructorId, tags, isPublished } = body

    await connectDB()

    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!description || description.trim() === '') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }

    if (!thumbnail || thumbnail.trim() === '') {
      return NextResponse.json({ error: 'Thumbnail is required' }, { status: 400 })
    }

    const courseSlug = slug?.trim() || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existing = await Course.findOne({ slug: courseSlug })
    if (existing) {
      return NextResponse.json({ error: 'Course with this slug already exists' }, { status: 409 })
    }

    // Validate sections structure
    const validatedSections = Array.isArray(sections) ? sections.map((section: any, index: number) => ({
      title: section.title || `Section ${index + 1}`,
      order: section.order || index + 1,
      lessons: Array.isArray(section.lessons) ? section.lessons.map((lesson: any, lessonIndex: number) => ({
        title: lesson.title || `Lesson ${lessonIndex + 1}`,
        description: lesson.description || '',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration || 0,
        order: lesson.order || lessonIndex + 1,
        isFree: lesson.isFree ?? false,
        resources: Array.isArray(lesson.resources) ? lesson.resources : []
      })) : []
    })) : []

    // Calculate total lessons
    const totalLessons = validatedSections.reduce((acc: number, section: any) => {
      return acc + (Array.isArray(section.lessons) ? section.lessons.length : 0)
    }, 0)

    // Process files and ebooks to match the expected schema
    const processedFiles = Array.isArray(files) ? files.map((file: any) => ({
      id: file.id || Math.random().toString(36).substr(2, 9),
      title: file.title || 'Untitled File',
      url: file.url || '',
      type: file.type || 'other'
    })) : []

    const processedEbooks = Array.isArray(ebooks) ? ebooks.map((ebook: any) => ({
      id: ebook.id || Math.random().toString(36).substr(2, 9),
      title: ebook.title || 'Untitled Ebook',
      url: ebook.url || '',
      type: ebook.type || 'other'
    })) : []

    // Combine files and ebooks
    const allFiles = [...processedFiles, ...processedEbooks]

    const course = await Course.create({
      title: title.trim(),
      slug: courseSlug,
      description: description.trim(),
      shortDescription: shortDescription?.trim() || title.substring(0, Math.min(200, title.length)),
      thumbnail: thumbnail.trim(),
      category: category?.trim() || 'Programming',
      level: (level && ['beginner', 'intermediate', 'advanced', 'all-levels'].includes(level)) ? level : 'beginner',
      language: 'English',
      price: typeof price === 'number' && !isNaN(price) ? Math.max(0, price) : 0,
      discountPrice: typeof discountPrice === 'number' && !isNaN(discountPrice) && discountPrice >= 0 ? discountPrice : undefined,
      currency: 'usd',
      requirements: Array.isArray(requirements) ? requirements.filter((req: string) => typeof req === 'string' && req.trim() !== '') : [],
      whatYouLearn: Array.isArray(whatYouLearn) ? whatYouLearn.filter((learn: string) => typeof learn === 'string' && learn.trim() !== '') : [],
      sections: validatedSections,
      totalLessons: totalLessons,
      tags: Array.isArray(tags) ? tags.filter((tag: string) => typeof tag === 'string' && tag.trim() !== '') : [],
      instructor: instructorId ? new mongoose.Types.ObjectId(instructorId) : user.id,
      isPublished: Boolean(isPublished),
      files: allFiles
    })

    return NextResponse.json({ course: { ...course.toObject(), _id: course._id.toString() } }, { status: 201 })
  } catch (error) {
    console.error('[ADMIN COURSES POST]', error)
    return NextResponse.json({ error: 'Failed to create course: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
}