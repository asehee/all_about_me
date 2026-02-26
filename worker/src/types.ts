export interface Env {
  DB: D1Database
  CORS_ORIGINS?: string
  RATE_LIMIT_MAX_WRITES?: string
  RATE_LIMIT_WINDOW_SECONDS?: string
  CF_ACCESS_AUD?: string
  CF_ACCESS_TEAM_DOMAIN?: string
  CLERK_JWKS_URL?: string
  CLERK_ISSUER?: string
  CLERK_AUDIENCE?: string
  AUTH_BEARER_TOKEN?: string
}

export interface AuthUser {
  id: string
  email?: string
  name?: string
}

export interface RequestContext {
  env: Env
  request: Request
  url: URL
  requestId: string
  startTime: number
  allowedOrigin: string | null
}
