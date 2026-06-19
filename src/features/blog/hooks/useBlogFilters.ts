import { useState, useMemo } from 'react'
import type { Post } from '@/types/blog'

export function useBlogFilters(posts: Post[]) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery = q
        ? post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.author.toLowerCase().includes(q)
        : true
      return matchesTag && matchesQuery
    })
  }, [posts, selectedTag, searchQuery])

  return { selectedTag, setSelectedTag, searchQuery, setSearchQuery, filteredPosts }
}
