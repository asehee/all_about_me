import { Hono } from 'hono'
import { authenticateWriteRequest } from '../lib/auth'
import { createPost, deletePost, getPostById, listPosts, listTags, updatePost } from '../lib/db'
import { ApiError, badRequest, notFound } from '../lib/errors'
import { json } from '../lib/http'
import {
  createPostSchema,
  postResponseSchema,
  postsResponseSchema,
  tagsResponseSchema,
  updatePostSchema,
} from '../lib/schemas'
import { enforceWriteRateLimit } from '../lib/security'
import type { HonoAppBindings } from '../types'

const getNumericId = (id: string): number => {
  const parsed = Number(id)
  if (!Number.isInteger(parsed)) throw badRequest('Invalid post id')
  return parsed
}

const parsePostType = (value: string | undefined): 'blog' | 'article' | undefined => {
  if (!value) return undefined
  if (value === 'blog' || value === 'article') return value
  throw badRequest('Invalid post type')
}

const parseJson = async (req: Request): Promise<unknown> => {
  try {
    return await req.json()
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Invalid JSON body')
  }
}

export const registerPostsRoutes = (
  app: Hono<HonoAppBindings>,
  recordRoute?: (method: string, path: string) => void,
): void => {
  recordRoute?.('GET', '/posts')
  app.get('/posts', async (c) => {
    const ctx = c.get('requestContext')
    const type = parsePostType(c.req.query('type'))
    const posts = await listPosts(ctx.env.DB, type)
    const body = postsResponseSchema.parse({ posts })
    return json(ctx, body)
  })

  recordRoute?.('GET', '/posts/:id')
  app.get('/posts/:id', async (c) => {
    const ctx = c.get('requestContext')
    const id = c.req.param('id')
    const post = await getPostById(ctx.env.DB, getNumericId(id))
    if (!post) throw notFound('Post not found')

    const body = postResponseSchema.parse({ post })
    return json(ctx, body)
  })

  recordRoute?.('POST', '/posts')
  app.post('/posts', async (c) => {
    const ctx = c.get('requestContext')
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(ctx.env, user, 'posts:write')

    const rawBody = await parseJson(c.req.raw)
    const parsed = createPostSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid create post payload', parsed.error.flatten())
    }

    const post = await createPost(ctx.env.DB, parsed.data, user)
    const body = postResponseSchema.parse({ post })
    return json(ctx, body, 201)
  })

  recordRoute?.('PUT', '/posts/:id')
  app.put('/posts/:id', async (c) => {
    const ctx = c.get('requestContext')
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(ctx.env, user, 'posts:write')

    const id = c.req.param('id')
    const rawBody = await parseJson(c.req.raw)
    const parsed = updatePostSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid update post payload', parsed.error.flatten())
    }

    const post = await updatePost(ctx.env.DB, getNumericId(id), parsed.data)
    if (!post) throw notFound('Post not found')

    const body = postResponseSchema.parse({ post })
    return json(ctx, body)
  })

  recordRoute?.('DELETE', '/posts/:id')
  app.delete('/posts/:id', async (c) => {
    const ctx = c.get('requestContext')
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(ctx.env, user, 'posts:write')

    const id = c.req.param('id')
    const deleted = await deletePost(ctx.env.DB, getNumericId(id))
    if (!deleted) throw notFound('Post not found')

    return json(ctx, { success: true })
  })

  recordRoute?.('GET', '/tags')
  app.get('/tags', async (c) => {
    const ctx = c.get('requestContext')
    const type = parsePostType(c.req.query('type'))
    const tags = await listTags(ctx.env.DB, type)
    const body = tagsResponseSchema.parse({ tags })
    return json(ctx, body)
  })
}
