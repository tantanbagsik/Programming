import Link from 'next/link'

const footerLinks = {
  Courses: ['Development', 'Design', 'Data Science', 'Business', 'Marketing'],
  Company: ['About Us', 'Careers', 'Blog', 'Press', 'Partners'],
  Support: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'],
}

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg shimmer-btn flex items-center justify-center text-sm font-bold font-sora">R</div>
              <span className="font-sora font-bold text-xl gradient-text">Raypanganiban</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-xs">
              Empowering millions of learners worldwide to build the skills they need for the jobs of tomorrow.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', '▶'].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg border border-border hover:border-primary/50 flex items-center justify-center text-gray-400 hover:text-white transition-all text-sm">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sora font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 Raypanganiban. All rights reserved.</p>
          <p className="text-gray-600 text-sm">Made with ❤️ for lifelong learners</p>
        </div>
      </div>
    </footer>
  )
}
