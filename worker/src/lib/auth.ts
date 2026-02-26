import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { AuthUser, Env, RequestContext } from '../types'
import { unauthorized } from './errors'

const extractBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

const normalizeEmailUser = (email: string, id?: string | null): AuthUser => ({
  id: id ?? email,
  email,
  name: email,
})

const verifyCloudflareAccessJwt = async (token: string, env: Env): Promise<AuthUser> => {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    throw unauthorized('Cloudflare Access JWT settings are missing')
  }

  const teamDomain = env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, '')
  const jwks = createRemoteJWKSet(new URL(`https://${teamDomain}/cdn-cgi/access/certs`))

  const { payload } = await jwtVerify(token, jwks, {
    issuer: `https://${teamDomain}`,
    audience: env.CF_ACCESS_AUD,
  })

  const email = typeof payload.email === 'string' ? payload.email : undefined
  const sub = typeof payload.sub === 'string' ? payload.sub : undefined

  if (!sub && !email) throw unauthorized('Cloudflare Access token missing subject')
  return {
    id: sub ?? email ?? 'unknown',
    email,
    name: email ?? sub,
  }
}

const verifyClerkJwt = async (token: string, env: Env): Promise<AuthUser> => {
  if (!env.CLERK_JWKS_URL) {
    throw unauthorized('Clerk JWKS URL is missing')
  }

  const jwks = createRemoteJWKSet(new URL(env.CLERK_JWKS_URL))
  const { payload } = await jwtVerify(token, jwks, {
    issuer: env.CLERK_ISSUER,
    audience: env.CLERK_AUDIENCE,
  })

  const sub = typeof payload.sub === 'string' ? payload.sub : undefined
  const email = typeof payload.email === 'string' ? payload.email : undefined

  if (!sub) throw unauthorized('Clerk token missing subject')
  return {
    id: sub,
    email,
    name: email ?? sub,
  }
}

export const authenticateWriteRequest = async (ctx: RequestContext): Promise<AuthUser> => {
  const { request, env } = ctx

  const accessEmail = request.headers.get('CF-Access-Authenticated-User-Email')
  if (accessEmail) {
    const accessUserId = request.headers.get('CF-Access-Authenticated-User-Id')
    return normalizeEmailUser(accessEmail, accessUserId)
  }

  const accessJwt = request.headers.get('CF-Access-Jwt-Assertion')
  if (accessJwt && env.CF_ACCESS_TEAM_DOMAIN && env.CF_ACCESS_AUD) {
    return verifyCloudflareAccessJwt(accessJwt, env)
  }

  const bearerToken = extractBearerToken(request)

  if (env.AUTH_BEARER_TOKEN) {
    if (!bearerToken || bearerToken !== env.AUTH_BEARER_TOKEN) {
      throw unauthorized('Invalid bearer token')
    }

    return {
      id: 'asehee',
      name: 'asehee',
    }
  }

  if (bearerToken && env.CLERK_JWKS_URL) {
    return verifyClerkJwt(bearerToken, env)
  }

  throw unauthorized('No supported authentication credentials found')
}
