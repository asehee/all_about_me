import type { Post, CreatePostDTO, UpdatePostDTO, Comment, CreateCommentDTO } from '@/types/blog'

// Mock 데이터 저장소
let posts: Post[] = [
  {
    id: '1',
    title: 'Building a Blog with React and TypeScript',
    content: 'Let us build a blog with React and TypeScript and keep the UX fast and clean.',
    tags: ['React', 'TypeScript', 'Web'],
    author: 'Admin',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    comments: [
      {
        id: 'c1',
        postId: '1',
        parentId: null,
        author: 'User1',
        content: 'Great write-up.',
        createdAt: new Date('2024-01-16').toISOString(),
        replies: [
          {
            id: 'c1-1',
            postId: '1',
            parentId: 'c1',
            author: 'Admin',
            content: 'Thanks for reading.',
            createdAt: new Date('2024-01-17').toISOString(),
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Setting Up a Fast Dev Workflow with Vite',
    content: 'Vite keeps feedback loops short with fast startup and HMR.',
    tags: ['Vite', 'Build Tool', 'Performance'],
    author: 'Admin',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
    comments: [],
  },
  {
    id: '3',
    title: 'Practical Guide to Tailwind CSS',
    content: 'Tailwind helps you ship UI quickly with utility-driven styling.',
    tags: ['CSS', 'Tailwind', 'UI'],
    author: 'Admin',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
    comments: [],
  },
]

let nextId = 4

// 지연 시뮬레이션 (실제 API 호출처럼)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockBlogApi = {
  // 모든 포스트 가져오기
  async getPosts(): Promise<Post[]> {
    await delay(300)
    return [...posts].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  // 특정 포스트 가져오기
  async getPost(id: string): Promise<Post | null> {
    await delay(200)
    return posts.find((p) => p.id === id) || null
  },

  // 포스트 생성
  async createPost(dto: CreatePostDTO): Promise<Post> {
    await delay(300)
    const newPost: Post = {
      id: String(nextId++),
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    }
    posts.push(newPost)
    return newPost
  },

  // 포스트 수정
  async updatePost(id: string, dto: UpdatePostDTO): Promise<Post | null> {
    await delay(300)
    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return null

    posts[index] = {
      ...posts[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    }
    return posts[index]
  },

  // 포스트 삭제
  async deletePost(id: string): Promise<boolean> {
    await delay(300)
    const index = posts.findIndex((p) => p.id === id)
    if (index === -1) return false
    posts.splice(index, 1)
    return true
  },

  // 태그 목록 가져오기
  async getTags(): Promise<string[]> {
    await delay(100)
    const allTags = posts.flatMap((p) => p.tags)
    return Array.from(new Set(allTags))
  },

  // 태그로 필터링
  async getPostsByTag(tag: string): Promise<Post[]> {
    await delay(200)
    return posts.filter((p) => p.tags.includes(tag))
  },

  // 댓글 추가
  async addComment(dto: CreateCommentDTO): Promise<Comment> {
    await delay(200)
    const post = posts.find((p) => p.id === dto.postId)
    if (!post) throw new Error('Post not found')

    const newComment: Comment = {
      id: `c${Date.now()}`,
      ...dto,
      createdAt: new Date().toISOString(),
      replies: [],
    }

    if (dto.parentId) {
      // 대댓글인 경우
      const parentComment = this.findComment(post.comments, dto.parentId)
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = []
        parentComment.replies.push(newComment)
      }
    } else {
      // 일반 댓글
      post.comments.push(newComment)
    }

    return newComment
  },

  // 댓글 찾기 (재귀)
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

  // 댓글 삭제
  async deleteComment(postId: string, commentId: string): Promise<boolean> {
    await delay(200)
    const post = posts.find((p) => p.id === postId)
    if (!post) return false

    const removeComment = (comments: Comment[]): boolean => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === commentId) {
          comments.splice(i, 1)
          return true
        }
        if (comments[i].replies) {
          if (removeComment(comments[i].replies!)) return true
        }
      }
      return false
    }

    return removeComment(post.comments)
  },
}
