import { authenticateWriteRequest } from '../lib/auth'
import { createComment, softDeleteComment } from '../lib/db'
import { ApiError, badRequest, notFound } from '../lib/errors'
import { json } from '../lib/http'
import { commentResponseSchema, createCommentSchema } from '../lib/schemas'
import { enforceWriteRateLimit } from '../lib/security'
import type { RequestContext } from '../types'

const getNumericId = (id: string): number => {
  const parsed = Number(id)
  if (!Number.isInteger(parsed)) throw badRequest('Invalid post id')
  return parsed
}

export const handleCommentsRoutes = async (ctx: RequestContext): Promise<Response | null> => {
  const { request, url, env } = ctx
  const { pathname } = url

  if (request.method === 'POST' && pathname === '/api/comments') {
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(env, user, 'comments:write')

    const rawBody = await request.json()
    const parsed = createCommentSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid create comment payload', parsed.error.flatten())
    }

    const comment = await createComment(env.DB, parsed.data, user)
    const body = commentResponseSchema.parse({ comment })
    return json(ctx, body, 201)
  }

  if (
    request.method === 'DELETE' &&
    /^\/api\/posts\/\d+\/comments\/[a-zA-Z0-9_-]+$/.test(pathname)
  ) {
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(env, user, 'comments:write')

    const parts = pathname.split('/')
    const postId = parts[3]
    const commentId = parts[5]
    if (!postId || !commentId) throw notFound()

    const deleted = await softDeleteComment(env.DB, getNumericId(postId), commentId)
    if (!deleted) throw notFound('Comment not found')

    return json(ctx, { success: true })
  }

  return null
}
