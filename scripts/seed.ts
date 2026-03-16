import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local')

// ---- Inline schemas for seeder ----
const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'student' }, image: String }, { timestamps: true })
const CourseSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, description: String, shortDescription: String,
  thumbnail: String, instructor: mongoose.Types.ObjectId, category: String, tags: [String],
  level: String, price: Number, discountPrice: Number, currency: { type: String, default: 'usd' },
  isPublished: { type: Boolean, default: true }, isFeatured: Boolean,
  enrollmentCount: { type: Number, default: 0 }, rating: { type: Number, default: 0 }, reviewCount: { type: Number, default: 0 },
  totalLessons: Number, totalDuration: Number,
  requirements: [String], whatYouLearn: [String],
  sections: [{
    title: String, order: Number,
    lessons: [{ title: String, description: String, videoUrl: String, duration: Number, order: Number, isFree: Boolean }]
  }]
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  // Clear existing data
  await User.deleteMany({})
  await Course.deleteMany({})
  console.log('🗑️  Cleared existing data')

  // Create users
  const hashedPass = await bcrypt.hash('Password123!', 12)
  const [admin, instructor1, instructor2] = await User.insertMany([
    { name: 'Admin User', email: 'admin@edulearn.com', password: hashedPass, role: 'admin' },
    { name: 'Sarah Johnson', email: 'sarah@edulearn.com', password: hashedPass, role: 'instructor', image: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Marcus Chen', email: 'marcus@edulearn.com', password: hashedPass, role: 'instructor', image: 'https://i.pravatar.cc/150?u=marcus' },
    { name: 'Test Student', email: 'student@edulearn.com', password: hashedPass, role: 'student' },
  ])
  console.log('👤 Created users')

  // Create courses
  const courses = [
    {
      title: 'Complete React & Next.js Developer',
      slug: 'react-nextjs-developer',
      shortDescription: 'Master React 18, Next.js 14, TypeScript, and modern tooling in one comprehensive course.',
      description: 'This comprehensive course takes you from React fundamentals all the way to building production-ready Next.js applications.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      instructor: instructor1._id,
      category: 'Development', tags: ['react', 'nextjs', 'typescript', 'javascript'],
      level: 'beginner', price: 49, discountPrice: 49,
      enrollmentCount: 12400, rating: 4.9, reviewCount: 3200,
      isFeatured: true,
      requirements: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals'],
      whatYouLearn: ['Build full-stack apps with Next.js', 'Master React hooks and state management', 'TypeScript from scratch', 'Deploy to Vercel'],
      totalLessons: 124, totalDuration: 3120,
      sections: [
        { title: 'React Fundamentals', order: 1, lessons: [
          { title: 'What is React?', description: 'Intro to React', duration: 8, order: 1, isFree: true },
          { title: 'JSX Deep Dive', description: 'Understanding JSX', duration: 12, order: 2, isFree: true },
          { title: 'Components & Props', description: 'Building components', duration: 20, order: 3, isFree: false },
        ]},
        { title: 'Next.js 14', order: 2, lessons: [
          { title: 'App Router', description: 'The new App Router', duration: 25, order: 1, isFree: false },
          { title: 'Server Components', description: 'RSC explained', duration: 30, order: 2, isFree: false },
        ]},
      ],
    },
    {
      title: 'UI/UX Design Mastery with Figma',
      slug: 'uiux-design-figma',
      shortDescription: 'Learn professional UI/UX design from wireframing to polished prototypes using Figma.',
      description: 'Become a professional UI/UX designer with this hands-on Figma course.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      instructor: instructor2._id,
      category: 'Design', tags: ['figma', 'ui', 'ux', 'design'],
      level: 'all-levels', price: 39, discountPrice: 39,
      enrollmentCount: 8900, rating: 4.8, reviewCount: 2100,
      isFeatured: true,
      requirements: ['No prior design experience needed', 'A computer with Figma installed'],
      whatYouLearn: ['Design beautiful interfaces in Figma', 'Create interactive prototypes', 'User research & testing', 'Design systems'],
      totalLessons: 88, totalDuration: 2280,
      sections: [
        { title: 'Design Fundamentals', order: 1, lessons: [
          { title: 'Design Principles', description: 'Core design theory', duration: 15, order: 1, isFree: true },
          { title: 'Color Theory', description: 'Using color effectively', duration: 18, order: 2, isFree: true },
        ]},
      ],
    },
    {
      title: 'Machine Learning & AI Bootcamp',
      slug: 'machine-learning-ai',
      shortDescription: 'Complete ML bootcamp covering supervised learning, neural networks, and deploying AI models.',
      description: 'Master machine learning from the ground up with Python, scikit-learn, and PyTorch.',
      thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
      instructor: instructor1._id,
      category: 'Data Science', tags: ['python', 'machine-learning', 'ai', 'pytorch'],
      level: 'intermediate', price: 79, discountPrice: 79,
      enrollmentCount: 21300, rating: 4.9, reviewCount: 5400,
      isFeatured: true,
      requirements: ['Python basics', 'High school math (algebra)'],
      whatYouLearn: ['Linear & logistic regression', 'Neural networks & deep learning', 'Natural language processing', 'Deploy ML models'],
      totalLessons: 156, totalDuration: 4080,
      sections: [
        { title: 'Python for ML', order: 1, lessons: [
          { title: 'NumPy & Pandas', description: 'Data manipulation', duration: 35, order: 1, isFree: true },
        ]},
      ],
    },
    {
      title: 'Python for Everybody — Zero to Hero',
      slug: 'python-zero-to-hero',
      shortDescription: 'Complete Python programming course from absolute beginner to advanced concepts.',
      description: 'Learn Python programming from scratch. Perfect for beginners with no prior coding experience.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
      instructor: instructor2._id,
      category: 'Development', tags: ['python', 'programming', 'beginner'],
      level: 'beginner', price: 0,
      enrollmentCount: 34100, rating: 4.7, reviewCount: 8900,
      totalLessons: 98, totalDuration: 2700,
      sections: [
        { title: 'Getting Started', order: 1, lessons: [
          { title: 'Installing Python', description: 'Setup your environment', duration: 10, order: 1, isFree: true },
          { title: 'Variables & Data Types', description: 'Python basics', duration: 20, order: 2, isFree: true },
        ]},
      ],
    },
  ]

  await Course.insertMany(courses)
  console.log('📚 Created courses')

  console.log('\n🎉 Database seeded successfully!\n')
  console.log('Test accounts:')
  console.log('  Admin:      admin@edulearn.com    / Password123!')
  console.log('  Instructor: sarah@edulearn.com    / Password123!')
  console.log('  Student:    student@edulearn.com  / Password123!')

  await mongoose.disconnect()
}

seed().catch(console.error)
