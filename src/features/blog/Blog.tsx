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
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [fetchedPosts, fetchedTags] = await Promise.all([
      mockBlogApi.getPosts(),
      mockBlogApi.getTags(),
    ])
    setPosts(fetchedPosts)
    setTags(fetchedTags)
    setLoading(false)
  }

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts
  const selectedPost = selectedPostId
    ? posts.find((p) => p.id === selectedPostId) ?? null
    : null

  const handlePostClick = (post: Post) => {
    setSelectedPostId(post.id)
    setIsCreating(false)
  }

  const handleBackToList = () => {
    setSelectedPostId(null)
    setIsCreating(false)
  }

  const handleCreatePost = () => {
    setIsCreating(true)
    setSelectedPostId(null)
  }

  const handlePostCreated = async () => {
    await loadData()
    setIsCreating(false)
  }

  const handlePostDeleted = async () => {
    await loadData()
    setSelectedPostId(null)
  }

  return (
    <PageShell icon={BookOpen}>
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onBack={handleBackToList}
          onUpdate={loadData}
          onDelete={handlePostDeleted}
        />
      ) : isCreating ? (
        <PostForm onBack={handleBackToList} onSuccess={handlePostCreated} />
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
                  title={selectedTag ? `#${selectedTag}` : 'All Posts'}
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

              {loading ? (
                <div className="text-white/60 text-center py-12">Loading...</div>
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
