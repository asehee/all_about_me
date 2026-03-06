import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import useTypewriter from '@/hooks/useTypewriter'
import SEO from '@/components/SEO'

const menuItems = [
  {
    id: 'about',
    label: 'Career',
    description: 'Who I am',
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'What I know about software',
  },
  {
    id: 'articles',
    label: 'Articles',
    description: 'What I read about software',
  },
  {
    id: 'etc',
    label: 'utils',
    description: 'Random utilities and experiments',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const typedLogging = useTypewriter('(...logging)')

  return (
    <>
      <SEO
        title="hee.dance - Software Engineer Portfolio"
        description="Human-centered problems. Practical solutions. Explore my career, technical blog, articles, and utilities."
        keywords="software engineer, portfolio, web development, blog, hee, developer"
        url="https://hee.dance/"
      />
      <motion.div
        className="min-h-screen bg-black px-5 py-10 md:px-10 md:py-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
      <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center">
        <motion.p
          className="text-xs uppercase tracking-[0.18em] text-white/45"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          hee.dance
        </motion.p>
        <motion.h1
          className="mt-4 text-center text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-7xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          hee {typedLogging}
          <span className="ml-0.5 inline-block animate-pulse text-white/75">|</span>
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-center text-sm leading-relaxed text-white/62 md:text-base"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          Human-centered problems. Practical solutions
        </motion.p>

        <section className="mt-12 w-full max-w-3xl">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const active = hoveredId === item.id

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => navigate(`/${item.id}`)}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                  className="group w-full border-b border-white/12 py-4 text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-xs text-white/40">0{index + 1}</span>
                      <h3 className="text-2xl font-medium text-white md:text-[2rem]">
                        {item.label}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/80" />
                  </div>

                  <motion.p
                    className="overflow-hidden text-sm text-white/58"
                    animate={{
                      maxHeight: active ? 56 : 0,
                      opacity: active ? 1 : 0,
                      marginTop: active ? 8 : 0,
                    }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    {item.description}
                  </motion.p>
                </motion.button>
              )
            })}
          </div>
        </section>
      </div>
    </motion.div>
    </>
  )
}
