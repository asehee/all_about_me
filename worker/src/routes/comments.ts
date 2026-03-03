import { Hono } from 'hono'
import { authenticateWriteRequest } from '../lib/auth'
import { createComment, softDeleteComment } from '../lib/db'
import { ApiError, badRequest, notFound } from '../lib/errors'
import { json } from '../lib/http'
import { commentResponseSchema, createCommentSchema } from '../lib/schemas'
import { enforceWriteRateLimit } from '../lib/security'
import type { HonoAppBindings } from '../types'

const getNumericId = (id: string): number => {
  const parsed = Number(id)
  if (!Number.isInteger(parsed)) throw badRequest('Invalid post id')
  return parsed
}

const parseJson = async (req: Request): Promise<unknown> => {
  try {
    return await req.json()
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Invalid JSON body')
  }
}

export const registerCommentsRoutes = (
  app: Hono<HonoAppBindings>,
  recordRoute?: (method: string, path: string) => void,
): void => {
  recordRoute?.('POST', '/comments')
  app.post('/comments', async (c) => {
    const ctx = c.get('requestContext')
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(ctx.env, user, 'comments:write')

    const rawBody = await parseJson(c.req.raw)
    const parsed = createCommentSchema.safeParse(rawBody)
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid create comment payload', parsed.error.flatten())
    }

    const comment = await createComment(ctx.env.DB, parsed.data, user)
    const body = commentResponseSchema.parse({ comment })
    return json(ctx, body, 201)
  })

  recordRoute?.('DELETE', '/posts/:postId/comments/:commentId')
  app.delete('/posts/:postId/comments/:commentId', async (c) => {
    const ctx = c.get('requestContext')
    const user = await authenticateWriteRequest(ctx)
    await enforceWriteRateLimit(ctx.env, user, 'comments:write')

    const postId = c.req.param('postId')
    const commentId = c.req.param('commentId')

    const deleted = await softDeleteComment(ctx.env.DB, getNumericId(postId), commentId)
    if (!deleted) throw notFound('Comment not found')

    return json(ctx, { success: true })
  })
}
