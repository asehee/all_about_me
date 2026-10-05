import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import SEO from '@/components/SEO'
import HomeHeroObject from './components/HomeHeroObject'
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
        title="hee - Software Engineer Portfolio"
        description="Human-centered problems. Practical solutions. Notes on software, good reads, and small experiments."
        keywords="software engineer, portfolio, web development, blog, hee, developer"
        url="https://hee.dance/"
      />
      <main className="home-editorial" id="top">
        <a className="home-skip" href="#explore">Skip to content</a>
        <section className="home-hero" aria-label="Introduction">
          <header className="home-intro">
            <p>Software Engineer</p>
            <Link to="/about">[about me]</Link>
          </header>

          <HomeHeroObject variant="floppy" />

          <div className="home-hero-bottom"><a href="#explore">Explore <ArrowDown size={14} aria-hidden="true" /></a></div>
          <h1 className="home-wordmark">hee<span>.</span>dance</h1>
        </section>

        <section className="home-explore" id="explore" aria-labelledby="home-explore-title">
          <div className="home-section-label"><h2 id="home-explore-title">Explore</h2><span>01 — 04</span></div>
          {sections.map((section, index) => (
            <Link className="home-entry" to={section.path} key={section.path}>
              <span className="home-entry-index">0{index + 1}</span>
              <h3>{section.title}</h3>
              <ArrowUpRight className="home-entry-arrow" aria-hidden="true" />
            </Link>
          ))}
        </section>

        <footer className="home-footer">
          <div className="home-footer-bottom"><span>© {new Date().getFullYear()} hee</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}>Back to top ↑</a></div>
        </footer>
      </main>
    </>
  )
}
