import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          className="relative min-h-screen"
          initial={{ opacity: 0.92 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.96 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <Outlet />

          <div className="pointer-events-none fixed inset-0 z-50 flex">
            <motion.div
              className="h-full w-1/2 origin-left bg-[#070b14]"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="h-full w-1/2 origin-right bg-[#070b14]"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
