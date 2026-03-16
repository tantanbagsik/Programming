import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { CoursesSection } from '@/components/home/CoursesSection'
import { StatsSection } from '@/components/home/StatsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PricingSection } from '@/components/home/PricingSection'
import { CTASection } from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <CoursesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

function TrustedBySection() {
  const companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Netflix', 'Spotify', 'Meta', 'Tesla']
  return (
    <section className="py-12 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm font-medium mb-8 tracking-widest uppercase">Trusted by learners from</p>
        <div className="flex overflow-hidden">
          <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
            {[...companies, ...companies].map((c, i) => (
              <span key={i} className="text-gray-600 font-sora font-bold text-xl hover:text-gray-400 transition-colors cursor-default">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
