import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, MessageCircle, Send, Trash2, Pencil } from 'lucide-react'
import type { Post, Comment } from '@/types/blog'
import { useState } from 'react'
import { blogApi, writeTokenManager } from '@/services/blogApi'
import Modal from '@/components/design/Modal'

interface PostDetailProps {
  post: Post
  onBack: () => void
  onEdit: () => void
  onUpdate: () => void
  onDelete: () => void
}

export default function PostDetail({
  post,
  onBack,
  onEdit,
  onUpdate,
  onDelete,
}: PostDetailProps) {
  const normalizedContent = post.content.replace(
    /<br\s*\/?>\s*<br\s*\/?>/g,
    '</p><p>',
  )
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmState, setConfirmState] = useState<{
    type: 'delete-post' | 'delete-comment'
    commentId?: string
  } | null>(null)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [tokenInput, setTokenInput] = useState('')

  const handleAddComment = async (parentId: string | null = null) => {
    if (!commentAuthor.trim() || !commentContent.trim()) return

    setSubmitting(true)
    await blogApi.addComment({
      postId: post.id,
      parentId,
      author: commentAuthor.trim(),
      content: commentContent.trim(),
    })
    setCommentContent('')
    setReplyTo(null)
    setSubmitting(false)
    onUpdate()
  }

  const handleDeleteComment = async (commentId: string) => {
    setConfirmState({ type: 'delete-comment', commentId })
  }

  const handleDeletePost = async () => {
    if (!writeTokenManager.exists()) {
      setShowTokenModal(true)
      return
    }
    setConfirmState({ type: 'delete-post' })
  }

  const handleConfirmAction = async () => {
    if (!confirmState) return

    if (confirmState.type === 'delete-comment' && confirmState.commentId) {
      await blogApi.deleteComment(post.id, confirmState.commentId)
      setConfirmState(null)
      onUpdate()
      return
    }

    if (confirmState.type === 'delete-post') {
      await blogApi.deletePost(post.id)
      setConfirmState(null)
      await onDelete()
    }
  }

  const handleSaveWriteToken = () => {
    if (!tokenInput.trim()) return
    writeTokenManager.set(tokenInput)
    setTokenInput('')
    setShowTokenModal(false)
    setConfirmState({ type: 'delete-post' })
  }

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isReplyingTo = replyTo === comment.id

    return (
      <div
        key={comment.id}
        className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'} space-y-4`}
      >
        <div className="rounded-lg border border-white/12 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-white font-medium">{comment.author}</span>
              <span className="text-white/40 text-sm ml-3">
                {new Date(comment.createdAt).toLocaleString('en-US')}
              </span>
            </div>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-white/40 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-white/80 mb-3">{comment.content}</p>

          <button
            onClick={() => setReplyTo(isReplyingTo ? null : comment.id)}
            className="text-sm text-white/65 hover:text-white/85 transition-colors"
          >
            {isReplyingTo ? 'Cancel' : 'Reply'}
          </button>

          {/* 답글 작성 폼 */}
          {isReplyingTo && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Nickname"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-40 rounded-lg border border-white/20 bg-white/[0.03] px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <input
                type="text"
                placeholder="Write a reply"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddComment(comment.id)
                  }
                }}
                className="flex-1 rounded-lg border border-white/20 bg-white/[0.03] px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                onClick={() => handleAddComment(comment.id)}
                disabled={submitting}
                className="rounded-lg border border-white/20 bg-white px-4 py-2 text-black hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 대댓글 렌더링 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-black p-8"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Modal
        open={showTokenModal}
        title="Write Token Required"
        description="Deleting a post requires an authentication token."
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
              onClick={() => {
                setShowTokenModal(false)
                setTokenInput('')
              }}
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
      <Modal
        open={Boolean(confirmState)}
        title="Confirm"
        description={
          confirmState?.type === 'delete-post'
            ? 'Delete this post?'
            : 'Delete this comment?'
        }
        actions={
          <>
            <button
              onClick={() => setConfirmState(null)}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </>
        }
      />
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* 포스트 내용 */}
        <article className="mb-12">
          {/* 제목 */}
          <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="mb-8 flex items-center gap-6 border-b border-white/12 pb-6 text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleString('en-US')}
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-sm text-white/75">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="prose prose-invert max-w-none">
            <div
              className="rich-content text-white/80"
              dangerouslySetInnerHTML={{ __html: normalizedContent }}
            />
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-white" />
            <h2 className="text-2xl font-bold text-white">
              Comments {post.comments?.length || 0}
            </h2>
          </div>

          {/* 댓글 작성 */}
          <div className="mb-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Nickname"
                value={replyTo === null ? commentAuthor : ''}
                onChange={(e) => {
                  if (replyTo === null) setCommentAuthor(e.target.value)
                }}
                disabled={replyTo !== null}
                className="w-full rounded-lg border border-white/20 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50 md:w-56"
              />
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  placeholder="Write a comment"
                  value={replyTo === null ? commentContent : ''}
                  onChange={(e) => {
                    if (replyTo === null) setCommentContent(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && replyTo === null) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                  disabled={replyTo !== null}
                  className="flex-1 rounded-lg border border-white/20 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => handleAddComment()}
                  disabled={submitting || replyTo !== null}
                  className="rounded-lg border border-white/20 bg-white px-6 py-3 text-black hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => renderComment(comment))
            ) : (
              <p className="text-white/40 text-center py-8">
                Be the first to comment
              </p>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
