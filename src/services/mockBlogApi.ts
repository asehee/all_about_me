import type {
  Post,
  CreatePostDTO,
  UpdatePostDTO,
  Comment,
  CreateCommentDTO,
} from '@/types/blog'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const API_PREFIX = `${API_BASE_URL}/api`
const WRITE_TOKEN_STORAGE_KEY = 'journal_write_token'

class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

interface ApiErrorResponse {
  code: string
  message: string
  details?: unknown
  requestId?: string
}

const withAuthHeader = (init?: RequestInit): RequestInit => {
  if (typeof window === 'undefined') return init ?? {}
  const method = (init?.method ?? 'GET').toUpperCase()
  if (method === 'GET' || method === 'OPTIONS') return init ?? {}
  const writeToken = window.sessionStorage.getItem(WRITE_TOKEN_STORAGE_KEY)
  if (!writeToken) return init ?? {}

  return {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${writeToken}`,
    },
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const securedInit = withAuthHeader(init)
  const response = await fetch(`${API_PREFIX}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(securedInit.headers ?? {}),
    },
    ...securedInit,
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    let code: string | undefined
    let details: unknown
    try {
      const errorBody = (await response.json()) as ApiErrorResponse
      if (errorBody.message) message = errorBody.message
      code = errorBody.code
      details = errorBody.details
    } catch {
      // Use default message if body is not JSON.
    }
    throw new ApiError(message, response.status, code, details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

interface PostsResponse {
  posts: Post[]
}

interface PostResponse {
  post: Post
}

interface TagsResponse {
  tags: string[]
}

interface CommentResponse {
  comment: Comment
}

export const writeTokenManager = {
  set(token: string) {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(WRITE_TOKEN_STORAGE_KEY, token.trim())
  },
  clear() {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(WRITE_TOKEN_STORAGE_KEY)
  },
  exists() {
    if (typeof window === 'undefined') return false
    return Boolean(window.sessionStorage.getItem(WRITE_TOKEN_STORAGE_KEY))
  },
}

export const mockBlogApi = {
  async getPosts(): Promise<Post[]> {
    const data = await request<PostsResponse>('/posts')
    return data.posts
  },

  async getPost(id: string): Promise<Post | null> {
    try {
      const data = await request<PostResponse>(`/posts/${id}`)
      return data.post
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      throw error
    }
  },

  async createPost(dto: CreatePostDTO): Promise<Post> {
    const data = await request<PostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
    return data.post
  },

  async updatePost(id: string, dto: UpdatePostDTO): Promise<Post | null> {
    try {
      const data = await request<PostResponse>(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      })
      return data.post
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null
      throw error
    }
  },

  async deletePost(id: string): Promise<boolean> {
    try {
      await request<{ success: true }>(`/posts/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false
      throw error
    }
  },

  async getTags(): Promise<string[]> {
    const data = await request<TagsResponse>('/tags')
    return data.tags
  },

  async getPostsByTag(tag: string): Promise<Post[]> {
    const allPosts = await this.getPosts()
    return allPosts.filter((post) => post.tags.includes(tag))
  },

  async addComment(dto: CreateCommentDTO): Promise<Comment> {
    const data = await request<CommentResponse>('/comments', {
      method: 'POST',
      body: JSON.stringify(dto),
    })
    return data.comment
  },

  async deleteComment(postId: string, commentId: string): Promise<boolean> {
    try {
      await request<{ success: true }>(`/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      })
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false
      throw error
    }
  },

  findComment(comments: Comment[], id: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === id) return comment
      if (comment.replies) {
        const found = this.findComment(comment.replies, id)
        if (found) return found
      }
    }
    return null
  },
}
