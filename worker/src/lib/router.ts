import { ApiError, methodNotAllowed } from './errors'
import { errorResponse, logRequest } from './http'
import type { RequestContext } from '../types'

type RegisteredRoute = { method: string; path: string }
type RouteRegistry = RegisteredRoute[]

export const createRouteRegistry = (): RouteRegistry => []

export const createRouteRecorder = (registry: RouteRegistry, prefix = '') =>
  (method: string, path: string): void => {
    const route = {
      method: method.toUpperCase(),
      path: `${prefix.replace(/\/$/, '')}/${path.replace(/^\//, '')}`,
    }
    if (!registry.some((entry) => entry.method === route.method && entry.path === route.path)) {
      registry.push(route)
    }
  }

const matchesPath = (pattern: string, path: string): boolean => {
  const segments = pattern.split('/')
  const requested = path.split('/')
  return segments.length === requested.length && segments.every((segment, index) =>
    segment.startsWith(':') ? requested[index].length > 0 : segment === requested[index],
  )
}

export const handleNotFound = (
  registry: RouteRegistry,
  ctx: RequestContext,
  method: string,
  path: string,
  userId: string | null,
): Response => {
  const allowed = new Set(registry.filter((route) => matchesPath(route.path, path)).map((route) => route.method))
  if (allowed.has('GET')) allowed.add('HEAD')

  const wrongMethod = allowed.size > 0 && !allowed.has(method.toUpperCase())
  const methods = [...allowed].sort()
  const error = wrongMethod
    ? methodNotAllowed(methods)
    : new ApiError(404, 'NOT_FOUND', 'Route not found', { routes: registry })
  const response = errorResponse(ctx, error)
  if (wrongMethod) response.headers.set('Allow', methods.join(', '))
  logRequest(ctx, response.status, userId, error.code)
  return response
}
