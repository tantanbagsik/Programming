'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download,
  Maximize, Minimize, RotateCw, Bookmark, Search,
  ChevronUp, ChevronDown, X, FileText, Eye, EyeOff
} from 'lucide-react'

interface PDFResource {
  id: string
  title: string
  url: string
  pages: number
  size: number
  type: string
}

interface PDFViewerProps {
  resource: PDFResource
  onClose?: () => void
  onComplete?: () => void
  initialPage?: number
}

interface PageContent {
  pageNumber: number
  content: string
  thumbnail: string
  width: number
  height: number
}

export function PDFViewer({ resource, onClose, onComplete, initialPage = 1 }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(resource.pages || 1)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'single' | 'continuous' | 'facing'>('single')
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [pagesRead, setPagesRead] = useState<Set<number>>(new Set([initialPage]))

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate PDF loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [currentPage])

  // Track pages read for completion
  useEffect(() => {
    setPagesRead(prev => new Set([...prev, currentPage]))
    
    // Check if all pages have been read
    if (pagesRead.size >= totalPages && onComplete) {
      onComplete()
    }
  }, [currentPage, totalPages, pagesRead, onComplete])

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(totalPages, page))
    setCurrentPage(newPage)
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (viewMode === 'facing') {
      goToPage(Math.min(currentPage + 2, totalPages))
    } else {
      goToPage(currentPage + 1)
    }
  }, [currentPage, totalPages, viewMode, goToPage])

  const prevPage = useCallback(() => {
    if (viewMode === 'facing') {
      goToPage(Math.max(currentPage - 2, 1))
    } else {
      goToPage(currentPage - 1)
    }
  }, [currentPage, viewMode, goToPage])

  // Zoom functions
  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 300))
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 50))
  const resetZoom = () => setZoom(100)

  // Rotation
  const rotate = () => setRotation(prev => (prev + 90) % 360)

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    // Simulate search results
    const results: number[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (Math.random() > 0.7) {
        results.push(i)
      }
    }
    setSearchResults(results)
    setCurrentSearchIndex(0)
    if (results.length > 0) {
      goToPage(results[0])
    }
  }

  const nextSearchResult = () => {
    if (searchResults.length === 0) return
    const nextIndex = (currentSearchIndex + 1) % searchResults.length
    setCurrentSearchIndex(nextIndex)
    goToPage(searchResults[nextIndex])
  }

  const prevSearchResult = () => {
    if (searchResults.length === 0) return
    const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length
    setCurrentSearchIndex(prevIndex)
    goToPage(searchResults[prevIndex])
  }

  // Bookmark functionality
  const toggleBookmark = () => {
    setBookmarks(prev => 
      prev.includes(currentPage) 
        ? prev.filter(p => p !== currentPage)
        : [...prev, currentPage]
    )
  }

  // Download functionality
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resource.url
    link.download = `${resource.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevPage()
          break
        case 'ArrowRight':
          nextPage()
          break
        case 'ArrowUp':
          if (viewMode === 'continuous') {
            containerRef.current?.scrollBy({ top: -100, behavior: 'smooth' })
          }
          break
        case 'ArrowDown':
          if (viewMode === 'continuous') {
            containerRef.current?.scrollBy({ top: 100, behavior: 'smooth' })
          }
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'b':
          toggleBookmark()
          break
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, isFullscreen, viewMode, nextPage, prevPage])

  // Generate thumbnail for a page
  const getThumbnail = (pageNum: number) => {
    return `https://via.placeholder.com/120x160?text=Page+${pageNum}`
  }

  // Render page content
  const renderPage = (pageNum: number) => {
    return (
      <div 
        key={pageNum}
        className="bg-white shadow-lg mx-auto"
        style={{ 
          transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
          transformOrigin: 'center center',
          width: '600px',
          minHeight: '800px',
          maxWidth: '100%'
        }}
      >
        <div className="p-8">
          {/* Page header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">{resource.title}</h2>
            <p className="text-sm text-gray-500">Page {pageNum} of {totalPages}</p>
          </div>

          {/* Simulated content */}
          <div className="space-y-4">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="space-y-2">
                {i % 4 === 0 && (
                  <h3 className="text-lg font-semibold text-gray-700">
                    Section {Math.floor(i / 4) + 1}: Topic {String.fromCharCode(65 + (i % 4))}
                  </h3>
                )}
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                {i % 3 === 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 font-medium">Key Point:</p>
                    <p className="text-sm text-blue-700">
                      This is an important concept that will be tested on the board exam.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Page footer */}
          <div className="border-t border-gray-200 pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs text-gray-400">EduLearn © 2024</span>
            <span className="text-xs text-gray-400">Page {pageNum}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`bg-gray-900 flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Top toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Title */}
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-white font-medium text-sm truncate max-w-xs">
              {resource.title}
            </span>
          </div>

          {/* View mode */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('single')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'single' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Single
            </button>
            <button
              onClick={() => setViewMode('continuous')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'continuous' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Continuous
            </button>
            <button
              onClick={() => setViewMode('facing')}
              className={`px-2 py-1 rounded text-xs ${viewMode === 'facing' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Facing
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {showSearch && (
              <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3 z-10 w-72">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search in document..."
                    className="flex-1 bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-3 py-1.5 bg-primary text-white text-sm rounded hover:bg-primary/90"
                  >
                    Find
                  </button>
                </div>
                {searchResults.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{searchResults.length} results found</span>
                    <div className="flex items-center gap-1">
                      <button onClick={prevSearchResult} className="p-1 hover:text-white">
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <span>{currentSearchIndex + 1}/{searchResults.length}</span>
                      <button onClick={nextSearchResult} className="p-1 hover:text-white">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bookmarks */}
          <div className="relative">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`p-2 transition-colors ${bookmarks.includes(currentPage) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            
            {showBookmarks && (
              <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3 z-10 w-48">
                <h4 className="text-sm font-medium text-white mb-2">Bookmarks</h4>
                {bookmarks.length > 0 ? (
                  <div className="space-y-1">
                    {bookmarks.map(page => (
                      <button
                        key={page}
                        onClick={() => { goToPage(page); setShowBookmarks(false) }}
                        className="w-full text-left px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                      >
                        Page {page}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No bookmarks yet</p>
                )}
              </div>
            )}
          </div>

          {/* Thumbnails toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 transition-colors ${showThumbnails ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          >
            {showThumbnails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnail sidebar */}
        {showThumbnails && (
          <div className="w-40 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
            <div className="p-2 space-y-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
                    currentPage === page 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-gray-600'
                  }`}
                >
                  <div className="bg-gray-700 aspect-[3/4] flex items-center justify-center">
                    <img 
                      src={getThumbnail(page)} 
                      alt={`Page ${page}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-gray-900 px-2 py-1 text-center">
                    <span className={`text-xs ${currentPage === page ? 'text-primary' : 'text-gray-400'}`}>
                      {page}
                    </span>
                    {bookmarks.includes(page) && (
                      <Bookmark className="w-3 h-3 text-yellow-400 inline ml-1" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-auto bg-gray-800 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading page {currentPage}...</p>
              </div>
            </div>
          ) : viewMode === 'continuous' ? (
            <div className="space-y-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <div key={page} id={`page-${page}`}>
                  {renderPage(page)}
                </div>
              ))}
            </div>
          ) : viewMode === 'facing' ? (
            <div className="flex justify-center gap-4">
              {currentPage > 1 && renderPage(currentPage - 1)}
              {renderPage(currentPage)}
              {currentPage < totalPages && renderPage(currentPage + 1)}
            </div>
          ) : (
            <div className="flex justify-center">
              {renderPage(currentPage)}
            </div>
          )}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-16 bg-gray-700 text-white text-center text-sm px-2 py-1 rounded border border-gray-600 focus:border-primary focus:outline-none"
            />
            <span className="text-gray-400 text-sm">of {totalPages}</span>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={zoom <= 50}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={resetZoom}
            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
          >
            {zoom}%
          </button>

          <button
            onClick={zoomIn}
            disabled={zoom >= 300}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={rotate}
            className="p-2 text-gray-400 hover:text-white transition-colors ml-2"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${(pagesRead.size / totalPages) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {Math.round((pagesRead.size / totalPages) * 100)}% read
          </span>
        </div>

        {/* Bookmark button */}
        <button
          onClick={toggleBookmark}
          className={`p-2 transition-colors ${
            bookmarks.includes(currentPage) 
              ? 'text-yellow-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}