import mongoose, { Document, Model, Schema } from 'mongoose'

// ============ REVIEW MODEL ============
export interface IReview extends Document {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
)

ReviewSchema.index({ user: 1, course: 1 }, { unique: true })
ReviewSchema.index({ course: 1, rating: -1 })

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

// ============ PAYMENT MODEL ============
export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  course: mongoose.Types.ObjectId
  stripeSessionId: string
  stripePaymentIntentId?: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

PaymentSchema.index({ user: 1, status: 1 })
PaymentSchema.index({ stripeSessionId: 1 })

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)
