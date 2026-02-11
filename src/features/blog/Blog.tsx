import { motion } from 'framer-motion'
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
    <div className="min-h-screen flex">
      {/* 왼쪽: 아이콘 + 태그 영역 */}
      <motion.div
        className="w-64 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500 flex flex-col"
        initial={{ width: '100vw', height: '100vh' }}
        animate={{ width: '16rem', height: '100vh' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="p-6 space-y-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <BackButton label="Home" onClick={() => navigate('/')} />
          </motion.button>

          <motion.div
            initial={{ scale: 3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white">Blog</h2>
            <p className="text-sm text-white/70">Thoughts and notes</p>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 overflow-y-auto px-6 pb-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TagList
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        </motion.div>
      </motion.div>

      {/* 오른쪽: 글 목록/상세 영역 */}
      <motion.div
        className="flex-1 overflow-y-auto"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
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
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <SectionHeader
                  className="mb-0"
                  title={selectedTag ? `#${selectedTag}` : 'All Posts'}
                  subtitle={`${filteredPosts.length} posts`}
                  accentClassName="from-blue-500 to-cyan-500"
                />
              </div>
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
        )}
      </motion.div>
    </div>
  )
}
