import { BookOpen, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Post } from '@/types/blog'
import { mockBlogApi, writeTokenManager } from '@/services/mockBlogApi'
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
  const [hasWriteToken, setHasWriteToken] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTokenInputModal, setShowTokenInputModal] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null)

  useEffect(() => {
    setHasWriteToken(writeTokenManager.exists())
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
    if (!hasWriteToken) {
      setShowAuthModal(true)
      return
    }
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

  const openTokenInputModal = () => {
    setTokenInput('')
    setShowTokenInputModal(true)
  }

  const handleSaveWriteToken = () => {
    if (!tokenInput.trim()) return
    writeTokenManager.set(tokenInput)
    setHasWriteToken(true)
    setShowTokenInputModal(false)
    setShowAuthModal(false)
    setNoticeMessage('Write token set for this browser session.')
  }

  const handleClearWriteToken = () => {
    writeTokenManager.clear()
    setHasWriteToken(false)
    setNoticeMessage('Write token cleared.')
  }

  return (
    <PageShell icon={BookOpen}>
      {noticeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Notice</h3>
            <p className="mt-3 text-sm text-white/70">{noticeMessage}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setNoticeMessage(null)}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Write Token Required</h3>
            <p className="mt-3 text-sm text-white/70">
              Creating a post requires an authentication token. Please set your write
              token first.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={openTokenInputModal}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors"
              >
                Set Write Token
              </button>
            </div>
          </div>
        </div>
      )}
      {showTokenInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#111827] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Set Write Token</h3>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter write token"
              className="mt-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowTokenInputModal(false)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWriteToken}
                disabled={!tokenInput.trim()}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
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
                  title={selectedTag ? `#${selectedTag}` : 'Notes'}
                  subtitle={`${filteredPosts.length} posts`}
                  accentClassName="from-blue-500 to-cyan-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={hasWriteToken ? handleClearWriteToken : openTokenInputModal}
                    className="px-4 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm"
                  >
                    {hasWriteToken ? 'Clear Write Token' : 'Set Write Token'}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Post
                  </button>
                </div>
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
