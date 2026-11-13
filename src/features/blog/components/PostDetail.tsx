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
        className={`${depth > 0 && depth < 3 ? 'ml-3 mt-4 sm:ml-6' : 'mt-4'} space-y-4`}
      >
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-foreground font-medium">{comment.author}</span>
              <span className="text-muted-foreground text-sm ml-3">
                {new Date(comment.createdAt).toLocaleString('en-US')}
              </span>
            </div>
            <button
              aria-label="Delete comment"
              onClick={() => handleDeleteComment(comment.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-foreground/80 break-words mb-3">{comment.content}</p>

          <button
            onClick={() => setReplyTo(isReplyingTo ? null : comment.id)}
            className="text-sm text-muted-foreground hover:text-primary/80 transition-colors"
          >
            {isReplyingTo ? 'Cancel' : 'Reply'}
          </button>

          {/* 답글 작성 폼 */}
          {isReplyingTo && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                aria-label="Nickname"
                placeholder="Nickname"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full sm:w-32 rounded-lg border border-border bg-muted/50 px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="text"
                aria-label="Write a reply"
                placeholder="Write a reply"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddComment(comment.id)
                  }
                }}
                className="min-w-0 flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                aria-label="Send reply"
                onClick={() => handleAddComment(comment.id)}
                disabled={submitting}
                className="rounded-lg border border-border bg-foreground px-4 py-2 text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
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
    <div className="mx-auto max-w-3xl">
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
            className="mt-4 w-full rounded-lg border border-border bg-muted/50 px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        }
        actions={
          <>
            <button
              onClick={() => {
                setShowTokenModal(false)
                setTokenInput('')
              }}
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
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-accent/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-foreground hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </>
        }
      />
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* 포스트 내용 */}
        <article className="mb-12">
          {/* 제목 */}
          <h1 className="post-title mb-6">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleString('en-US')}
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-sm text-foreground/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="max-w-none">
            <div
              className="rich-content text-foreground/80"
              dangerouslySetInnerHTML={{ __html: normalizedContent }}
            />
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="border-t border-border pt-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-foreground" />
            <h2 className="text-2xl font-normal text-foreground">
              Comments {post.comments?.length || 0}
            </h2>
          </div>

          {/* 댓글 작성 */}
          <div className="mb-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                aria-label="Nickname"
                placeholder="Nickname"
                value={replyTo === null ? commentAuthor : ''}
                onChange={(e) => {
                  if (replyTo === null) setCommentAuthor(e.target.value)
                }}
                disabled={replyTo !== null}
                className="w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50 md:w-56"
              />
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  aria-label="Write a comment"
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
                  className="min-w-0 flex-1 rounded-lg border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                <button
                  aria-label="Send comment"
                  onClick={() => handleAddComment()}
                  disabled={submitting || replyTo !== null}
                  className="rounded-lg border border-border bg-foreground px-6 py-3 text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
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
              <p className="text-muted-foreground text-center py-8">
                Be the first to comment
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
