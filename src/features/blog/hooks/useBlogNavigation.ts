import { useState } from 'react'
import type { Post } from '@/types/blog'

export function useBlogNavigation() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

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

  const handleEditPost = () => {
    if (!selectedPostId) return
    setEditingPostId(selectedPostId)
    setSelectedPostId(null)
    setIsCreating(false)
  }

  const startCreating = () => {
    setIsCreating(true)
    setEditingPostId(null)
    setSelectedPostId(null)
  }

  const resetNavigation = () => {
    setSelectedPostId(null)
    setEditingPostId(null)
    setIsCreating(false)
  }

  return {
    selectedPostId,
    editingPostId,
    isCreating,
    handlePostClick,
    handleBackToList,
    handleEditPost,
    startCreating,
    resetNavigation,
  }
}
