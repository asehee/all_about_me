export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface CreateBlogPost {
  title: string
  content: string
  excerpt: string
  author: string
  tags: string[]
}

export interface UpdateBlogPost {
  title?: string
  content?: string
  excerpt?: string
  tags?: string[]
}