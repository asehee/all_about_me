import { Hono } from 'hono'
import { ApiError } from './lib/errors'
import { createContext, errorResponse, logRequest, preflight } from './lib/http'
import { createRouteRecorder, createRouteRegistry, handleNotFound } from './lib/router'
import { registerCommentsRoutes } from './routes/comments'
import { registerPostsRoutes } from './routes/posts'
import type { Env, HonoAppBindings, RequestContext } from './types'

const extractUserId = (request: Request): string | null =>
  request.headers.get('CF-Access-Authenticated-User-Id') ??
  request.headers.get('CF-Access-Authenticated-User-Email') ??
  null

const createFallbackContext = (request: Request, env: Env): RequestContext => {
  const url = new URL(request.url)
  const requestId = request.headers.get('cf-ray') ?? crypto.randomUUID()
  return {
    env,
    request,
    url,
    requestId,
    startTime: Date.now(),
    allowedOrigin: null,
  }
}

const app = new Hono<HonoAppBindings>()

app.use('*', async (c, next) => {
  const request = c.req.raw
  const userId = extractUserId(request)

  let ctx: RequestContext
  try {
    ctx = createContext(request, c.env)
  } catch (error) {
    const fallback = createFallbackContext(request, c.env)
    const response = errorResponse(fallback, error)
    const errorCode = error instanceof ApiError ? error.code : 'INTERNAL_ERROR'
    logRequest(fallback, response.status, userId, errorCode)
    return response
  }

  c.set('requestContext', ctx)
  c.set('userId', userId)

  if (request.method === 'OPTIONS') {
    const response = preflight(ctx)
    logRequest(ctx, response.status, userId)
    return response
  }

  await next()

  if (!c.get('logSkip')) {
    logRequest(ctx, c.res.status, userId)
  }
})

app.onError((error, c) => {
  const ctx = c.get('requestContext') ?? createFallbackContext(c.req.raw, c.env)

  if (!(error instanceof ApiError)) {
    console.error('Unhandled error', {
      requestId: ctx.requestId,
      path: ctx.url.pathname,
      method: c.req.method,
      error,
    })
  }

  const response = errorResponse(ctx, error)
  const errorCode = error instanceof ApiError ? error.code : 'INTERNAL_ERROR'
  logRequest(ctx, response.status, c.get('userId') ?? extractUserId(c.req.raw), errorCode)
  c.set('logSkip', true)
  return response
})

const routeRegistry = createRouteRegistry()
const api = new Hono<HonoAppBindings>()
const recordApiRoute = createRouteRecorder(routeRegistry, '/api')

registerPostsRoutes(api, recordApiRoute)
registerCommentsRoutes(api, recordApiRoute)

app.route('/api', api)

app.notFound((c) => {
  const ctx = c.get('requestContext') ?? createFallbackContext(c.req.raw, c.env)
  const response = handleNotFound(
    routeRegistry,
    ctx,
    c.req.method,
    c.req.path,
    c.get('userId') ?? extractUserId(c.req.raw),
  )
  c.set('logSkip', true)
  return response
})

export default app
