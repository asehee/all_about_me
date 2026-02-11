import { motion } from 'framer-motion'
import AppCard from '@/components/design/AppCard'

interface InfoSection {
  title: string
  description: string
}

interface InfoSectionListProps {
  sections: InfoSection[]
}

export default function InfoSectionList({ sections }: InfoSectionListProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
    >
      {sections.map((section) => (
        <AppCard key={section.title}>
          <h2 className="mb-3 text-2xl font-semibold text-white">{section.title}</h2>
          <p className="leading-relaxed text-white/70">{section.description}</p>
        </AppCard>
      ))}
    </motion.div>
  )
}
