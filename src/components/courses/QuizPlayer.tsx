'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Clock, AlertCircle, Trophy, RotateCcw } from 'lucide-react'

interface QuizPlayerProps {
  course: any
  enrollment: any
  lesson: any
  userId: string
  onComplete: (lessonId: string) => void
  completedLessons: Set<string>
}

interface Question {
  id: string
  question: string
  options?: string[]
  points: number
}

interface Program {
  id: string
  title: string
  description: string
  type: 'quiz' | 'exercise' | 'assignment'
  passingScore: number
  timeLimit?: number
  maxAttempts?: number
  randomizeQuestions: boolean
}

interface QuizAttempt {
  id: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  attemptNumber: number
  questionResults: Array<{
    questionId: string
    answer: any
    isCorrect: boolean
    points: number
    earned: number
  }>
}

export function QuizPlayer({ course, enrollment, lesson, userId, onComplete, completedLessons }: QuizPlayerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [program, setProgram] = useState<Program | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [attemptHistory, setAttemptHistory] = useState<QuizAttempt[]>([])
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Fetch quiz data
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/courses/${course.slug}/quizzes/${lesson.programId}`)
        const data = await res.json()
        
        if (!res.ok) {
          toast.error(data.error || 'Failed to load quiz')
          return
        }

        setProgram(data.program)
        
        // Randomize questions if enabled
        let fetchedQuestions = data.questions
        if (data.program.randomizeQuestions) {
          fetchedQuestions = [...data.questions].sort(() => Math.random() - 0.5)
        }
        
        setQuestions(fetchedQuestions)
      } catch (error) {
        console.error('Error fetching quiz:', error)
        toast.error('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    if (lesson.programId) {
      fetchQuiz()
    }
  }, [course.slug, lesson.programId])

  // Timer
  useEffect(() => {
    if (!loading && !showResults && program?.timeLimit) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [loading, showResults, program?.timeLimit])

  // Check if already completed
  useEffect(() => {
    if (completedLessons.has(lesson._id)) {
      // Fetch last attempt to show results
      fetchAttemptHistory()
    }
  }, [lesson._id, completedLessons])

  async function fetchAttemptHistory() {
    try {
      const res = await fetch(`/api/users/${userId}/quiz-attempts/${lesson.programId}`)
      const data = await res.json()
      if (res.ok && data.attempts?.length > 0) {
        setAttemptHistory(data.attempts)
        setLastAttempt(data.attempts[0]) // Most recent attempt
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error fetching attempts:', error)
    }
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const submitQuiz = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`)
      return
    }

    setSubmitting(true)
    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id]
      }))

      const res = await fetch(`/api/courses/${course.slug}/quizzes/${lesson.programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: formattedAnswers,
          timeTaken: timeElapsed
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to submit quiz')
        return
      }

      // Mark lesson as complete if passed
      if (data.attempt.passed) {
        onComplete(lesson._id)
        toast.success(`🎉 Quiz passed! Score: ${data.attempt.percentage.toFixed(1)}%`)
      } else {
        toast.error(`Quiz failed. You need ${program?.passingScore}% to pass. Your score: ${data.attempt.percentage.toFixed(1)}%`)
      }

      setLastAttempt(data.attempt)
      setShowResults(true)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const retakeQuiz = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setTimeElapsed(0)
    setShowResults(false)
    setLastAttempt(null)
    
    // Randomize again if enabled
    if (program?.randomizeQuestions) {
      setQuestions([...questions].sort(() => Math.random() - 0.5))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (showResults && lastAttempt) {
    return (
      <div className="glow-card p-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            lastAttempt.passed ? 'bg-green-400/20' : 'bg-red-400/20'
          }`}>
            {lastAttempt.passed ? (
              <Trophy className="w-10 h-10 text-green-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-400" />
            )}
          </div>
          <h2 className="font-sora font-bold text-2xl mb-2">
            {lastAttempt.passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h2>
          <p className="text-gray-400 mb-4">
            {lastAttempt.passed 
              ? 'Congratulations! You have passed this quiz.' 
              : `You need ${program?.passingScore}% to pass. Try again!`}
          </p>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{lastAttempt.percentage.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{lastAttempt.score}/{lastAttempt.totalPoints}</p>
              <p className="text-xs text-gray-500">Points</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">#{lastAttempt.attemptNumber}</p>
              <p className="text-xs text-gray-500">Attempt</p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-sm">Review Your Answers</h3>
          {lastAttempt.questionResults.map((result, index) => {
            const question = questions.find(q => q.id === result.questionId)
            return (
              <div key={result.questionId} className={`p-4 rounded-lg border ${
                result.isCorrect ? 'border-green-400/30 bg-green-400/10' : 'border-red-400/30 bg-red-400/10'
              }`}>
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">
                      {index + 1}. {question?.question}
                    </p>
                    <p className="text-xs text-gray-400">
                      Your answer: {question?.id ? formatAnswer(question, answers[question.id]) : 'No answer'}
                    </p>
                    {!result.isCorrect && (
                      <p className="text-xs text-red-400 mt-1">
                        Incorrect - {result.points} points
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!lastAttempt.passed && (
            <button onClick={retakeQuiz} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          )}
          {lastAttempt.passed && (
            <button 
              onClick={() => router.push(`/dashboard/courses/${course.slug}`)}
              className="btn-primary flex-1"
            >
              Continue Course
            </button>
          )}
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="glow-card p-6">
      {/* Quiz Header */}
      <div className="mb-6">
        <h2 className="font-sora font-bold text-xl mb-2">{program?.title}</h2>
        <p className="text-gray-400 text-sm mb-4">{program?.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timeElapsed)}
              {program?.timeLimit && (
                <span className={timeElapsed > program.timeLimit * 60 ? 'text-red-400' : ''}>
                  / {formatTime(program.timeLimit * 60)}
                </span>
              )}
            </span>
            <span>{currentQuestionIndex + 1} of {questions.length} questions</span>
          </div>
          <span>Passing: {program?.passingScore}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-medium mb-4">{currentQuestion?.question}</p>
        
        {currentQuestion?.options ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  answers[currentQuestion.id] === index.toString()
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index.toString()}
                  checked={answers[currentQuestion.id] === index.toString()}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Type your answer here..."
            className="input-base"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="btn-outline px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            className="btn-primary px-4 py-2"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            disabled={submitting}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit Quiz
              </>
            )}
          </button>
        )}
      </div>

      {/* Question navigator dots */}
      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              index === currentQuestionIndex
                ? 'bg-primary text-white'
                : answers[q.id]
                ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                : 'bg-border text-gray-400 hover:bg-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

function formatAnswer(question: Question | undefined, answer: any) {
  if (!question || answer === undefined) return 'No answer'
  
  if (question.options && question.options.length > 0) {
    // Multiple choice - answer is index
    const indices = Array.isArray(answer) ? answer : [answer]
    return indices.map(i => question.options![i]).join(', ') || 'No answer'
  }
  
  return answer?.toString() || 'No answer'
}
