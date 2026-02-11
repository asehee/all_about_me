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
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  comments: Comment[]
}

export interface CreatePostDTO {
  title: string
  content: string
  tags: string[]
  author: string
}

export interface UpdatePostDTO {
  title?: string
  content?: string
  tags?: string[]
}

export interface CreateCommentDTO {
  postId: string
  parentId: string | null
  author: string
  content: string
}
