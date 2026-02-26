import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UserRound, PenLine, BriefcaseBusiness, Sparkles } from 'lucide-react'

const menuItems = [
  {
    id: 'about',
    icon: UserRound,
    label: 'About',
    description: 'Who I am and how I work',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'blog',
    icon: PenLine,
    label: 'Thoughts',
    description: 'Journal posts and ideas',
    color: 'from-rose-400 to-orange-500',
  },
  {
    id: 'profile',
    icon: BriefcaseBusiness,
    label: 'Work',
    description: 'Projects and experience',
    color: 'from-lime-400 to-emerald-500',
  },
  {
    id: 'etc',
    icon: Sparkles,
    label: 'Labs',
    description: 'Experiments and side notes',
    color: 'from-fuchsia-400 to-violet-500',
  },
]

export default function Home() {
  const navigate = useNavigate()

  const handleClick = (id: string) => {
    navigate(`/${id}`)
  }

  return (
    <motion.div
      className="min-h-screen px-4 pb-8 pt-8 md:px-10 md:pb-12 md:pt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-14">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            hee.dance
          </h1>
          <p className="mt-3 text-sm text-white/65 md:text-base">
            Personal space for profile, journal, and experiments
          </p>
        </motion.div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/15 md:p-9">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity group-hover:opacity-20`}
                  />
                  <div className="relative flex flex-col items-center justify-center space-y-4 text-center">
                    <Icon className="h-11 w-11 text-white transition-transform group-hover:scale-110 md:h-12 md:w-12" />
                    <div>
                      <h3 className="text-xl font-semibold text-white md:text-2xl">
                        {item.label}
                      </h3>
                      <p className="mt-1 text-sm text-white/65">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
