import type { ComponentType, ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import './editorial.css'

interface PageShellProps {
  icon: ComponentType<{ className?: string }>
  children: ReactNode
  contentClassName?: string
}

const navigation = [
  { path: '/about', label: 'Career' },
  { path: '/blog', label: 'Blog' },
  { path: '/articles', label: 'Articles' },
  { path: '/etc', label: 'Utils' },
]

export default function PageShell({ icon: Icon, children, contentClassName }: PageShellProps) {
  return (
    <div className="page-shell">
      <a className="page-skip" href="#page-content">Skip to content</a>
      <header className="page-navigation">
        <Link to="/" className="page-brand" aria-label="hee.dance home">hee<span>.</span></Link>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => cn('page-nav-link', isActive && 'is-current')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Icon className="page-navigation-icon" />
      </header>
      <main
        id="page-content"
        className={cn('page-content', contentClassName)}
      >
        {children}
      </main>
      <footer className="page-footer"><span>© {new Date().getFullYear()} hee</span><Link to="/">Back home ↗</Link></footer>
    </div>
  )
}
