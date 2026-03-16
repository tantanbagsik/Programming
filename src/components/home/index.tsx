'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

// ======================== FEATURES ========================
const features = [
  { icon: '🤖', color: 'primary', title: 'AI-Powered Paths', desc: 'Our AI analyzes your goals and schedule to build a personalized learning roadmap just for you.' },
  { icon: '🎥', color: 'secondary', title: 'Live Mentoring', desc: 'Book 1-on-1 sessions with industry experts. Get real-time feedback on your projects and code.' },
  { icon: '🏆', color: 'accent', title: 'Verified Certificates', desc: 'Earn blockchain-verified certificates recognized by top companies worldwide.' },
  { icon: '👥', color: 'green', title: 'Community Forums', desc: 'Connect with thousands of learners, ask questions, and collaborate on challenges.' },
  { icon: '📱', color: 'pink', title: 'Learn Anywhere', desc: 'Download lessons for offline access. Your progress syncs across all devices.' },
  { icon: '⚡', color: 'orange', title: 'Project-Based', desc: 'Learn by doing with real-world projects. Build a portfolio that proves your skills.' },
]

const colorMap: Record<string, string> = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  accent: 'bg-accent/20 text-accent',
  green: 'bg-green-500/20 text-green-400',
  pink: 'bg-pink-500/20 text-pink-400',
  orange: 'bg-orange-500/20 text-orange-400',
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge text-secondary border-secondary/40 bg-secondary/10 mb-4 inline-flex">✦ Why EduLearn</span>
          <h2 className="font-sora font-bold text-4xl sm:text-5xl mb-4">
            Everything you need to <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Expert instruction, cutting-edge technology, and community support — all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glow-card p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${colorMap[f.color]}`}>{f.icon}</div>
              <h3 className="font-sora font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-medium cursor-pointer hover:gap-3 transition-all text-primary">
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======================== COURSES (static preview) ========================
const previewCourses = [
  { emoji: '⚛️', title: 'Complete React & Next.js Developer', instructor: 'Sarah Johnson', price: 49, oldPrice: 199, rating: 4.9, students: '12.4k', badge: 'Bestseller', badgeColor: 'text-accent border-accent/40 bg-accent/10', category: 'Development', slug: 'react-nextjs-developer' },
  { emoji: '🎨', title: 'UI/UX Design Mastery with Figma', instructor: 'Marcus Chen', price: 39, oldPrice: 149, rating: 4.8, students: '8.9k', badge: 'New', badgeColor: 'text-green-400 border-green-400/40 bg-green-400/10', category: 'Design', slug: 'uiux-design-figma' },
  { emoji: '🧠', title: 'Machine Learning & AI Bootcamp', instructor: 'Dr. Emily Ross', price: 79, oldPrice: 299, rating: 4.9, students: '21.3k', badge: 'Hot', badgeColor: 'text-accent border-accent/40 bg-accent/10', category: 'Data Science', slug: 'machine-learning-ai' },
]

export function CoursesSection() {
  return (
    <section id="courses" className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <span className="badge text-primary border-primary/40 bg-primary/10 mb-3 inline-flex">📚 Top Courses</span>
            <h2 className="font-sora font-bold text-4xl sm:text-5xl">Popular right now</h2>
          </div>
          <Link href="/courses" className="mt-4 sm:mt-0 btn-outline">View All Courses →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewCourses.map((c, i) => (
            <Link key={i} href={`/courses/${c.slug}`} className="glow-card overflow-hidden block group">
              <div className="h-48 bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center relative">
                <span className="text-6xl">{c.emoji}</span>
                <span className={`absolute top-3 right-3 badge text-xs ${c.badgeColor}`}>{c.badge}</span>
              </div>
              <div className="p-5">
                <span className="badge text-primary border-primary/30 bg-primary/10 text-xs mb-2 inline-flex">{c.category}</span>
                <h3 className="font-sora font-semibold text-base mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-gray-500 text-xs mb-3">By {c.instructor}</p>
                <div className="flex items-center gap-1 mb-4">
                  <span className="text-accent">{'★'.repeat(5)}</span>
                  <span className="text-accent text-xs font-semibold">{c.rating}</span>
                  <span className="text-gray-600 text-xs">({c.students})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-sora font-bold text-white text-lg">${c.price}</span>
                    <span className="text-gray-500 text-xs line-through ml-1">${c.oldPrice}</span>
                  </div>
                  <span className="shimmer-btn text-white text-xs font-semibold px-4 py-2 rounded-lg">Enroll Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======================== STATS ========================
export function StatsSection() {
  const counters = [
    { target: 500, suffix: 'K+', label: 'Active Learners' },
    { target: 1200, suffix: '+', label: 'Expert Courses' },
    { target: 98, suffix: '%', label: 'Satisfaction Rate' },
    { target: 50, suffix: '+', label: 'Industry Mentors' },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((c, i) => (
            <div key={i} className="text-center">
              <div className="font-sora font-bold text-5xl gradient-text mb-2">
                {c.target}{c.suffix}
              </div>
              <div className="text-gray-400 text-sm">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======================== TESTIMONIALS ========================
const testimonials = [
  { initials: 'JL', gradient: 'from-primary to-secondary', name: 'Jessica Lin', role: 'Software Engineer @ Stripe', text: 'EduLearn completely transformed my career. I went from customer service to full-stack developer in 8 months. The AI learning path was incredibly accurate.' },
  { initials: 'MR', gradient: 'from-pink-500 to-orange-400', name: 'Marcus Reid', role: 'Product Designer @ Figma', text: 'The live mentoring sessions are worth every penny. My mentor gave me real code reviews and helped me avoid mistakes that would have taken months to discover.' },
  { initials: 'AP', gradient: 'from-green-500 to-cyan-400', name: 'Anaya Patel', role: 'Cloud Architect @ AWS', text: 'I passed the AWS Solutions Architect exam on my first attempt thanks to EduLearn\'s structured course. The practice projects made all the difference.' },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge text-green-400 border-green-400/40 bg-green-400/10 mb-4 inline-flex">💬 Success Stories</span>
          <h2 className="font-sora font-bold text-4xl sm:text-5xl mb-4">Our students <span className="gradient-text">love us</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4 text-accent">{'★★★★★'}</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center font-bold text-sm`}>{t.initials}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======================== PRICING ========================
const plans = [
  {
    name: 'Free', price: 0, desc: 'Perfect for exploring', featured: false,
    features: [
      { text: '50+ free courses', included: true },
      { text: 'Community access', included: true },
      { text: 'Basic certificates', included: true },
      { text: 'AI learning paths', included: false },
      { text: 'Live mentoring', included: false },
    ],
    cta: 'Get Started Free', href: '/auth/register',
  },
  {
    name: 'Pro', price: 29, desc: 'For serious learners', featured: true,
    features: [
      { text: 'All 1,200+ courses', included: true },
      { text: 'AI learning paths', included: true },
      { text: 'Verified certificates', included: true },
      { text: '2 mentor sessions/mo', included: true },
      { text: 'Unlimited mentoring', included: false },
    ],
    cta: 'Start Pro Trial', href: '/auth/register?plan=pro',
  },
  {
    name: 'Enterprise', price: 99, desc: 'For teams & companies', featured: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited mentoring', included: true },
      { text: 'Team analytics', included: true },
      { text: 'Custom learning tracks', included: true },
      { text: 'Dedicated success manager', included: true },
    ],
    cta: 'Contact Sales', href: '/contact',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge text-secondary border-secondary/40 bg-secondary/10 mb-4 inline-flex">💎 Pricing</span>
          <h2 className="font-sora font-bold text-4xl sm:text-5xl mb-4">Simple, <span className="gradient-text">transparent pricing</span></h2>
          <p className="text-gray-400">No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-2xl p-6 relative ${plan.featured
              ? 'bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/50'
              : 'glow-card'}`}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge text-white border-primary bg-primary text-xs px-4">Most Popular</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-sora font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
                <div className="font-sora font-bold text-4xl">
                  {plan.price === 0 ? '$0' : `$${plan.price}`}
                  <span className="text-gray-500 text-lg font-normal">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-sm ${f.included ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className={f.included ? 'text-green-400' : 'text-gray-600'}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all
                ${plan.featured ? 'shimmer-btn text-white' : 'btn-outline'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ======================== CTA ========================
export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Join 500,000+ learners today</span>
        </div>
        <h2 className="font-sora font-bold text-4xl sm:text-6xl mb-6 leading-tight">
          Ready to transform<br /><span className="gradient-text">your future?</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Start with 50+ free courses. No credit card required. Join the fastest-growing online learning community.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="btn-primary px-10 py-4 text-base">
            Start Learning Free Today →
          </Link>
          <Link href="/courses" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            Browse all courses ↓
          </Link>
        </div>
      </div>
    </section>
  )
}
