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
    <div className="flex flex-wrap gap-2.5">
      <motion.button
        type="button"
        aria-pressed={selectedTag === null}
        onClick={() => onTagSelect(null)}
        className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
          selectedTag === null
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-muted/50 text-foreground/80 hover:border-primary/50 hover:text-primary'
        }`}
        whileTap={{ scale: 0.98 }}
      >
        All
      </motion.button>
      {tags.map((tag) => (
        <motion.button
          key={tag}
          type="button"
          aria-pressed={selectedTag === tag}
          onClick={() => onTagSelect(tag)}
          className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
            selectedTag === tag
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-muted/50 text-foreground/80 hover:border-primary/50 hover:text-primary'
          }`}
          whileTap={{ scale: 0.98 }}
        >
          #{tag}
        </motion.button>
      ))}
    </div>
  )
}
