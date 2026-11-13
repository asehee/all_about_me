import { Link } from 'react-router-dom'
import HomeBuildTitle from './components/HomeBuildTitle'
import HomeLatestPosts from './components/HomeLatestPosts'
import SEO from '@/components/SEO'
import './home.css'

const sections = [
  { path: '/blog', title: 'Blog' },
  { path: '/articles', title: 'Articles' },
  { path: '/about', title: 'Career' },
  { path: '/etc', title: 'Utils' },
]

export default function Home() {
  return (
    <>
      <SEO
        title="build — hee"
        description="Human-centered problems. Practical solutions. Notes on software, good reads, and small experiments."
        keywords="software engineer, portfolio, web development, blog, hee, developer"
        url="https://hee.dance/"
      />
      <main className="home-editorial" id="top">
        <a className="home-skip" href="#latest">Skip to content</a>
        <section className="home-hero" aria-label="Introduction">
          <header className="home-intro">
            <p>Software Engineer</p>
            <nav aria-label="Main navigation">
              {sections.map((section) => <Link to={section.path} key={section.path}>{section.title}</Link>)}
            </nav>
          </header>

          <HomeBuildTitle />
          <div className="home-hero-bottom">
            <p>Notes on software.</p>
            <a href="#latest">Latest posts ↓</a>
          </div>
        </section>

        <HomeLatestPosts />

        <footer className="home-footer">
          <div className="home-footer-bottom"><span>© {new Date().getFullYear()} hee</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}>Back to top ↑</a></div>
        </footer>
      </main>
    </>
  )
}
