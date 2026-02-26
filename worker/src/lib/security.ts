import type { AuthUser, Env } from '../types'
import { rateLimited } from './errors'

const toPositiveInt = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}

export const enforceWriteRateLimit = async (
  env: Env,
  user: AuthUser,
  scope: string,
): Promise<void> => {
  const limit = toPositiveInt(env.RATE_LIMIT_MAX_WRITES, 30)
  const windowSeconds = toPositiveInt(env.RATE_LIMIT_WINDOW_SECONDS, 60)
  const now = Date.now()
  const key = `${user.id}:${scope}`

  const row = await env.DB.prepare(
    'SELECT key, window_start, count FROM rate_limits WHERE key = ?',
  )
    .bind(key)
    .first<{ key: string; window_start: string; count: number }>()

  if (!row) {
    await env.DB.prepare(
      'INSERT INTO rate_limits(key, window_start, count) VALUES(?, ?, ?)',
    )
      .bind(key, new Date(now).toISOString(), 1)
      .run()
    return
  }

  const windowStart = new Date(row.window_start).getTime()
  if (Number.isNaN(windowStart) || now - windowStart >= windowSeconds * 1000) {
    await env.DB.prepare('UPDATE rate_limits SET window_start = ?, count = 1 WHERE key = ?')
      .bind(new Date(now).toISOString(), key)
      .run()
    return
  }

  if (row.count >= limit) {
    throw rateLimited('Write rate limit exceeded', {
      limit,
      windowSeconds,
      scope,
    })
  }

  await env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run()
}
