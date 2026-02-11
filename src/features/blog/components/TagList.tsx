import { motion } from 'framer-motion'
import { Tag } from 'lucide-react'

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/80 mb-4">
        <Tag className="w-4 h-4" />
        <span className="text-sm font-medium">Tags</span>
      </div>

      <motion.button
        onClick={() => onTagSelect(null)}
        className={`flex w-fit items-center rounded-full px-4 py-2 text-sm transition-all ${
          selectedTag === null
            ? 'bg-white/20 text-white'
            : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        All
      </motion.button>

      <div className="space-y-3">
        {tags.map((tag) => (
          <motion.button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`flex w-fit items-center rounded-full px-4 py-2 text-sm transition-all ${
              selectedTag === tag
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
