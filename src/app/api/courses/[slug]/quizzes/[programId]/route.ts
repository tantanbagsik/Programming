import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Program, { Question } from '@/models/Program'
import UserQuizAttempt from '@/models/UserQuizAttempt'
import Enrollment from '@/models/Enrollment'
import * as dns from 'dns'
dns.setServers(['1.1.1.1'])

// GET /api/courses/[slug]/quizzes/[programId] - Get quiz questions for a lesson
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string, programId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Find course by slug
    const course = await Course.findOne({ slug: params.slug })
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Find the program
    const program = await Program.findById(params.programId)
      .populate('questions')
      .lean()
    
    if (!program) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Verify program belongs to course
    if (program.courseId.toString() !== course._id.toString()) {
      return NextResponse.json(
        { error: 'Quiz does not belong to this course' },
        { status: 400 }
      )
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user: user.id,
      course: course._id
    }).lean()

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 403 }
      )
    }

    // Prepare questions for frontend (remove correct answers)
    const questionsForFrontend = program.questions.map((q: any) => ({
      id: q._id.toString(),
      question: q.question,
      options: q.options,
      points: q.points
    }))

    return NextResponse.json({
      program: {
        id: program._id.toString(),
        title: program.title,
        description: program.description,
        type: program.type,
        passingScore: program.passingScore,
        timeLimit: program.timeLimit,
        maxAttempts: program.maxAttempts,
        randomizeQuestions: program.randomizeQuestions
      },
      questions: questionsForFrontend
    })
  } catch (error) {
    console.error('[COURSE QUIZ GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}

// POST /api/courses/[slug]/quizzes/[programId] - Submit quiz answers
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string, programId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Find course by slug
    const course = await Course.findOne({ slug: params.slug })
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Find the program
    const program = await Program.findById(params.programId)
      .populate('questions')
      .lean() as any
    
    if (!program) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Verify program belongs to course
    if (program.courseId.toString() !== course._id.toString()) {
      return NextResponse.json(
        { error: 'Quiz does not belong to this course' },
        { status: 400 }
      )
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user: user.id,
      course: course._id
    }).lean()

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { answers, timeTaken } = body

    // Validate answers
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers are required and must be an array' },
        { status: 400 }
      )
    }

    // Check if user has exceeded max attempts
    if (program.maxAttempts !== null) {
      const attemptCount = await UserQuizAttempt.countDocuments({
        userId: user.id,
        programId: program._id,
        courseId: course._id
      })

      if (program.maxAttempts !== null && program.maxAttempts !== undefined && attemptCount >= program.maxAttempts) {
        return NextResponse.json(
          { error: `Maximum attempts (${program.maxAttempts}) reached for this quiz` },
          { status: 400 }
        )
      }
    }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const questionResults: { questionId: string; answer: any; isCorrect: boolean; points: number; earned: number }[] = []

    for (const answer of answers) {
      const question = program.questions.find((q: any) => q._id.toString() === answer.questionId)
      if (!question) continue

      totalPoints += question.points
      let isCorrect = false

      // Check answer based on question type
      if (question.options && question.options.length > 0) {
        // Multiple choice question
        const correctAnswers = Array.isArray(question.correctAnswer)
          ? question.correctAnswer.map((ans: any) => ans.toString())
          : [question.correctAnswer.toString()]
        
        const selectedAnswers = Array.isArray(answer.answer)
          ? answer.answer.map((ans: any) => ans.toString())
          : [answer.answer.toString()]

        isCorrect = JSON.stringify(selectedAnswers.sort()) === JSON.stringify(correctAnswers.sort())
      } else {
        // Text answer question
        const correctAnswer = question.correctAnswer?.toString().trim().toLowerCase() || ''
        const userAnswer = answer.answer?.toString().trim().toLowerCase() || ''
        isCorrect = correctAnswer === userAnswer
      }

      if (isCorrect) earnedPoints += question.points

      questionResults.push({
        questionId: question._id.toString(),
        answer: answer.answer,
        isCorrect,
        points: question.points,
        earned: isCorrect ? question.points : 0
      })
    }

    const scorePercentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = scorePercentage >= program.passingScore

    // Record the attempt
    const attemptNumber = await UserQuizAttempt.countDocuments({
      userId: user.id,
      programId: program._id,
      courseId: course._id
    }) + 1

    const quizAttempt = await UserQuizAttempt.create({
      userId: user.id,
      programId: program._id,
      courseId: course._id,
      score: earnedPoints,
      totalPoints,
      percentage: scorePercentage,
      answers: answers.map((ans: any) => ({
        questionId: ans.questionId,
        answer: ans.answer,
        isCorrect: questionResults.find(qr => qr.questionId === ans.questionId)?.isCorrect || false
      })),
      completedAt: new Date(),
      attemptNumber,
      timeTaken: timeTaken || 0
    })

    return NextResponse.json({
      success: true,
      attempt: {
        id: quizAttempt._id.toString(),
        score: earnedPoints,
        totalPoints,
        percentage: scorePercentage,
        passed,
        attemptNumber,
        questionResults
      },
      message: passed ? 'Quiz passed!' : `Quiz failed. You need ${program.passingScore}% to pass.`
    })
  } catch (error) {
    console.error('[COURSE QUIZ POST]', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}