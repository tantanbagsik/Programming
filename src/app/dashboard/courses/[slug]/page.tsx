import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Course from '@/models/Course'
import Enrollment from '@/models/Enrollment'
import { LessonPlayer } from '@/components/courses/LessonPlayer'

interface Props {
  params: { slug: string }
  searchParams: { lesson?: string }
}

export default async function LearnPage({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect(`/auth/login?callbackUrl=/dashboard/courses/${params.slug}`)
  const user = session.user as any

  await connectDB()
  const course = await Course.findOne({ slug: params.slug, isPublished: true })
    .populate('instructor', 'name image')
    .lean() as any

  if (!course) notFound()

  const enrollment = await Enrollment.findOne({
    user: user.id,
    course: course._id,
    status: { $in: ['active', 'completed'] },
  }).lean() as any

  if (!enrollment) redirect(`/courses/${params.slug}`)

  // Find first lesson if none specified
  const firstLesson = course.sections?.[0]?.lessons?.[0]
  const currentLessonId = searchParams.lesson ?? firstLesson?._id?.toString()

  // Find the active lesson
  let currentLesson = null
  let currentSection = null
  for (const section of course.sections ?? []) {
    const found = section.lessons?.find((l: any) => l._id?.toString() === currentLessonId)
    if (found) { currentLesson = found; currentSection = section; break }
  }

  return (
    <LessonPlayer
      course={JSON.parse(JSON.stringify(course))}
      enrollment={JSON.parse(JSON.stringify(enrollment))}
      currentLesson={currentLesson ? JSON.parse(JSON.stringify(currentLesson)) : null}
      currentSection={currentSection ? JSON.parse(JSON.stringify(currentSection)) : null}
      userId={user.id}
    />
  )
}
