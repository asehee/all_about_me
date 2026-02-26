import { motion } from 'framer-motion'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { mockBlogApi } from '@/services/mockBlogApi'
import type { Post } from '@/types/blog'
import Modal from '@/components/design/Modal'

interface PostFormProps {
  mode?: 'create' | 'edit'
  initialPost?: Post | null
  onBack: () => void
  onSuccess: () => void
}

export default function PostForm({
  mode = 'create',
  initialPost = null,
  onBack,
  onSuccess,
}: PostFormProps) {
  const [title, setTitle] = useState(initialPost?.title ?? '')
  const [content, setContent] = useState(initialPost?.content ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialPost?.tags ?? [])
  const [saving, setSaving] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const isEditMode = mode === 'edit' && !!initialPost

  useEffect(() => {
    setTitle(initialPost?.title ?? '')
    setContent(initialPost?.content ?? '')
    setTags(initialPost?.tags ?? [])
  }, [initialPost])

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setValidationMessage('Please enter title and content')
      return
    }

    setSaving(true)
    if (isEditMode && initialPost) {
      await mockBlogApi.updatePost(initialPost.id, {
        title: title.trim(),
        content: content.trim(),
        tags,
      })
    } else {
      await mockBlogApi.createPost({
        title: title.trim(),
        content: content.trim(),
        tags,
      })
    }
    setSaving(false)
    onSuccess()
  }

  return (
    <motion.div
      className="min-h-screen bg-[#0a0a0a] p-8"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Modal
        open={Boolean(validationMessage)}
        title="Validation"
        description={validationMessage ?? undefined}
        actions={
          <button
            onClick={() => setValidationMessage(null)}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 transition-colors"
          >
            OK
          </button>
        }
      />
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none"
            />
          </div>

          {/* 태그 입력 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a tag and press enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 내용 */}
          <div>
            <textarea
              placeholder="Write your content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
