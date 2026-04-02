import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import { Program, Question } from '@/models/Program'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string, programId: string } }
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

    const program = await Program.findById(params.programId)
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Verify program belongs to course
    if (program.courseId.toString() !== params.id) {
      return NextResponse.json(
        { error: 'Program does not belong to this course' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { title, description, type, questions, passingScore, order } = body

    // Update program fields
    if (title !== undefined) program.title = title
    if (description !== undefined) program.description = description
    if (type !== undefined) program.type = type as 'quiz' | 'exercise' | 'assignment'
    if (passingScore !== undefined) program.passingScore = passingScore
    if (order !== undefined) program.order = order

    // Handle questions update
    if (questions !== undefined && Array.isArray(questions)) {
      // Delete old questions
      await Question.deleteMany({ _id: { $in: program.questions } })
      
      // Create new questions
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
      program.questions = createdQuestions.map(q => q._id)
    }

    await program.save()

    // Populate questions for response
    const updatedProgram = await Program.findById(program._id)
      .populate('questions')
      .lean()

    return NextResponse.json({ program: updatedProgram })
  } catch (error) {
    console.error('[ADMIN COURSE PROGRAM PUT]', error)
    return NextResponse.json(
      { error: 'Failed to update program: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string, programId: string } }
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

    const program = await Program.findById(params.programId)
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Verify program belongs to course
    if (program.courseId.toString() !== params.id) {
      return NextResponse.json(
        { error: 'Program does not belong to this course' },
        { status: 400 }
      )
    }

    // Delete associated questions
    await Question.deleteMany({ _id: { $in: program.questions } })
    
    // Delete the program
    await Program.findByIdAndDelete(params.programId)

    return NextResponse.json({ message: 'Program deleted successfully' })
  } catch (error) {
    console.error('[ADMIN COURSE PROGRAM DELETE]', error)
    return NextResponse.json(
      { error: 'Failed to delete program: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}