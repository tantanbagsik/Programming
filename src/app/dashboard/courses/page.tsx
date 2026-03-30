import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { 
  ChevronLeft, Trophy, Award, Play, Clock, 
  BookOpen, CheckCircle, Star, MoreVertical,
  Calendar, TrendingUp, Bookmark, Share2,
  ArrowRight, RotateCcw, Zap
} from 'lucide-react'

export const metadata = { title: 'My Courses' }

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')
  const user = session.user as any

  await connectDB()
  const enrollments = await Enrollment.find({ user: user.id })
    .populate({
      path: 'course',
      select: 'title slug thumbnail category level totalLessons totalDuration instructor rating reviewCount price',
      populate: { path: 'instructor', select: 'name image' },
    })
    .sort({ lastAccessedAt: -1 })
    .lean()

  const active = enrollments.filter((e: any) => e.status === 'active')
  const completed = enrollments.filter((e: any) => e.status === 'completed')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-card rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-sora font-bold text-3xl">My Learning</h1>
                <p className="text-gray-400 text-sm">{enrollments.length} courses enrolled</p>
              </div>
            </div>
            <Link href="/courses" className="btn-outline flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Browse More Courses
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="glow-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrollments.length}</p>
                <p className="text-gray-400 text-xs">Enrolled</p>
              </div>
            </div>
            <div className="glow-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{active.length}</p>
                <p className="text-gray-400 text-xs">In Progress</p>
              </div>
            </div>
            <div className="glow-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completed.length}</p>
                <p className="text-gray-400 text-xs">Completed</p>
              </div>
            </div>
            <div className="glow-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#fbbf24]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completed.length}</p>
                <p className="text-gray-400 text-xs">Certificates</p>
              </div>
            </div>
          </div>

          {/* Continue Learning CTA */}
          {active.length > 0 && (
            <div className="glow-card p-6 mb-10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-sora font-semibold text-xl mb-1">Continue Learning</h2>
                  <p className="text-gray-400 text-sm">Pick up where you left off</p>
                </div>
                <Link 
                  href={`/dashboard/courses/${active[0]?.course?.slug}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Resume Course
                </Link>
              </div>
            </div>
          )}

          {/* In Progress Courses */}
          {active.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-sora font-semibold text-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  In Progress
                  <span className="text-gray-500 text-sm font-normal">({active.length})</span>
                </h2>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-card transition-colors">
                    Recently Accessed
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {active.map((e: any) => <EnrollmentCard key={e._id} enrollment={e} />)}
              </div>
            </section>
          )}

          {/* Completed Courses */}
          {completed.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-sora font-semibold text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#fbbf24]" />
                  Completed
                  <span className="text-gray-500 text-sm font-normal">({completed.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((e: any) => <EnrollmentCard key={e._id} enrollment={e} />)}
              </div>
            </section>
          )}

          {/* Empty State */}
          {enrollments.length === 0 && (
            <div className="text-center py-20 glow-card">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-sora font-semibold text-2xl mb-3">Start Your Learning Journey</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Browse our catalog and find the perfect course to kickstart your skills.
              </p>
              <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function EnrollmentCard({ enrollment }: { enrollment: any }) {
  const course = enrollment.course
  if (!course) return null
  
  const hours = Math.round((course.totalDuration ?? 0) / 60)
  const isCompleted = enrollment.status === 'completed' || enrollment.progress >= 100
  const completedLessons = enrollment.lessonsProgress?.filter((lp: any) => lp.completedAt).length ?? 0
  
  const getLastAccessedText = () => {
    if (!enrollment.lastAccessedAt) return 'Not started'
    const date = new Date(enrollment.lastAccessedAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="glow-card overflow-hidden group hover:border-primary/30 transition-all">
      <Link href={`/dashboard/courses/${course.slug}`}>
        {/* Thumbnail */}
        <div className="h-44 bg-gradient-to-br from-primary/20 to-secondary/10 relative overflow-hidden">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>
          
          {/* Status Badge */}
          {isCompleted && (
            <div className="absolute top-3 right-3 bg-green-400/90 text-dark text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Completed
            </div>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {hours > 0 ? `${hours}h` : `${course.totalLessons || 0}m`}
          </div>
          
          {/* Progress on thumbnail */}
          {!isCompleted && (
            <div className="absolute bottom-3 right-3">
              <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center border-2 border-primary/50">
                <span className="text-sm font-bold text-primary">{enrollment.progress}%</span>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <span className="badge text-primary border-primary/30 bg-primary/10 text-xs mb-2 inline-flex">
              {course.category}
            </span>
            <h3 className="font-sora font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
          </div>
        </div>
        
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
            <span className="text-xs font-medium text-secondary">
              {course.instructor?.name?.charAt(0) || 'I'}
            </span>
          </div>
          <span className="text-gray-500 text-xs">{course.instructor?.name || 'Instructor'}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-500">{completedLessons}/{course.totalLessons || 0} lessons</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-400' : 'bg-gradient-to-r from-primary to-secondary'}`}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {hours > 0 ? `${hours}h total` : `${course.totalLessons || 0} lessons`}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {getLastAccessedText()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link 
            href={`/dashboard/courses/${course.slug}`}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
              isCompleted 
                ? 'bg-secondary/20 text-secondary hover:bg-secondary/30' 
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Review Course
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Continue
              </>
            )}
          </Link>
          
          {isCompleted && (
            <Link 
              href={`/dashboard/certificate/${enrollment._id}`}
              className="px-4 py-2.5 bg-[#fbbf24]/20 text-[#fbbf24] rounded-lg hover:bg-[#fbbf24]/30 transition-colors"
              title="View Certificate"
            >
              <Award className="w-4 h-4" />
            </Link>
          )}
          
          <button 
            className="px-3 py-2.5 border border-border rounded-lg hover:bg-card transition-colors text-gray-400 hover:text-white"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
