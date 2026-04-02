import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Program, { Question } from '@/models/Program'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const course = await Course.findById(params.id)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const programs = await Program.find({ courseId: params.id })
      .populate('questions')
      .sort({ order: 1 })
      .lean()

    return NextResponse.json({ programs })
  } catch (error) {
    console.error('[ADMIN COURSE PROGRAMS GET]', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const course = await Course.findById(params.id)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const body = await req.json()
    const { title, description, type, questions, passingScore, order } = body

    // Validate required fields
    if (!title || !type || !order) {
      return NextResponse.json(
        { error: 'Title, type, and order are required' },
        { status: 400 }
      )
    }

    // Create questions first if provided
    let questionIds: any[] = []
    if (questions && Array.isArray(questions)) {
      const createdQuestions = await Question.insertMany(
        questions.map((q: any) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
          explanation: q.explanation,
          hint: q.hint
        }))
      )
      questionIds = createdQuestions.map(q => q._id)
    }

    // Get the highest order to determine where to place this program
    const highestOrderProgram = await Program.findOne(
      { courseId: params.id }
    ).sort({ order: -1 })

    const programOrder = order !== undefined ? order : 
      (highestOrderProgram ? highestOrderProgram.order + 1 : 1)

    const program = await Program.create({
      title,
      description,
      type: type as 'quiz' | 'exercise' | 'assignment',
      questions: questionIds,
      passingScore: passingScore || 80,
      courseId: params.id,
      order: programOrder
    })

    // Populate questions for response
    const populatedProgram = await Program.findById(program._id)
      .populate('questions')
      .lean()

    return NextResponse.json({ program: populatedProgram }, { status: 201 })
  } catch (error) {
    console.error('[ADMIN COURSE PROGRAMS POST]', error)
    return NextResponse.json(
      { error: 'Failed to create program: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}