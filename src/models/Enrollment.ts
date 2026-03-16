import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ILessonProgress {
  lessonId: string
  completedAt: Date | null
  watchedSeconds: number
}

export interface IEnrollment extends Document {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  status: 'active' | 'completed' | 'refunded'
  progress: number // 0-100
  lessonsProgress: ILessonProgress[]
  lastAccessedAt: Date
  completedAt?: Date
  paymentId?: string
  amountPaid: number
  currency: string
  certificateUrl?: string
  createdAt: Date
  updatedAt: Date
}

const LessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: String, required: true },
  completedAt: { type: Date, default: null },
  watchedSeconds: { type: Number, default: 0 },
})

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['active', 'completed', 'refunded'], default: 'active' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    lessonsProgress: [LessonProgressSchema],
    lastAccessedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    paymentId: { type: String },
    amountPaid: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    certificateUrl: { type: String },
  },
  { timestamps: true }
)

// Unique enrollment per user+course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true })
EnrollmentSchema.index({ user: 1, status: 1 })

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)
export default Enrollment
