import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUserQuizAttempt extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId // Reference to User
  programId: mongoose.Types.ObjectId // Reference to Program
  courseId: mongoose.Types.ObjectId // Reference to Course
  score: number // Points earned
  totalPoints: number // Total possible points
  percentage: number // Score percentage
  answers: Array<{
    questionId: string
    answer: string | string[] // User's answer
    isCorrect: boolean
  }>
  completedAt: Date
  attemptNumber: number // Which attempt this is for this user/program
  timeTaken?: number // Time taken in seconds
  createdAt: Date
  updatedAt: Date
}

const UserQuizAttemptSchema = new Schema<IUserQuizAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  score: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  answers: [{
    questionId: { type: String, required: true },
    answer: { type: Schema.Types.Mixed, required: true }, // String or array
    isCorrect: { type: Boolean, required: true }
  }],
  completedAt: { type: Date, default: Date.now },
  attemptNumber: { type: Number, required: true, min: 1 },
  timeTaken: { type: Number } // Optional time taken in seconds
}, { timestamps: true })

// Indexes for better query performance
UserQuizAttemptSchema.index({ userId: 1, programId: 1 })
UserQuizAttemptSchema.index({ courseId: 1, userId: 1 })
UserQuizAttemptSchema.index({ completedAt: -1 })

const UserQuizAttempt: Model<IUserQuizAttempt> = mongoose.models.UserQuizAttempt || 
  mongoose.model<IUserQuizAttempt>('UserQuizAttempt', UserQuizAttemptSchema)

export default UserQuizAttempt