'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle,
  Menu, X, BookOpen, Trophy, Home, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward,
  FileText, Download, ExternalLink, Eye
} from 'lucide-react'
import { PDFViewer } from './PDFViewer'
import { QuizPlayer } from './QuizPlayer'

interface Lesson {
   _id: string
   title: string
   description: string
   videoUrl?: string
   duration: number // in minutes
   order: number
   isFree: boolean
   resources: { title: string; url: string; type?: string; pages?: number }[]
   // Quiz-specific fields
   type?: 'video' | 'quiz' | 'reading' | 'pdf'
   programId?: string // Reference to quiz/program
   // PDF-specific fields
   pdfUrl?: string
   pdfPages?: number
}

interface Props {
   course: any
   enrollment: any
   currentLesson: Lesson
   currentSection: any
   userId: string
}

function getVideoType(url: string): 'youtube' | 'vimeo' | 'cloudinary' | 'direct' | 'embed' | null {
  if (!url) return null
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo.com')) return 'vimeo'
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) return 'cloudinary'
  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) return 'direct'
  if (url.startsWith('<iframe') || url.startsWith('http') && url.includes('/embed/')) return 'embed'
  return 'direct'
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

function getCloudinaryUrls(url: string) {
  if (!url.includes('cloudinary.com')) return { stream: '', poster: '', direct: url }
  const base = url.replace(/\.[^.]+$/, '').replace(/\/upload/, '/upload')
  return {
    stream: url.includes('.m3u8') ? url : `${base}.m3u8`,
    poster: url.includes('.m3u8') ? url.replace('.m3u8', '.jpg') : url.replace(/\.[^.]+$/, '.jpg'),
    direct: url
  }
}

export function LessonPlayer({ course, enrollment, currentLesson, currentSection, userId }: Props) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(enrollment.lessonsProgress?.filter((lp: any) => lp.completedAt).map((lp: any) => lp.lessonId) ?? [])
  )
  const [progress, setProgress] = useState(enrollment.progress ?? 0)
  const [marking, setMarking] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [activeTab, setActiveTab] = useState<'video' | 'pdf' | 'resources'>('video')
  const [selectedPdf, setSelectedPdf] = useState<{title: string; url: string; pages: number} | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const videoUrl = currentLesson?.videoUrl || ''
  const videoType = getVideoType(videoUrl)
  const cloudinaryUrls = getCloudinaryUrls(videoUrl)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onDurationChange = () => setDuration(video.duration)
    const onEnded = () => {
      setIsPlaying(false)
      if (currentLesson && !completedLessons.has(currentLesson._id)) {
        markComplete(currentLesson._id)
      }
    }
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
      video.removeEventListener('ended', onEnded)
    }
  }, [currentLesson])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else video.play()
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const vol = parseFloat(e.target.value)
    video.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const container = document.getElementById('video-container')
    if (!container) return
    if (document.fullscreenElement) document.exitFullscreen()
    else container.requestFullscreen()
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const renderVideoPlayer = () => {
    if (!videoUrl) {
      return (
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-400 text-sm">No video for this lesson yet</p>
        </div>
      )
    }

    if (videoType === 'youtube') {
      const ytId = getYouTubeId(videoUrl)
      if (!ytId) return <div className="text-center text-gray-400">Invalid YouTube URL</div>
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      )
    }

    if (videoType === 'vimeo') {
      const vimeoId = getVimeoId(videoUrl)
      if (!vimeoId) return <div className="text-center text-gray-400">Invalid Vimeo URL</div>
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )
    }

    if (videoType === 'cloudinary' || videoType === 'direct') {
      const src = cloudinaryUrls.direct
      return (
        <div
          id="video-container"
          className="relative w-full h-full bg-black group"
          onMouseMove={handleMouseMove}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-contain"
            poster={cloudinaryUrls.poster || undefined}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <Play className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer mb-3 accent-primary"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); skip(-10) }} className="text-white/80 hover:text-white">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); togglePlay() }} className="text-white/80 hover:text-white">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); skip(10) }} className="text-white/80 hover:text-white">
                  <SkipForward className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleMute() }} className="text-white/80 hover:text-white">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <span className="text-white/80 text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFullscreen() }} className="text-white/80 hover:text-white">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <iframe
        src={videoUrl}
        className="w-full h-full"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    )
  }

  // Flatten all lessons for prev/next navigation
  const allLessons = course.sections?.flatMap((s: any) =>
    s.lessons?.map((l: any) => ({ ...l, sectionTitle: s.title }))
  ) ?? []

  const currentIdx = allLessons.findIndex((l: any) => l._id === currentLesson?._id)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  const markComplete = useCallback(async (lessonId: string) => {
    if (completedLessons.has(lessonId) || marking) return
    setMarking(true)
    try {
      const res = await fetch(`/api/enrollments/${course._id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, watchedSeconds: 0, completed: true }),
      })
      const data = await res.json()
      if (res.ok) {
        setCompletedLessons(prev => new Set([...prev, lessonId]))
        setProgress(data.progress)
        toast.success('Lesson marked as complete!')
        if (data.progress === 100) toast.success('🎉 Course completed! Certificate available.')
      }
    } catch {
      toast.error('Failed to update progress')
    } finally {
      setMarking(false)
    }
  }, [completedLessons, marking, course._id])

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Top bar */}
      <div className="h-14 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-4 flex-shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{course.title}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
   {/* Lesson content area */}
               {currentLesson.type === 'quiz' && currentLesson.programId ? (
                 <QuizPlayer 
                   course={course} 
                   enrollment={enrollment} 
                   lesson={currentLesson} 
                   userId={userId} 
                   onComplete={markComplete} 
                   completedLessons={completedLessons} 
                 />
               ) : (
                 <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-border">
                   {renderVideoPlayer()}
                 </div>
               )}

              {/* Lesson header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{currentSection?.title}</p>
                  <h1 className="font-sora font-bold text-2xl sm:text-3xl">{currentLesson.title}</h1>
                  {currentLesson.description && (
                    <p className="text-gray-400 mt-2 text-sm leading-relaxed">{currentLesson.description}</p>
                  )}
                </div>
                <button
                  onClick={() => markComplete(currentLesson._id)}
                  disabled={completedLessons.has(currentLesson._id) || marking}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    completedLessons.has(currentLesson._id)
                      ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                      : 'border border-border text-gray-300 hover:border-primary hover:text-white'
                  }`}
                >
                  {completedLessons.has(currentLesson._id)
                    ? <><CheckCircle className="w-4 h-4" /> Done</>
                    : <><Circle className="w-4 h-4" /> Mark Done</>
                  }
                </button>
              </div>

              {/* Resources */}
              {currentLesson.resources?.length > 0 && (
                <div className="glow-card p-4 mb-6">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> Resources
                  </h3>
                  <div className="space-y-2">
                    {currentLesson.resources.map((r: any, i: number) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline">
                        📎 {r.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Prev/Next navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  onClick={() => prevLesson && router.push(`?lesson=${prevLesson._id}`)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 btn-outline py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="text-center text-xs text-gray-500">
                  {currentIdx + 1} / {allLessons.length}
                </div>

                <button
                  onClick={() => {
                    if (!completedLessons.has(currentLesson._id)) markComplete(currentLesson._id)
                    nextLesson && router.push(`?lesson=${nextLesson._id}`)
                  }}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 shimmer-btn text-white font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div>
                <div className="text-6xl mb-4">📚</div>
                <h2 className="font-sora font-bold text-2xl mb-2">Select a lesson to begin</h2>
                <p className="text-gray-400 text-sm">Choose from the curriculum on the right</p>
              </div>
            </div>
          )}
        </main>

        {/* Sidebar curriculum */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-border bg-card flex-shrink-0 overflow-y-auto hidden md:block">
            <div className="p-4 border-b border-border">
              <p className="font-semibold text-sm">Course Content</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs text-gray-400">{progress}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{completedLessons.size}/{allLessons.length} lessons</p>
            </div>

            {course.sections?.map((section: any, si: number) => (
              <div key={si}>
                <div className="px-4 py-3 bg-black/20 border-b border-border">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{section.title}</p>
                </div>
                {section.lessons?.map((lesson: any, li: number) => {
                  const isActive = lesson._id === currentLesson?._id
                  const isDone = completedLessons.has(lesson._id)
                  return (
                    <button
                      key={li}
                      onClick={() => router.push(`?lesson=${lesson._id}`)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-border/50 ${isActive ? 'bg-primary/10' : ''}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isDone
                          ? <CheckCircle className="w-4 h-4 text-green-400" />
                          : <Circle className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">{lesson.duration}min</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            ))}

            {/* Completion badge */}
            {progress === 100 && (
              <div className="p-4 border-t border-border">
                <div className="glow-card p-4 text-center">
                  <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="font-sora font-bold text-sm">Course Complete!</p>
                  <p className="text-gray-400 text-xs mt-1">Certificate available</p>
                  <Link href="/dashboard/certificates" className="btn-primary mt-3 text-xs py-2 w-full block text-center">
                    Get Certificate
                  </Link>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
