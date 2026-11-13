import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { blogApi } from '@/services/blogApi'
import type { Post } from '@/types/blog'

const postDate = (post: Post) => post.publishedAt || post.createdAt
const timestamp = (post: Post) => Date.parse(postDate(post)) || 0

export default function HomeLatestPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setFailed(false)

    void blogApi.getPosts({ type: 'blog' }).then((posts) => {
      if (cancelled) return
      setPosts(posts
        .filter((post) => post.type === 'blog' && post.status === 'published' && post.slug)
        .sort((a, b) => timestamp(b) - timestamp(a))
        .slice(0, 3))
    }).catch(() => {
      if (!cancelled) setFailed(true)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
  }, [attempt])

  return (
    <section className="home-explore" id="latest" aria-labelledby="home-latest-title">
      <div className="home-section-label">
        <h2 id="home-latest-title">Latest posts</h2>
        <Link to="/blog" className="home-all-posts">All posts <ArrowUpRight size={12} aria-hidden="true" /></Link>
      </div>
      <div aria-busy={loading} aria-live="polite">
        {loading ? (
          <div className="home-posts-loading" role="status">
            <span className="home-sr-only">Loading posts…</span>
            {[0, 1, 2].map((index) => <div className="home-post-placeholder" key={index} aria-hidden="true"><span /><span /></div>)}
          </div>
        ) : failed ? (
          <div className="home-posts-message" role="status">
            <p>Unable to load posts.</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)}>Try again ↗</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="home-posts-message"><p>No posts published yet.</p></div>
        ) : (
          posts.map((post, index) => {
            const date = postDate(post)
            const validDate = !Number.isNaN(Date.parse(date))
            return (
              <Link className="home-entry" to={`/blog/${encodeURIComponent(post.slug)}`} key={post.id}>
                <span className="home-entry-index">0{index + 1}</span>
                <div className="home-post-content">
                  <h3>{post.title}</h3>
                  {validDate && <time dateTime={date}>{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Seoul' })}</time>}
                </div>
                <ArrowUpRight className="home-entry-arrow" aria-hidden="true" />
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
