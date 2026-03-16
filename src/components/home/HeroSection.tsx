'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function HeroSection() {
  const { data: session } = useSession()

  return (
    <section id="home" className="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '20%', left: '10%', size: 8, color: 'rgba(124,58,237,0.3)', dur: '7s', delay: '0s' },
          { top: '60%', left: '85%', size: 12, color: 'rgba(6,182,212,0.3)', dur: '9s', delay: '1s' },
          { top: '40%', left: '40%', size: 4, color: 'rgba(245,158,11,0.4)', dur: '5s', delay: '2s' },
          { top: '75%', left: '25%', size: 8, color: 'rgba(124,58,237,0.3)', dur: '8s', delay: '0.5s' },
          { top: '15%', left: '70%', size: 16, color: 'rgba(6,182,212,0.2)', dur: '11s', delay: '3s' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              background: p.color,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Orbit decoration (desktop) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] hidden lg:block pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-spin" style={{ animationDuration: '25s' }} />
        <div className="absolute inset-8 rounded-full border border-dashed border-secondary/15 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center animate-glow">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-6xl">🎓</span>
            </div>
          </div>
        </div>
        {[
          { icon: '💻', top: '-24px', left: '50%', ml: '-24px', delay: '0s' },
          { icon: '📊', bottom: '-24px', left: '50%', ml: '-24px', delay: '1.5s' },
          { icon: '🚀', top: '50%', right: '-24px', mt: '-24px', delay: '3s' },
          { icon: '🎨', top: '50%', left: '-24px', mt: '-24px', delay: '0.8s' },
        ].map((item, i) => (
          <div key={i} className="absolute animate-float" style={{ ...item as any, animationDelay: item.delay }}>
            <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-2xl shadow-lg">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-2xl">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <span className="badge text-primary border-primary/40 bg-primary/10 mb-6 inline-flex">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              New: AI-Powered Learning Paths
            </span>
          </div>

          <h1 className="font-sora font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Learn Skills<br />
            <span className="gradient-text">Without Limits</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Join over 500,000 learners mastering in-demand skills through expert-led courses, live mentoring, and AI-personalized learning paths.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <Link href={session ? '/dashboard' : '/auth/register'} className="btn-primary text-center">
              {session ? 'Go to Dashboard →' : 'Start Learning Free →'}
            </Link>
            <button className="flex items-center justify-center gap-3 btn-outline group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-all">
                <svg className="w-4 h-4 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap gap-8 animate-slide-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            {[['500K+', 'Active Learners'], ['1,200+', 'Expert Courses'], ['98%', 'Satisfaction Rate']].map(([val, label], i) => (
              <div key={i} className={i > 0 ? 'flex gap-8' : ''}>
                {i > 0 && <div className="w-px bg-border" />}
                <div>
                  <div className="font-sora font-bold text-2xl text-white">{val}</div>
                  <div className="text-gray-500 text-sm">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  )
}
