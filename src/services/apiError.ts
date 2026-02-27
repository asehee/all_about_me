export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

interface ApiErrorResponse {
  code: string
  message: string
  details?: unknown
  requestId?: string
}

export async function toApiError(response: Response): Promise<ApiError> {
  let message = `Request failed: ${response.status}`
  let code: string | undefined
  let details: unknown

  try {
    const errorBody = (await response.json()) as ApiErrorResponse
    if (errorBody.message) message = errorBody.message
    code = errorBody.code
    details = errorBody.details
  } catch {
    // Keep default message when body is not JSON.
  }

  return new ApiError(message, response.status, code, details)
}
