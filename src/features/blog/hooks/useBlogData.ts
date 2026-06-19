import { useState, useCallback } from 'react'
import type { Post } from '@/types/blog'
import { blogApi } from '@/services/blogApi'

export function useBlogData() {
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [fetchedPosts, fetchedTags] = await Promise.all([
        blogApi.getPosts(),
        blogApi.getTags(),
      ])
      setPosts(fetchedPosts)
      setTags(fetchedTags)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load journal data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { posts, tags, loading, error, loadData }
}
