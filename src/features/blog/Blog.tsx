import { BookOpen, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Post } from '@/types/blog'
import { mockBlogApi } from '@/services/mockBlogApi'
import BackButton from '@/components/design/BackButton'
import SectionHeader from '@/components/design/SectionHeader'
import PostList from './components/PostList'
import TagList from './components/TagList'
import PostDetail from './components/PostDetail'
import PostForm from './components/PostForm'
import PageShell from '@/components/design/PageShell'

export default function Blog() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [fetchedPosts, fetchedTags] = await Promise.all([
        mockBlogApi.getPosts(),
        mockBlogApi.getTags(),
      ])
      setPosts(fetchedPosts)
      setTags(fetchedTags)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load journal data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
    const q = searchQuery.trim().toLowerCase()
    const matchesQuery = q
      ? post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
      : true
    return matchesTag && matchesQuery
  })
  const selectedPost = selectedPostId
    ? posts.find((p) => p.id === selectedPostId) ?? null
    : null
  const editingPost = editingPostId
    ? posts.find((p) => p.id === editingPostId) ?? null
    : null

  const handlePostClick = (post: Post) => {
    setSelectedPostId(post.id)
    setEditingPostId(null)
    setIsCreating(false)
  }

  const handleBackToList = () => {
    setSelectedPostId(null)
    setEditingPostId(null)
    setIsCreating(false)
  }

  const handleCreatePost = () => {
    setIsCreating(true)
    setEditingPostId(null)
    setSelectedPostId(null)
  }

  const handlePostCreated = async () => {
    await loadData()
    setEditingPostId(null)
    setIsCreating(false)
  }

  const handleEditPost = () => {
    if (!selectedPostId) return
    setEditingPostId(selectedPostId)
    setSelectedPostId(null)
    setIsCreating(false)
  }

  const handlePostDeleted = async () => {
    await loadData()
    setSelectedPostId(null)
    setEditingPostId(null)
  }

  return (
    <PageShell icon={BookOpen}>
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onBack={handleBackToList}
          onEdit={handleEditPost}
          onUpdate={loadData}
          onDelete={handlePostDeleted}
        />
      ) : isCreating || editingPost ? (
        <PostForm
          mode={editingPost ? 'edit' : 'create'}
          initialPost={editingPost}
          onBack={handleBackToList}
          onSuccess={handlePostCreated}
        />
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <BackButton label="Home" onClick={() => navigate('/')} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="order-2 lg:order-1">
              <TagList
                tags={tags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-8 flex items-center justify-between gap-4">
                <SectionHeader
                  className="mb-0"
                  title={selectedTag ? `#${selectedTag}` : 'Journal Board'}
                  subtitle={`${filteredPosts.length} posts`}
                  accentClassName="from-blue-500 to-cyan-500"
                />
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Post
                </button>
              </div>

              <div className="mb-6">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, content, author"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {loading ? (
                <div className="text-white/60 text-center py-12">Loading...</div>
              ) : error ? (
                <div className="text-red-300/90 text-center py-12">
                  {error}
                  <div className="mt-4">
                    <button
                      onClick={loadData}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <PostList posts={filteredPosts} onPostClick={handlePostClick} />
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
