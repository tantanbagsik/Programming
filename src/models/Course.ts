import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ILesson {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  videoUrl?: string
  duration: number // in minutes
  order: number
  isFree: boolean
  resources: { title: string; url: string }[]
}

export interface ISection {
  _id: mongoose.Types.ObjectId
  title: string
  order: number
  lessons: ILesson[]
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  previewVideoUrl?: string
  instructor: mongoose.Types.ObjectId
  category: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
  language: string
  price: number
  discountPrice?: number
  currency: string
  sections: ISection[]
  totalDuration: number // in minutes
  totalLessons: number
  requirements: string[]
  whatYouLearn: string[]
  targetAudience: string[]
  isPublished: boolean
  isFeatured: boolean
  enrollmentCount: number
  rating: number
  reviewCount: number
  stripeProductId?: string
  stripePriceId?: string
  createdAt: Date
  updatedAt: Date
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 },
  order: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  resources: [{ title: String, url: String }],
})

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  lessons: [LessonSchema],
})

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    thumbnail: { type: String, required: true },
    previewVideoUrl: { type: String },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
    },
    language: { type: String, default: 'English' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number },
    currency: { type: String, default: 'usd' },
    sections: [SectionSchema],
    totalDuration: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    requirements: [String],
    whatYouLearn: [String],
    targetAudience: [String],
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    enrollmentCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stripeProductId: { type: String },
    stripePriceId: { type: String },
  },
  { timestamps: true }
)

// Auto-generate slug from title
CourseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  // Recalculate totals
  let totalLessons = 0
  let totalDuration = 0
  this.sections.forEach((section) => {
    totalLessons += section.lessons.length
    section.lessons.forEach((lesson) => { totalDuration += lesson.duration })
  })
  this.totalLessons = totalLessons
  this.totalDuration = totalDuration
  next()
})

CourseSchema.index({ title: 'text', description: 'text', tags: 'text' })
CourseSchema.index({ category: 1, isPublished: 1 })
CourseSchema.index({ slug: 1 })

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
export default Course
