export interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
  requestId?: string
}

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new ApiError(400, 'BAD_REQUEST', message, details)

export const unauthorized = (message = 'Authentication required') =>
  new ApiError(401, 'UNAUTHORIZED', message)

export const forbidden = (message = 'Forbidden', details?: unknown) =>
  new ApiError(403, 'FORBIDDEN', message, details)

export const notFound = (message = 'Resource not found') =>
  new ApiError(404, 'NOT_FOUND', message)

export const rateLimited = (message = 'Too many requests', details?: unknown) =>
  new ApiError(429, 'RATE_LIMITED', message, details)

export const internalError = (message = 'Internal server error', details?: unknown) =>
  new ApiError(500, 'INTERNAL_ERROR', message, details)
