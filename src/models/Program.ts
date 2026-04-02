import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId
  question: string
  options?: string[] // For multiple choice questions
  correctAnswer: string | string[] // String for text answer, array for multiple correct answers
  points: number
  // Additional metadata
  explanation?: string // Explanation shown after answering
  hint?: string // Optional hint
}

export interface IProgram extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  type: 'quiz' | 'exercise' | 'assignment'
  questions: mongoose.Types.ObjectId[] // References to Question documents
  passingScore: number // Percentage required to pass (0-100)
  courseId: mongoose.Types.ObjectId // Reference to Course
  order: number // Order within course
  // Settings
  timeLimit?: number // Time limit in minutes (null for no limit)
  maxAttempts?: number // Maximum attempts allowed (null for unlimited)
  showCorrectAnswers: boolean // Whether to show correct answers after submission
  randomizeQuestions: boolean // Whether to randomize question order
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String] }, // For multiple choice
  correctAnswer: { type: Schema.Types.Mixed, required: true }, // String or array
  points: { type: Number, default: 1 },
  explanation: { type: String },
  hint: { type: String }
})

const ProgramSchema = new Schema<IProgram>({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['quiz', 'exercise', 'assignment'], 
    default: 'quiz' 
  },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  passingScore: { type: Number, min: 0, max: 100, default: 80 },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, required: true },
  timeLimit: { type: Number }, // null means no limit
  maxAttempts: { type: Number }, // null means unlimited
  showCorrectAnswers: { type: Boolean, default: true },
  randomizeQuestions: { type: Boolean, default: false }
}, { timestamps: true })

// Indexes for better query performance
ProgramSchema.index({ courseId: 1, order: 1 })
ProgramSchema.index({ type: 1 })

const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema)
const Program: Model<IProgram> = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema)

export { Question, Program }
export default Program