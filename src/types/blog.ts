export interface Comment {
  id: string
  postId: string
  parentId: string | null // 대댓글인 경우 부모 댓글 ID
  author: string
  content: string
  createdAt: string
  replies?: Comment[]
}

export interface Post {
  id: string
  title: string
  content: string
  slug: string
  status: 'draft' | 'published'
  type: 'blog' | 'article'
  publishedAt: string | null
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export interface CreatePostDTO {
  title: string
  content: string
  tags?: string[]
  status?: 'draft' | 'published'
  publishedAt?: string | null
  type?: 'blog' | 'article'
}

export interface UpdatePostDTO {
  title?: string
  content?: string
  tags?: string[]
  status?: 'draft' | 'published'
  publishedAt?: string | null
  type?: 'blog' | 'article'
}

export interface CreateCommentDTO {
  postId: string
  parentId: string | null
  author: string
  content: string
}
