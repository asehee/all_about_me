import { z } from 'zod'

const postStatusSchema = z.enum(['draft', 'published'])

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(180),
  content: z.string().trim().min(1).max(20000),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional().default([]),
  status: postStatusSchema.optional().default('published'),
  publishedAt: z.string().datetime().nullable().optional(),
})

export const updatePostSchema = z
  .object({
    title: z.string().trim().min(1).max(180).optional(),
    content: z.string().trim().min(1).max(20000).optional(),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
    status: postStatusSchema.optional(),
    publishedAt: z.string().datetime().nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  })

export const createCommentSchema = z.object({
  postId: z.string().regex(/^\d+$/),
  parentId: z.string().min(1).nullable(),
  content: z.string().trim().min(1).max(2000),
})

const commentSchema: z.ZodType<{
  id: string
  postId: string
  parentId: string | null
  author: string
  content: string
  createdAt: string
  replies?: unknown[]
}> = z.lazy(() =>
  z.object({
    id: z.string(),
    postId: z.string(),
    parentId: z.string().nullable(),
    author: z.string(),
    content: z.string(),
    createdAt: z.string().datetime(),
    replies: z.array(commentSchema).optional(),
  }),
)

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  status: postStatusSchema,
  publishedAt: z.string().datetime().nullable(),
  tags: z.array(z.string()),
  author: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  comments: z.array(commentSchema),
})

export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
})

export const postResponseSchema = z.object({
  post: postSchema,
})

export const tagsResponseSchema = z.object({
  tags: z.array(z.string()),
})

export const commentResponseSchema = z.object({
  comment: commentSchema,
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>

// minimal typing for GitHub context bundle used by analysis lab
export type RepoBundle = {
  repo_url: string
  repo_meta: Record<string, unknown>
  readme_md: string
  tree: Array<{ path: string; type: 'file' | 'dir' }>
  key_files: Array<{ path: string; content: string }>
  core_files: Array<{ path: string; content: string }>
  commit_activity: string
}
