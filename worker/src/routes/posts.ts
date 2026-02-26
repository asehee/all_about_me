import { authenticateWriteRequest } from '../lib/auth'
import { createPost, deletePost, getPostById, listPosts, listTags, updatePost } from '../lib/db'
import { notFound, badRequest, ApiError } from '../lib/errors'
import { json } from '../lib/http'
import {
  createPostSchema,
  postResponseSchema,
  postsResponseSchema,
  tagsResponseSchema,
  updatePostSchema,
} from '../lib/schemas'
import { enforceWriteRateLimit } from '../lib/security'
import type { RequestContext } from '../types'

const getNumericId = (id: string): number => {
  const parsed = Number(id)
  if (!Number.isInteger(parsed)) throw badRequest('Invalid post id')
  return parsed
}

export const handlePostsRoutes = async (ctx: RequestContext): Promise<Response | null> => {
  const { request, url, env } = ctx
  const { pathname } = url

  if (request.method === 'GET' && pathname === '/api/posts') {
    const posts = await listPosts(env.DB)
    const body = postsResponseSchema.parse({ posts })
    return json(ctx, body)
  }

  if (request.method === 'GET' && /^\/api\/posts\/\d+$/.test(pathname)) {
    const id = pathname.split('/').at(-1)
    if (!id) throw notFound()

    const post = await getPostById(env.DB, getNumericId(id))
    if (!post) throw notFound('Post not found')

    const body = postResponseSchema.parse({ post })
    return json(ctx, body)
  }

  if (request.method === 'POST' && pathname === '/api/posts') {
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(env, user, 'posts:write')

    const rawBody = await request.json()
    const parsed = createPostSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid create post payload', parsed.error.flatten())
    }

    const post = await createPost(env.DB, parsed.data, user)
    const body = postResponseSchema.parse({ post })
    return json(ctx, body, 201)
  }

  if (request.method === 'PUT' && /^\/api\/posts\/\d+$/.test(pathname)) {
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(env, user, 'posts:write')

    const id = pathname.split('/').at(-1)
    if (!id) throw notFound()

    const rawBody = await request.json()
    const parsed = updatePostSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid update post payload', parsed.error.flatten())
    }

    const post = await updatePost(env.DB, getNumericId(id), parsed.data)
    if (!post) throw notFound('Post not found')

    const body = postResponseSchema.parse({ post })
    return json(ctx, body)
  }

  if (request.method === 'DELETE' && /^\/api\/posts\/\d+$/.test(pathname)) {
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(env, user, 'posts:write')

    const id = pathname.split('/').at(-1)
    if (!id) throw notFound()

    const deleted = await deletePost(env.DB, getNumericId(id))
    if (!deleted) throw notFound('Post not found')

    return json(ctx, { success: true })
  }

  if (request.method === 'GET' && pathname === '/api/tags') {
    const tags = await listTags(env.DB)
    const body = tagsResponseSchema.parse({ tags })
    return json(ctx, body)
  }

  return null
}
