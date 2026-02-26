import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag, MessageCircle, Send, Trash2, Pencil } from 'lucide-react'
import type { Post, Comment } from '@/types/blog'
import { useState } from 'react'
import { mockBlogApi } from '@/services/mockBlogApi'

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
  const [commentContent, setCommentContent] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAddComment = async (parentId: string | null = null) => {
    if (!commentContent.trim()) return

    setSubmitting(true)
    await mockBlogApi.addComment({
      postId: post.id,
      parentId,
      content: commentContent.trim(),
    })
    setCommentContent('')
    setReplyTo(null)
    setSubmitting(false)
    onUpdate()
  }

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Delete this comment?')) {
      await mockBlogApi.deleteComment(post.id, commentId)
      onUpdate()
    }
  }

  const handleDeletePost = async () => {
    if (confirm('Delete this post?')) {
      await mockBlogApi.deletePost(post.id)
      await onDelete()
    }
  }

  const renderComment = (comment: Comment, depth: number = 0) => {
    const isReplyingTo = replyTo === comment.id

    return (
      <div
        key={comment.id}
        className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'} space-y-4`}
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-white font-medium">{comment.author}</span>
              <span className="text-white/40 text-sm ml-3">
                {new Date(comment.createdAt).toLocaleString('en-US')}
              </span>
            </div>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-white/80 mb-3">{comment.content}</p>

          <button
            onClick={() => setReplyTo(isReplyingTo ? null : comment.id)}
            className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
          >
            {isReplyingTo ? 'Cancel' : 'Reply'}
          </button>

          {/* 답글 작성 폼 */}
          {isReplyingTo && (
            <div className="mt-4 flex gap-2">
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
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={() => handleAddComment(comment.id)}
                disabled={submitting}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
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
      className="min-h-screen p-8"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
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

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
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
          <div className="flex items-center gap-6 mb-8 text-white/60">
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
                    <span key={tag} className="text-sm text-cyan-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
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
            <div className="flex gap-2">
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
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleAddComment()}
                disabled={submitting || replyTo !== null}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
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
