'use client'
import { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'

const categories = ['All', 'Development', 'Design', 'Data Science', 'Business', 'Marketing']
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

interface Course {
  _id: string
  title: string
  slug: string
  shortDescription: string
  thumbnail: string
  instructor: { name: string; image?: string }
  category: string
  level: string
  price: number
  discountPrice?: number
  rating: number
  reviewCount: number
  enrollmentCount: number
  totalLessons: number
  totalDuration: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All Levels')
  const [sort, setSort] = useState('popular')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '9',
        sort,
        ...(category !== 'All' && { category }),
        ...(level !== 'All Levels' && { level: level.toLowerCase() }),
        ...(search && { search }),
      })
      const res = await fetch(`/api/courses?${params}`)
      const data = await res.json()
      setCourses(data.courses ?? [])
      setTotalPages(data.pagination?.totalPages ?? 1)
      setTotal(data.pagination?.total ?? 0)
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [page, sort, category, level, search])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [category, level, sort, search])

  const activeFilters = [
    category !== 'All' && category,
    level !== 'All Levels' && level,
    sort !== 'popular' && sortOptions.find(s => s.value === sort)?.label,
  ].filter(Boolean) as string[]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark pt-20">
        {/* Header */}
        <div className="mesh-bg border-b border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="badge text-primary border-primary/40 bg-primary/10 mb-4 inline-flex">📚 All Courses</span>
            <h1 className="font-sora font-bold text-4xl sm:text-5xl mb-4">
              Explore <span className="gradient-text">1,200+ courses</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">Learn from world-class instructors at your own pace</p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search courses, topics, instructors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-base pl-12 pr-4 py-4 text-base rounded-2xl"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'border border-border text-gray-400 hover:border-primary/50 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + filters */}
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="input-base py-2 text-sm w-auto pr-8 cursor-pointer"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="btn-outline py-2 flex items-center gap-2 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded filters panel */}
          {filtersOpen && (
            <div className="glow-card p-6 mb-8">
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-sm font-medium mb-3">Level</p>
                  <div className="flex flex-wrap gap-2">
                    {levels.map(l => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          level === l ? 'bg-primary text-white' : 'border border-border text-gray-400 hover:border-primary/50 hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {activeFilters.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <span className="text-xs text-gray-500">Active filters:</span>
                  {activeFilters.map(f => (
                    <span key={f} className="badge text-primary border-primary/30 bg-primary/10 text-xs">{f}</span>
                  ))}
                  <button
                    onClick={() => { setCategory('All'); setLevel('All Levels'); setSort('popular') }}
                    className="text-xs text-red-400 hover:text-red-300 ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              {loading ? 'Searching...' : `${total.toLocaleString()} course${total !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Course grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-sora font-semibold text-xl mb-2">No courses found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <button onClick={() => { setSearch(''); setCategory('All'); setLevel('All Levels') }} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline py-2 px-4 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      page === p ? 'bg-primary text-white' : 'border border-border text-gray-400 hover:border-primary/50 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-outline py-2 px-4 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

function CourseCard({ course }: { course: Course }) {
  const price = course.discountPrice ?? course.price
  const hours = Math.round(course.totalDuration / 60)

  return (
    <Link href={`/courses/${course.slug}`} className="glow-card overflow-hidden group block">
      <div className="h-44 bg-gradient-to-br from-primary/20 to-secondary/10 relative overflow-hidden flex items-center justify-center">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl">📚</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-2 left-2 badge text-xs text-primary border-primary/30 bg-black/60">
          {course.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-sora font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-gray-500 text-xs mb-3">By {course.instructor?.name}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <span className="text-accent">★</span>
            <span className="text-accent font-semibold">{course.rating?.toFixed(1)}</span>
            <span>({course.reviewCount?.toLocaleString()})</span>
          </span>
          <span>•</span>
          <span>{course.totalLessons} lessons</span>
          {hours > 0 && <><span>•</span><span>{hours}h</span></>}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {price === 0 ? (
              <span className="font-sora font-bold text-green-400">Free</span>
            ) : (
              <>
                <span className="font-sora font-bold text-white text-lg">${price}</span>
                {course.discountPrice && course.price > course.discountPrice && (
                  <span className="text-gray-500 text-xs line-through ml-1">${course.price}</span>
                )}
              </>
            )}
          </div>
          <span className={`badge text-xs ${
            course.level === 'beginner' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
            course.level === 'intermediate' ? 'text-secondary border-secondary/30 bg-secondary/10' :
            'text-accent border-accent/30 bg-accent/10'
          }`}>
            {course.level}
          </span>
        </div>
      </div>
    </Link>
  )
}
