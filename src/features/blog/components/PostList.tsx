import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import type { Post } from '@/types/blog'

interface PostListProps {
  posts: Post[]
  onPostClick: (post: Post) => void
}

export default function PostList({ posts, onPostClick }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="hidden md:grid grid-cols-[72px_minmax(0,1fr)_140px_120px] gap-4 px-5 py-3 border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wide">
        <span>No</span>
        <span>Title</span>
        <span>Author</span>
        <span>Date</span>
      </div>

      {posts.map((post, index) => (
        <motion.button
          key={post.id}
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          onClick={() => onPostClick(post)}
          className="w-full text-left px-5 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
        >
          <div className="md:grid md:grid-cols-[72px_minmax(0,1fr)_140px_120px] md:items-center md:gap-4">
            <span className="hidden md:block text-sm text-white/40">
              {posts.length - index}
            </span>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white truncate hover:text-cyan-300 transition-colors">
                {post.title}
              </h3>
              <p className="mt-1 text-sm text-white/50 line-clamp-1">
                {post.content}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-white/40 md:hidden">
                <span>{post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>

            <span className="hidden md:block text-sm text-white/60">
              {post.author}
            </span>
            <span className="hidden md:block text-sm text-white/40">
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <span className="inline-flex items-center gap-1 text-xs text-white/40">
              <MessageCircle className="w-3 h-3" />
              {post.comments.length}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
