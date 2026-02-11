import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import SectionHeader from '@/components/design/SectionHeader'
import AppCard from '@/components/design/AppCard'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex">
      <motion.div
        className="w-24 md:w-32 flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-500 flex flex-col items-center justify-between p-6"
        initial={{ width: '100vw', height: '100vh' }}
        animate={{ width: '8rem', height: '100vh' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <BackButton label="Home" onClick={() => navigate('/')} className="px-3" />
        </motion.div>

        <motion.div
          initial={{ scale: 2.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <User className="h-9 w-9 text-white md:h-11 md:w-11" />
        </motion.div>

        <motion.div
          className="text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-xs md:text-sm font-medium writing-vertical">About</div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 overflow-y-auto p-8 md:p-12"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            title="About Me"
            subtitle="A short introduction and what I care about."
            accentClassName="from-cyan-500 to-blue-500"
          />

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <AppCard>
              <h2 className="mb-3 text-2xl font-semibold text-white">Intro</h2>
              <p className="leading-relaxed text-white/70">
                Replace this with your story, values, and background.
              </p>
            </AppCard>
            <AppCard>
              <h2 className="mb-3 text-2xl font-semibold text-white">Experience</h2>
              <p className="leading-relaxed text-white/70">
                Add your highlights, roles, and impact timeline.
              </p>
            </AppCard>
            <AppCard>
              <h2 className="mb-3 text-2xl font-semibold text-white">Skills</h2>
              <p className="leading-relaxed text-white/70">
                List the tools and capabilities you use in real projects.
              </p>
            </AppCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
