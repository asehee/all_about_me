import { BookOpen, Plus } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Post } from '@/types/blog'
import { blogApi, writeTokenManager } from '@/services/blogApi'
import BackButton from '@/components/design/BackButton'
import PostList from './components/PostList'
import TagList from './components/TagList'
import PostDetail from './components/PostDetail'
import PostForm from './components/PostForm'
import PageShell from '@/components/design/PageShell'
import Modal from '@/components/design/Modal'
import SEO from '@/components/SEO'

export default function Blog() {
  const navigate = useNavigate()
  const location = useLocation()
  const { slug } = useParams<{ slug?: string }>()
  const isArticles = location.pathname.startsWith('/articles')
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasWriteToken, setHasWriteToken] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTokenInputModal, setShowTokenInputModal] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null)
  const listRequestId = useRef(0)
  const [detailError, setDetailError] = useState<{ id: string; message: string } | null>(null)

  const loadData = useCallback(async () => {
    const requestId = ++listRequestId.current
    setLoading(true)
    setError(null)
    try {
      const postType = isArticles ? 'article' : 'blog'
      const [fetchedPosts, fetchedTags] = await Promise.all([
        blogApi.getPosts({ type: postType }),
        blogApi.getTags({ type: postType }),
      ])
      if (requestId !== listRequestId.current) return
      setPosts(fetchedPosts)
      setTags(fetchedTags)
    } catch (e) {
      if (requestId !== listRequestId.current) return
      const message = e instanceof Error ? e.message : 'Failed to load journal data'
      setError(message)
    } finally {
      if (requestId === listRequestId.current) setLoading(false)
    }
  }, [isArticles])

  useEffect(() => {
    setHasWriteToken(writeTokenManager.exists())
    void loadData()
    return () => { listRequestId.current += 1 }
  }, [loadData])

  // Handle URL slug parameter
  useEffect(() => {
    if (slug) {
      const post = posts.find((p) => p.slug === slug)
      setSelectedPostId(post?.id ?? null)
    } else if (!slug) {
      setSelectedPostId(null)
    }
  }, [slug, posts])

  useEffect(() => {
    if (!selectedPostId) {
      setSelectedPost(null)
      return
    }

    let cancelled = false
    const fetchDetail = async () => {
      try {
        const post = await blogApi.getPost(selectedPostId)
        if (cancelled) return
        setSelectedPost(post)
        setDetailError(post ? null : { id: selectedPostId, message: 'Post not found.' })
      } catch (error) {
        if (cancelled) return
        setSelectedPost(null)
        setDetailError({ id: selectedPostId, message: error instanceof Error ? error.message : 'Unable to load this post.' })
      }
    }

    void fetchDetail()
    return () => { cancelled = true }
  }, [selectedPostId])


  const routePostId = posts.find((post) => post.slug === slug)?.id
  const routeDetailError = detailError?.id === routePostId ? detailError?.message : null

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
  const handlePostClick = (post: Post) => {
    const basePath = isArticles ? '/articles' : '/blog'
    navigate(`${basePath}/${post.slug}`)
  }

  const handleBackToList = () => {
    const basePath = isArticles ? '/articles' : '/blog'
    navigate(basePath)
    setEditingPost(null)
    setIsCreating(false)
  }

  const handleCreatePost = () => {
    if (!hasWriteToken) {
      setShowAuthModal(true)
      return
    }
    setIsCreating(true)
    setEditingPost(null)
    setSelectedPostId(null)
  }

  const handlePostCreated = async () => {
    await loadData()
    setEditingPost(null)
    setIsCreating(false)
  }

  const handleEditPost = () => {
    if (!selectedPost) return
    setEditingPost(selectedPost)
    setSelectedPostId(null)
    setIsCreating(false)
  }

  const handlePostDeleted = async () => {
    await loadData()
    setSelectedPostId(null)
    handleBackToList()
  }

  const handlePostDetailUpdate = async () => {
    await loadData()
    if (!selectedPostId) return
    const refreshed = await blogApi.getPost(selectedPostId)
    setSelectedPost(refreshed)
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

  // Extract plain text from HTML for description
  const getPlainTextDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return text.length > 160 ? text.substring(0, 157) + '...' : text
  }

  return (
    <>
      {selectedPost && selectedPost.slug === slug ? (
        <SEO
          title={`${selectedPost.title} - hee.dance`}
          description={getPlainTextDescription(selectedPost.content)}
          keywords={selectedPost.tags.join(', ')}
          url={`https://hee.dance/${isArticles ? 'articles' : 'blog'}/${selectedPost.slug}`}
          type="article"
          author={selectedPost.author}
          publishedTime={selectedPost.publishedAt || selectedPost.createdAt}
          modifiedTime={selectedPost.updatedAt}
        />
      ) : (
        <SEO
          title={isArticles ? 'Articles - hee.dance' : 'Blog - hee.dance'}
          description={
            isArticles
              ? 'Saved reads, highlights, and quick reviews about software engineering.'
              : 'Technical notes and thoughts about software development.'
          }
          keywords={
            isArticles
              ? 'articles, reading, software engineering, tech highlights'
              : 'blog, technical writing, software development, programming'
          }
          url={`https://hee.dance/${isArticles ? 'articles' : 'blog'}`}
        />
      )}
      <PageShell icon={BookOpen} >
      <Modal
        open={Boolean(noticeMessage)}
        title="Notice"
        description={noticeMessage ?? undefined}
        actions={
          <button
            onClick={() => setNoticeMessage(null)}
            className="rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
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
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-accent/60 transition-colors"
            >
              Close
            </button>
            <button
              onClick={openTokenInputModal}
              className="rounded-lg border border-border bg-foreground text-sm font-medium text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
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
            className="mt-4 w-full rounded-lg border border-border bg-muted/50 px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        }
        actions={
          <>
            <button
              onClick={() => setShowTokenInputModal(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-accent/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWriteToken}
              disabled={!tokenInput.trim()}
              className="rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              Save
            </button>
          </>
        }
      />
      {selectedPost && selectedPost.slug === slug && !isCreating && !editingPost ? (
        <PostDetail
          post={selectedPost}
          onBack={handleBackToList}
          onEdit={handleEditPost}
          onUpdate={handlePostDetailUpdate}
          onDelete={handlePostDeleted}
        />
      ) : isCreating || Boolean(editingPost) ? (
        <PostForm
          mode={editingPost ? 'edit' : 'create'}
          initialPost={editingPost}
          defaultType={isArticles ? 'article' : 'blog'}
          onBack={handleBackToList}
          onSuccess={handlePostCreated}
        />
      ) : slug ? (
        <div className="mx-auto max-w-3xl">
          <BackButton onClick={handleBackToList} />
          <div className="py-16" aria-live="polite" aria-busy={loading || (!error && !routeDetailError && Boolean(routePostId))}>
            {error || routeDetailError || (!loading && !posts.some((post) => post.slug === slug)) ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">{error || routeDetailError || 'Post not found.'}</p>
                <button className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent/60" onClick={() => { setDetailError(null); setSelectedPostId(null); void loadData() }}>Retry</button>
              </div>
            ) : (
              <div role="status">
                <p className="mb-10 text-sm text-muted-foreground">Loading post…</p>
                <div className="h-9 w-3/4 rounded bg-muted" />
                <div className="mt-5 h-3 w-1/3 rounded bg-muted" />
                <div className="mt-12 space-y-4">{[1, 2, 3, 4].map((line) => <div key={line} className="h-3 rounded bg-muted" />)}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <BackButton label="Home" onClick={() => navigate('/')} />
          </div>

          <header>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {isArticles ? 'Reading' : 'Journal'}
            </p>
            <h1 className="mt-4 page-title">
              {isArticles ? 'Articles' : 'Notes'}
            </h1>
            <p className="mt-5 text-sm text-muted-foreground md:text-base">
              {filteredPosts.length} {isArticles ? 'articles' : 'posts'}
            </p>
            {isArticles ? (
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Saved reads, highlights, and quick reviews.
              </p>
            ) : null}
          </header>

          <div className="mt-10 grid gap-8 lg:gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="order-2 lg:order-1">
              <div className="mb-8 flex min-h-[56px] items-center border-b border-border pb-4">
                <p className="text-sm text-muted-foreground">{isArticles ? 'Topics' : 'Tags'}</p>
              </div>
              <TagList
                tags={tags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-8 flex min-h-[56px] flex-wrap items-center justify-between gap-3 border-b border-border pb-4 lg:flex-nowrap">
                <p className="text-sm text-muted-foreground">
                  {selectedTag
                    ? `Filter: #${selectedTag}`
                    : isArticles
                      ? 'All articles'
                      : 'All posts'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={hasWriteToken ? handleClearWriteToken : openTokenInputModal}
                    className="h-8 whitespace-nowrap rounded-lg border border-border px-3 text-xs text-foreground/80 hover:bg-accent/60 transition-colors"
                  >
                    {hasWriteToken ? 'Clear Write Token' : 'Set Write Token'}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="flex h-8 items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-foreground px-3.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
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
                  className="w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {loading ? (
                <div className="text-muted-foreground text-center py-12">Loading...</div>
              ) : error ? (
                <div className="text-destructive text-center py-12">
                  {error}
                  <div className="mt-4">
                    <button
                      onClick={loadData}
                      className="px-4 py-2 rounded-lg bg-muted/50 hover:bg-accent/60 text-foreground text-sm transition-colors"
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
    </>
  )
}
