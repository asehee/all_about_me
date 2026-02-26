import { ApiError, type ApiErrorBody, internalError } from './errors'
import type { Env, RequestContext } from '../types'

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
} as const

const ALLOWED_METHODS = 'GET,POST,PUT,DELETE,OPTIONS'
const ALLOWED_HEADERS = 'Content-Type, Authorization, CF-Access-Jwt-Assertion'

const parseAllowedOrigins = (env: Env): string[] => {
  const raw = env.CORS_ORIGINS ?? ''
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const resolveAllowedOrigin = (request: Request, env: Env): string | null => {
  const origin = request.headers.get('Origin')
  if (!origin) return null

  const allowedOrigins = parseAllowedOrigins(env)
  if (allowedOrigins.includes('*')) return origin
  if (allowedOrigins.includes(origin)) return origin

  throw new ApiError(403, 'CORS_ORIGIN_DENIED', 'Origin not allowed', { origin })
}

export const createContext = (request: Request, env: Env): RequestContext => {
  const url = new URL(request.url)
  const requestId = request.headers.get('cf-ray') ?? crypto.randomUUID()

  return {
    env,
    request,
    url,
    requestId,
    startTime: Date.now(),
    allowedOrigin: resolveAllowedOrigin(request, env),
  }
}

const buildHeaders = (allowedOrigin: string | null): Headers => {
  const headers = new Headers(BASE_HEADERS)
  if (allowedOrigin) {
    headers.set('Access-Control-Allow-Origin', allowedOrigin)
    headers.set('Vary', 'Origin')
    headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS)
    headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS)
    headers.set('Access-Control-Max-Age', '86400')
  }
  return headers
}

export const json = (ctx: RequestContext, data: unknown, status = 200): Response => {
  const headers = buildHeaders(ctx.allowedOrigin)
  headers.set('X-Request-Id', ctx.requestId)
  return new Response(JSON.stringify(data), { status, headers })
}

export const noContent = (ctx: RequestContext): Response => {
  const headers = buildHeaders(ctx.allowedOrigin)
  headers.set('X-Request-Id', ctx.requestId)
  return new Response(null, { status: 204, headers })
}

export const preflight = (ctx: RequestContext): Response => {
  const headers = buildHeaders(ctx.allowedOrigin)
  return new Response(null, { status: 204, headers })
}

export const errorResponse = (ctx: RequestContext, error: unknown): Response => {
  const apiError = error instanceof ApiError ? error : internalError('Unexpected error')

  const body: ApiErrorBody = {
    code: apiError.code,
    message: apiError.message,
    details: apiError.details,
    requestId: ctx.requestId,
  }

  return json(ctx, body, apiError.status)
}

export const logRequest = (
  ctx: RequestContext,
  status: number,
  userId: string | null,
  errorCode?: string,
): void => {
  console.log(
    JSON.stringify({
      requestId: ctx.requestId,
      method: ctx.request.method,
      path: ctx.url.pathname,
      status,
      durationMs: Date.now() - ctx.startTime,
      userId,
      errorCode: errorCode ?? null,
      cfRay: ctx.request.headers.get('cf-ray') ?? null,
      userAgent: ctx.request.headers.get('user-agent') ?? null,
    }),
  )
}
