import { motion } from 'framer-motion'

interface TagListProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export default function TagList({
  tags,
  selectedTag,
  onTagSelect,
}: TagListProps) {
  return (
    <div>
      <div className="mb-8 flex min-h-[56px] items-center border-b border-white/12 pb-4">
        <p className="text-sm text-white/60">Tags</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <motion.button
          onClick={() => onTagSelect(null)}
          className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
            selectedTag === null
              ? 'border-white bg-white text-black'
              : 'border-white/20 bg-white/[0.03] text-white/70 hover:border-white/35 hover:text-white'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          All
        </motion.button>
        {tags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              selectedTag === tag
                ? 'border-white bg-white text-black'
                : 'border-white/20 bg-white/[0.03] text-white/70 hover:border-white/35 hover:text-white'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
