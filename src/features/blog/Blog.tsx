import { BookOpen, Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Post } from '@/types/blog'
import { blogApi, writeTokenManager } from '@/services/blogApi'
import BackButton from '@/components/design/BackButton'
import PostList from './components/PostList'
import TagList from './components/TagList'
import PostDetail from './components/PostDetail'
import PostForm from './components/PostForm'
import PageShell from '@/components/design/PageShell'
import Modal from '@/components/design/Modal'

export default function Blog() {
  const navigate = useNavigate()
  const location = useLocation()
  const isArticles = location.pathname.startsWith('/articles')
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
      const postType = isArticles ? 'article' : 'blog'
      const [fetchedPosts, fetchedTags] = await Promise.all([
        blogApi.getPosts({ type: postType }),
        blogApi.getTags({ type: postType }),
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
    <PageShell icon={BookOpen} contentClassName="bg-black">
      <Modal
        open={Boolean(noticeMessage)}
        title="Notice"
        description={noticeMessage ?? undefined}
        actions={
          <button
            onClick={() => setNoticeMessage(null)}
            className="rounded-lg border border-white/20 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors"
          >
            OK
          </button>
        }
      />
      <Modal
        open={showAuthModal}
        title="Write Token Required"
        description="Creating a post requires an authentication token. Please set your write token first."
        actions={
          <>
            <button
              onClick={() => setShowAuthModal(false)}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            <button
              onClick={openTokenInputModal}
              className="rounded-lg border border-white/20 bg-white text-sm font-medium text-black px-4 py-2 hover:bg-white/90 transition-colors"
            >
              Set Write Token
            </button>
          </>
        }
      />
      <Modal
        open={showTokenInputModal}
        title="Set Write Token"
        children={
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Enter write token"
            className="mt-4 w-full rounded-lg border border-white/20 bg-white/[0.03] px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
          />
        }
        actions={
          <>
            <button
              onClick={() => setShowTokenInputModal(false)}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWriteToken}
              disabled={!tokenInput.trim()}
              className="rounded-lg border border-white/20 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </>
        }
      />
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
          defaultType={isArticles ? 'article' : 'blog'}
          onBack={handleBackToList}
          onSuccess={handlePostCreated}
        />
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <BackButton label="Home" onClick={() => navigate('/')} />
          </div>

          <header>
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              {isArticles ? 'Reading' : 'Journal'}
            </p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white md:text-7xl">
              {isArticles ? 'Articles' : 'Notes'}
            </h1>
            <p className="mt-5 text-sm text-white/62 md:text-base">
              {filteredPosts.length} {isArticles ? 'articles' : 'posts'}
            </p>
            {isArticles ? (
              <p className="mt-3 text-sm text-white/55 md:text-base">
                Saved reads, highlights, and quick reviews.
              </p>
            ) : null}
          </header>

          <div className="mt-10 grid gap-8 lg:gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="order-2 lg:order-1">
              <div className="mb-8 flex min-h-[56px] items-center border-b border-white/12 pb-4">
                <p className="text-sm text-white/60">{isArticles ? 'Topics' : 'Tags'}</p>
              </div>
              <TagList
                tags={tags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-8 flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4 lg:flex-nowrap">
                <p className="text-sm text-white/60">
                  {selectedTag
                    ? `Filter: #${selectedTag}`
                    : isArticles
                      ? 'All articles'
                      : 'All posts'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={hasWriteToken ? handleClearWriteToken : openTokenInputModal}
                    className="h-8 whitespace-nowrap rounded-lg border border-white/20 px-3 text-xs text-white/80 hover:bg-white/10 transition-colors"
                  >
                    {hasWriteToken ? 'Clear Write Token' : 'Set Write Token'}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="flex h-8 items-center gap-2 whitespace-nowrap rounded-lg border border-white/20 bg-white px-3.5 text-xs font-medium text-black hover:bg-white/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {isArticles ? 'New Scrap' : 'New'}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isArticles
                      ? 'Search by title, source, author'
                      : 'Search by title, content, author'
                  }
                  className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
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
