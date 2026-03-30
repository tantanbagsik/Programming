'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, Save, Loader2, Plus, Trash2, 
  GripVertical, Video, FileText, Check, Upload,
  Image, File, X, Settings, Users, BookOpen,
  DollarSign, ListChecks, Layers, FileUp, Eye, EyeOff,
  ChevronRight, ChevronDown, GripHorizontal, PlayCircle,
  Clock, CheckCircle2, AlertCircle, Building, Tag
} from 'lucide-react'

interface Section {
  title: string
  order: number
  lessons: { title: string; description: string; videoUrl: string; duration: number; order: number; isFree: boolean }[]
}

interface EbookFile {
  id: string
  title: string
  url: string
  type: 'pdf' | 'image' | 'other'
  uploadMethod: 'upload' | 'url' | 'dragdrop'
  pages?: number
}

interface CourseData {
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  category: string
  level: string
  price: number
  discountPrice: number
  requirements: string[]
  whatYouLearn: string[]
  sections: Section[]
  ebooks: EbookFile[]
  isPublished: boolean
  tags: string[]
}

const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Health', 'Language', 'Data Science', 'Personal Development']
const levels = ['beginner', 'intermediate', 'advanced', 'all-levels']

interface TabItem {
  id: string
  label: string
  icon: React.ElementType
  description: string
}

export default function NewCourseFormPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [expandedSections, setExpandedSections] = useState<number[]>([0])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState<CourseData>({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    thumbnail: '',
    category: '',
    level: 'beginner',
    price: 0,
    discountPrice: 0,
    requirements: [''],
    whatYouLearn: [''],
    sections: [{ title: '', order: 1, lessons: [] }],
    ebooks: [],
    isPublished: false,
    tags: []
  })

  const [newRequirement, setNewRequirement] = useState('')
  const [newLearn, setNewLearn] = useState('')
  const [newTag, setNewTag] = useState('')
  
  const [ebookTitle, setEbookTitle] = useState('')
  const [ebookUrl, setEbookUrl] = useState('')
  const [ebookType, setEbookType] = useState<'pdf' | 'image' | 'other'>('pdf')
  const [uploadMethod, setUploadMethod] = useState<'url' | 'upload' | 'dragdrop'>('url')
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const [videoUploading, setVideoUploading] = useState(false)
  const [uploadingLessonIndex, setUploadingLessonIndex] = useState<{section: number; lesson: number} | null>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const tabs: TabItem[] = [
    { id: 'basic', label: 'Basic Info', Icon: BookOpen, description: 'Course title, description, and details' },
    { id: 'media', label: 'Media', Icon: Image, description: 'Thumbnail and preview media' },
    { id: 'pricing', label: 'Pricing', Icon: DollarSign, description: 'Set your course price and discounts' },
    { id: 'requirements', label: 'Requirements', Icon: ListChecks, description: 'What students need to know' },
    { id: 'outcomes', label: 'Outcomes', Icon: CheckCircle2, description: 'What students will learn' },
    { id: 'content', label: 'Content', Icon: Layers, description: 'Curriculum and lessons' },
    { id: 'files', label: 'Resources', Icon: FileUp, description: 'Ebooks and downloadable files' },
    { id: 'settings', label: 'Settings', Icon: Settings, description: 'Tags and publishing options' },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
    else if (status === 'authenticated') {
      const user = session?.user as any
      if (user?.role !== 'admin') router.push('/')
    }
  }, [status, session, router])

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setSaving(true)

    try {
      const cleanForm = {
        ...form,
        requirements: form.requirements.filter(r => r.trim()),
        whatYouLearn: form.whatYouLearn.filter(l => l.trim()),
        sections: form.sections
          .filter(s => s.title.trim())
          .map((s, i) => ({
            ...s,
            order: i + 1,
            lessons: s.lessons.filter(l => l.title.trim()).map((l, j) => ({ ...l, order: j + 1 }))
          }))
      }

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanForm)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to save course')
        return
      }

      toast.success('Course created successfully!')
      router.push('/admin/courses')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  function addRequirement() {
    if (newRequirement.trim()) {
      setForm(f => ({ ...f, requirements: [...f.requirements, newRequirement.trim()] }))
      setNewRequirement('')
    }
  }

  function removeRequirement(index: number) {
    setForm(f => ({ ...f, requirements: f.requirements.filter((_, i) => i !== index) }))
  }

  function addWhatYouLearn() {
    if (newLearn.trim()) {
      setForm(f => ({ ...f, whatYouLearn: [...f.whatYouLearn, newLearn.trim()] }))
      setNewLearn('')
    }
  }

  function removeWhatYouLearn(index: number) {
    setForm(f => ({ ...f, whatYouLearn: f.whatYouLearn.filter((_, i) => i !== index) }))
  }

  function addTag() {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  function removeTag(index: number) {
    setForm(f => ({ ...f, tags: f.tags.filter((_, i) => i !== index) }))
  }

  function addSection() {
    setForm(f => ({ 
      ...f, 
      sections: [...f.sections, { title: '', order: f.sections.length + 1, lessons: [] }] 
    }))
    setExpandedSections(prev => [...prev, form.sections.length])
  }

  function removeSection(index: number) {
    setForm(f => ({ ...f, sections: f.sections.filter((_, i) => i !== index) }))
    setExpandedSections(prev => prev.filter(i => i !== index))
  }

  function toggleSection(index: number) {
    setExpandedSections(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  function addLesson(sectionIndex: number) {
    const newSections = [...form.sections]
    newSections[sectionIndex].lessons.push({
      title: '',
      description: '',
      videoUrl: '',
      duration: 0,
      order: newSections[sectionIndex].lessons.length + 1,
      isFree: false
    })
    setForm(f => ({ ...f, sections: newSections }))
  }

  function updateLesson(sectionIndex: number, lessonIndex: number, field: string, value: any) {
    const newSections = [...form.sections]
    newSections[sectionIndex].lessons[lessonIndex] = {
      ...newSections[sectionIndex].lessons[lessonIndex],
      [field]: value
    }
    setForm(f => ({ ...f, sections: newSections }))
  }

  function removeLesson(sectionIndex: number, lessonIndex: number) {
    const newSections = [...form.sections]
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex)
    setForm(f => ({ ...f, sections: newSections }))
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number, lessonIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid video format. Use MP4, WebM, OGG, or MOV.')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video too large. Max 500MB.')
      return
    }

    setVideoUploading(true)
    setUploadingLessonIndex({ section: sectionIndex, lesson: lessonIndex })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        updateLesson(sectionIndex, lessonIndex, 'videoUrl', data.url)
        if (data.duration) {
          updateLesson(sectionIndex, lessonIndex, 'duration', Math.round(data.duration / 60))
        }
        toast.success('Video uploaded successfully!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Video upload error:', error)
      toast.error('Failed to upload video')
    } finally {
      setVideoUploading(false)
      setUploadingLessonIndex(null)
      if (videoInputRef.current) {
        videoInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!ebookTitle.trim()) {
      toast.error('Please enter a title for the resource first')
      return
    }

    setUploading(true)
    try {
      const fakeUrl = URL.createObjectURL(file)
      const newEbook: EbookFile = {
        id: Date.now().toString(),
        title: ebookTitle.trim(),
        url: fakeUrl,
        type: file.type.includes('pdf') ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'other',
        uploadMethod: 'dragdrop',
        pages: Math.ceil(file.size / 1024)
      }
      
      setForm(f => ({ ...f, ebooks: [...f.ebooks, newEbook] }))
      setEbookTitle('')
      toast.success('Resource added!')
    } catch {
      toast.error('Failed to add file')
    } finally {
      setUploading(false)
    }
  }

  const addEbook = () => {
    if (!ebookTitle.trim() || !ebookUrl.trim()) {
      toast.error('Please enter title and URL')
      return
    }

    const newEbook: EbookFile = {
      id: Date.now().toString(),
      title: ebookTitle.trim(),
      url: ebookUrl.trim(),
      type: ebookType,
      uploadMethod: uploadMethod,
      pages: 0
    }

    setForm(f => ({ ...f, ebooks: [...f.ebooks, newEbook] }))
    setEbookTitle('')
    setEbookUrl('')
    toast.success('Resource added!')
  }

  const removeEbook = (id: string) => {
    setForm(f => ({ ...f, ebooks: f.ebooks.filter(e => e.id !== id) }))
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    setUploading(true)
    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setForm(f => ({ ...f, thumbnail: data.url }))
        toast.success('Image uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const getTotalLessons = () => {
    return form.sections.reduce((acc, s) => acc + s.lessons.length, 0)
  }

  const getTotalDuration = () => {
    return form.sections.reduce((acc, s) => 
      acc + s.lessons.reduce((a, l) => a + (l.duration || 0), 0), 0
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/courses" className="p-2 hover:bg-border rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-sora font-bold text-lg">Create New Course</h1>
                <p className="text-gray-400 text-xs">Add a new course to your platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {getTotalLessons()} lessons · {getTotalDuration()} min
              </span>
              <button onClick={() => handleSubmit()} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 pb-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'text-primary border-primary' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="glow-card p-6">
                    <h2 className="font-sora font-semibold text-lg mb-4">Course Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Course Title *</label>
                        <input type="text" required value={form.title}
                          onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))}
                          className="input-base" placeholder="e.g., Complete Python Course 2024" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Slug *</label>
                        <input type="text" required value={form.slug}
                          onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                          className="input-base" placeholder="complete-python-course" />
                        <p className="text-gray-500 text-xs mt-1">URL: /courses/{form.slug || '...'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Short Description *</label>
                        <textarea value={form.shortDescription}
                          onChange={(e) => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                          className="input-base min-h-[80px]" placeholder="A brief summary of your course (max 200 characters)"
                          maxLength={200} />
                        <p className="text-gray-500 text-xs mt-1">{form.shortDescription.length}/200 characters</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Full Description *</label>
                        <textarea value={form.description}
                          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                          className="input-base min-h-[150px]" placeholder="Detailed course description..." />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Category</label>
                          <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="input-base">
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Level</label>
                          <select value={form.level} onChange={(e) => setForm(f => ({ ...f, level: e.target.value }))} className="input-base">
                            {levels.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1).replace('-', ' ')}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="glow-card p-6">
                  <h2 className="font-sora font-semibold text-lg mb-4">Course Media</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Thumbnail Image *</label>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <input type="url" value={form.thumbnail}
                            onChange={(e) => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                            className="input-base" placeholder="https://... or upload below" />
                        </div>
                        <input
                          type="file"
                          id="thumbnail-upload"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className={`flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium cursor-pointer hover:bg-primary/30 transition-colors ${uploading ? 'opacity-50' : ''}`}
                        >
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Upload
                        </label>
                      </div>
                      {form.thumbnail && (
                        <div className="relative inline-block">
                          <img src={form.thumbnail} alt="Thumbnail preview" className="h-32 rounded-lg object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, thumbnail: '' }))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div 
                        className="mt-3 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => document.getElementById('thumbnail-upload')?.click()}
                      >
                        <Image className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                        <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF or WebP (max 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="glow-card p-6">
                  <h2 className="font-sora font-semibold text-lg mb-4">Pricing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Regular Price ($)</label>
                      <input type="number" min="0" step="0.01" value={form.price}
                        onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} 
                        className="input-base" placeholder="0.00" />
                      <p className="text-gray-500 text-xs mt-1">Set to 0 for free courses</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Discount Price ($)</label>
                      <input type="number" min="0" step="0.01" value={form.discountPrice}
                        onChange={(e) => setForm(f => ({ ...f, discountPrice: parseFloat(e.target.value) || 0 }))} 
                        className="input-base" placeholder="0.00" />
                      <p className="text-gray-500 text-xs mt-1">Leave empty for no discount</p>
                    </div>
                  </div>
                  {form.price > 0 && form.discountPrice > 0 && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm">
                        Students will pay <span className="font-bold">${form.discountPrice.toFixed(2)}</span> 
                        (saved <span className="font-bold">${(form.price - form.discountPrice).toFixed(2)}</span>)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Requirements Tab */}
              {activeTab === 'requirements' && (
                <div className="glow-card p-6">
                  <h2 className="font-sora font-semibold text-lg mb-4">Course Requirements</h2>
                  <p className="text-gray-400 text-sm mb-4">What students need to know before taking this course</p>
                  <div className="flex gap-2 mb-4">
                    <input type="text" value={newRequirement} onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      className="input-base flex-1" placeholder="e.g., Basic Python knowledge..." />
                    <button type="button" onClick={addRequirement} className="btn-outline">Add</button>
                  </div>
                  <div className="space-y-2">
                    {form.requirements.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 bg-card p-3 rounded-lg">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="flex-1 text-sm">{r}</span>
                        <button type="button" onClick={() => removeRequirement(i)} className="text-gray-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {form.requirements.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No requirements added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Outcomes Tab */}
              {activeTab === 'outcomes' && (
                <div className="glow-card p-6">
                  <h2 className="font-sora font-semibold text-lg mb-4">What Students Will Learn</h2>
                  <p className="text-gray-400 text-sm mb-4">The skills and knowledge students will gain from this course</p>
                  <div className="flex gap-2 mb-4">
                    <input type="text" value={newLearn} onChange={(e) => setNewLearn(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWhatYouLearn())}
                      className="input-base flex-1" placeholder="e.g., Build real-world Python projects..." />
                    <button type="button" onClick={addWhatYouLearn} className="btn-outline">Add</button>
                  </div>
                  <div className="space-y-2">
                    {form.whatYouLearn.map((l, i) => (
                      <div key={i} className="flex items-center gap-2 bg-card p-3 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="flex-1 text-sm">{l}</span>
                        <button type="button" onClick={() => removeWhatYouLearn(i)} className="text-gray-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {form.whatYouLearn.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No learning outcomes added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="glow-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-sora font-semibold text-lg">Course Content</h2>
                      <p className="text-gray-400 text-sm">{getTotalLessons()} lessons · {getTotalDuration()} minutes</p>
                    </div>
                    <button type="button" onClick={addSection} className="btn-outline flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Section
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border border-border rounded-xl overflow-hidden">
                        <div 
                          className="bg-card p-4 flex items-center gap-3 cursor-pointer"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          {expandedSections.includes(sectionIndex) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <GripVertical className="w-4 h-4 text-gray-600" />
                          <input type="text" value={section.title}
                            onChange={(e) => {
                              const newSections = [...form.sections]
                              newSections[sectionIndex].title = e.target.value
                              setForm(f => ({ ...f, sections: newSections }))
                            }}
                            className="flex-1 bg-transparent border-none focus:outline-none font-medium" 
                            placeholder="Section title..."
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-gray-500 text-sm">{section.lessons.length} lessons</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(sectionIndex); }} className="text-gray-500 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {expandedSections.includes(sectionIndex) && (
                          <div className="p-4 space-y-3 bg-dark/50">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="bg-card p-3 rounded-lg space-y-2">
                                <div className="flex items-center gap-3">
                                  <Video className="w-4 h-4 text-gray-500" />
                                  <input type="text" value={lesson.title}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm" 
                                    placeholder="Lesson title..." />
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <input type="number" value={lesson.duration}
                                      onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', parseInt(e.target.value) || 0)}
                                      className="w-14 bg-dark border border-border rounded px-2 py-1 text-xs" 
                                      placeholder="Min" />
                                  </div>
                                  <button type="button" onClick={() => removeLesson(sectionIndex, lessonIndex)} className="text-gray-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 ml-7">
                                  <input type="text" value={lesson.videoUrl}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'videoUrl', e.target.value)}
                                    className="flex-1 bg-dark border border-border rounded px-3 py-1.5 text-xs" 
                                    placeholder="Video URL or upload" />
                                  <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                    className="hidden"
                                    onChange={(e) => handleVideoUpload(e, sectionIndex, lessonIndex)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    disabled={videoUploading && uploadingLessonIndex?.section === sectionIndex && uploadingLessonIndex?.lesson === lessonIndex}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary rounded text-xs font-medium hover:bg-primary/30 disabled:opacity-50"
                                  >
                                    {videoUploading && uploadingLessonIndex?.section === sectionIndex && uploadingLessonIndex?.lesson === lessonIndex ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Upload className="w-3 h-3" />
                                    )}
                                    Upload
                                  </button>
                                  <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={lesson.isFree}
                                      onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'isFree', e.target.checked)}
                                      className="rounded border-border"
                                    />
                                    Free
                                  </label>
                                </div>
                                {lesson.videoUrl && (
                                  <div className="ml-7 text-xs text-green-400 flex items-center gap-1">
                                    <PlayCircle className="w-3 h-3" /> Video attached
                                  </div>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => addLesson(sectionIndex)}
                              className="text-sm text-primary hover:underline flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Add Lesson
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {form.sections.length === 0 && (
                      <div className="text-center py-8">
                        <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500">No sections yet</p>
                        <button type="button" onClick={addSection} className="btn-primary mt-3">
                          Add Your First Section
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Files Tab */}
              {activeTab === 'files' && (
                <div className="space-y-6">
                  <div className="glow-card p-6">
                    <h2 className="font-sora font-semibold text-lg mb-4">Downloadable Resources</h2>
                    <p className="text-gray-400 text-sm mb-4">Add PDFs, images, and other downloadable content</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Resource Title</label>
                        <input type="text" value={ebookTitle} onChange={(e) => setEbookTitle(e.target.value)}
                          className="input-base" placeholder="e.g., Course Workbook" />
                      </div>
                      <div className="flex gap-2">
                        {['url', 'upload', 'dragdrop'].map(m => (
                          <button key={m} type="button" onClick={() => setUploadMethod(m as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              uploadMethod === m ? 'bg-primary text-white' : 'bg-card border border-border text-gray-400 hover:text-white'
                            }`}>
                            {m === 'url' ? '🔗 URL' : m === 'upload' ? '📁 Upload' : '🎯 Drag & Drop'}
                          </button>
                        ))}
                      </div>

                      {uploadMethod === 'url' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <input type="url" value={ebookUrl} onChange={(e) => setEbookUrl(e.target.value)}
                              className="input-base" placeholder="https://...pdf" />
                          </div>
                          <div>
                            <select value={ebookType} onChange={(e) => setEbookType(e.target.value as any)} className="input-base">
                              <option value="pdf">PDF</option>
                              <option value="image">Image</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {uploadMethod === 'upload' && (
                        <div>
                          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileSelect} className="hidden" />
                          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                            className="w-full p-8 border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors flex flex-col items-center gap-3">
                            {uploading ? <Loader2 className="w-8 h-8 animate-spin text-primary" /> : 
                              (<><Upload className="w-8 h-8 text-gray-500" /><p className="text-gray-400">Click to upload PDF or images</p></>)}
                          </button>
                        </div>
                      )}

                      {uploadMethod === 'dragdrop' && (
                        <div ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                          className={`p-8 border-2 border-dashed rounded-xl transition-colors flex flex-col items-center gap-3 cursor-pointer ${
                            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
                          }`}>
                          <Upload className="w-8 h-8 text-gray-500" />
                          <p className="text-gray-400">Drag and drop PDF or images here</p>
                        </div>
                      )}

                      <button type="button" onClick={addEbook}
                        disabled={!ebookTitle.trim() || (uploadMethod !== 'dragdrop' && !ebookUrl.trim())}
                        className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Resource
                      </button>
                    </div>
                  </div>

                  {form.ebooks.length > 0 && (
                    <div className="glow-card p-6">
                      <h3 className="font-sora font-semibold text-lg mb-4">Your Resources ({form.ebooks.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {form.ebooks.map(ebook => (
                          <div key={ebook.id} className="flex items-center gap-4 bg-card p-4 rounded-xl">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{ebook.title}</p>
                              <p className="text-gray-500 text-xs truncate">{ebook.url}</p>
                            </div>
                            <button type="button" onClick={() => removeEbook(ebook.id)} className="p-2 hover:bg-border rounded-lg text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="glow-card p-6">
                    <h2 className="font-sora font-semibold text-lg mb-4">Tags</h2>
                    <div className="flex gap-2 mb-4">
                      <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="input-base flex-1" placeholder="Add a tag..." />
                      <button type="button" onClick={addTag} className="btn-outline">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-card rounded-full text-sm">
                          <Tag className="w-3 h-3" /> {tag}
                          <button onClick={() => removeTag(i)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {form.tags.length === 0 && <p className="text-gray-500 text-sm">No tags added</p>}
                    </div>
                  </div>

                  <div className="glow-card p-6">
                    <h2 className="font-sora font-semibold text-lg mb-4">Publishing</h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Status</p>
                        <p className="text-gray-400 text-sm">
                          {form.isPublished ? 'Published - visible to students' : 'Draft - only you can see'}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          form.isPublished 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}
                      >
                        {form.isPublished ? <><Eye className="w-4 h-4" /> Published</> : <><EyeOff className="w-4 h-4" /> Draft</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glow-card p-6 sticky top-24">
              <h3 className="font-sora font-semibold text-lg mb-4">Course Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Title</p>
                  <p className="font-medium">{form.title || 'Untitled Course'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Slug</p>
                  <p className="font-medium text-primary">{form.slug || 'course-slug'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Category</p>
                  <p className="font-medium">{form.category || 'Not selected'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Level</p>
                  <p className="font-medium capitalize">{form.level?.replace('-', ' ') || 'Beginner'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Price</p>
                  <p className="font-medium">
                    {form.price === 0 ? 'Free' : form.discountPrice > 0 ? `$${form.discountPrice} ($${form.price})` : `$${form.price}`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Content</p>
                  <p className="font-medium">{form.sections.filter(s => s.title).length} sections · {getTotalLessons()} lessons</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Resources</p>
                  <p className="font-medium">{form.ebooks.length} files</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    form.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button onClick={() => handleSubmit()} disabled={saving} className="btn-primary w-full justify-center">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Course
                  </button>
                  <Link href="/admin/courses" className="btn-outline w-full justify-center">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
