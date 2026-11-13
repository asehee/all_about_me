import { ArrowUpRight } from 'lucide-react'
import type { Post } from '@/types/blog'

interface PostListProps {
  posts: Post[]
  onPostClick: (post: Post) => void
}

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export default function PostList({ posts, onPostClick }: PostListProps) {
  if (posts.length === 0) {
    return <div className="border-t border-border py-16 text-center text-sm text-muted-foreground">No posts yet</div>
  }

  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <button key={post.id} type="button" className="post-row" onClick={() => onPostClick(post)}>
          <span className="post-row-number">{String(posts.length - index).padStart(2, '0')}</span>
          <div className="min-w-0">
            <h3 className="post-row-title">{post.title}</h3>
            <p className="post-row-excerpt line-clamp-2">{stripHtml(post.content)}</p>
            {post.tags.length > 0 && <div className="post-row-tags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
            <div className="post-row-meta">
              <span>{post.author}</span>
              <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</time>
              <span>{post.commentCount ?? post.comments.length} comments</span>
            </div>
          </div>
          <ArrowUpRight className="post-row-arrow" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
