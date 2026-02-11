import type { ComponentType, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageShellProps {
  icon: ComponentType<{ className?: string }>
  children: ReactNode
  contentClassName?: string
}

export default function PageShell({
  icon: Icon,
  children,
  contentClassName,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen">
      <motion.div
        className="fixed left-6 top-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-black/55 text-white backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Icon className="h-7 w-7" />
      </motion.div>

      <motion.div
        className={cn(
          'overflow-y-auto p-8 pt-24 md:p-12 md:pt-24',
          contentClassName
        )}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
