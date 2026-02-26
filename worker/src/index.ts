import { ApiError, notFound } from './lib/errors'
import { createContext, errorResponse, logRequest, preflight } from './lib/http'
import { handleCommentsRoutes } from './routes/comments'
import { handlePostsRoutes } from './routes/posts'
import type { Env } from './types'

const extractUserId = (request: Request): string | null =>
  request.headers.get('CF-Access-Authenticated-User-Id') ??
  request.headers.get('CF-Access-Authenticated-User-Email') ??
  null

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ctx = createContext(request, env)
    const userId = extractUserId(request)

    try {
      if (request.method === 'OPTIONS') {
        const response = preflight(ctx)
        logRequest(ctx, response.status, userId)
        return response
      }

      const postResponse = await handlePostsRoutes(ctx)
      if (postResponse) {
        logRequest(ctx, postResponse.status, userId)
        return postResponse
      }

      const commentResponse = await handleCommentsRoutes(ctx)
      if (commentResponse) {
        logRequest(ctx, commentResponse.status, userId)
        return commentResponse
      }

      throw notFound()
    } catch (error) {
      if (!(error instanceof ApiError)) {
        console.error('Unhandled error', {
          requestId: ctx.requestId,
          path: ctx.url.pathname,
          method: request.method,
          error,
        })
      }

      const response = errorResponse(ctx, error)
      const errorCode = error instanceof ApiError ? error.code : 'INTERNAL_ERROR'
      logRequest(ctx, response.status, userId, errorCode)
      return response
    }
  },
}
