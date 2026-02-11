import { motion } from 'framer-motion'
import { Calendar, Tag } from 'lucide-react'
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          onClick={() => onPostClick(post)}
          className="group cursor-pointer"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all h-full flex flex-col">
            {/* 제목 */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* 내용 미리보기 */}
            <p className="text-white/60 text-sm mb-4 line-clamp-3 flex-1">
              {post.content}
            </p>

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Tag className="w-3 h-3 text-white/40" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex w-fit items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-200 transition-colors hover:border-cyan-300 hover:text-cyan-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 날짜 */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Calendar className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
