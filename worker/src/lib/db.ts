import type { Comment, Post } from '../../../src/types/blog'
import type { AuthUser } from '../types'
import type { CreateCommentInput, CreatePostInput, UpdatePostInput } from './schemas'
import { badRequest, notFound } from './errors'

interface PostRow {
  id: number
  title: string
  content: string
  slug: string
  status: 'draft' | 'published'
  published_at: string | null
  author: string
  created_at: string
  updated_at: string
}

interface CommentRow {
  id: string
  post_id: number
  parent_id: string | null
  author: string
  content: string
  created_at: string
  deleted_at: string | null
}

const toIso = (value: string | null): string | null => {
  if (!value) return null
  return value.includes('T') ? value : `${value.replace(' ', 'T')}Z`
}

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'post'

const normalizeTags = (tags: string[] | undefined): string[] =>
  Array.from(
    new Set(
      (tags ?? [])
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  )

const ensureUniqueSlug = async (
  db: D1Database,
  desiredSlug: string,
  excludePostId?: number,
): Promise<string> => {
  let counter = 0

  while (counter < 200) {
    const candidate = counter === 0 ? desiredSlug : `${desiredSlug}-${counter + 1}`
    const row = excludePostId
      ? await db
          .prepare('SELECT id FROM posts WHERE slug = ? AND id != ?')
          .bind(candidate, excludePostId)
          .first<{ id: number }>()
      : await db.prepare('SELECT id FROM posts WHERE slug = ?').bind(candidate).first<{ id: number }>()

    if (!row) return candidate
    counter += 1
  }

  throw badRequest('Could not generate a unique slug')
}

const replacePostTags = async (db: D1Database, postId: number, tags: string[]): Promise<void> => {
  await db.prepare('DELETE FROM post_tags WHERE post_id = ?').bind(postId).run()

  for (const tag of tags) {
    await db.prepare('INSERT INTO tags(name) VALUES (?) ON CONFLICT(name) DO NOTHING').bind(tag).run()
    await db
      .prepare(
        'INSERT INTO post_tags(post_id, tag_id) SELECT ?, id FROM tags WHERE name = ? ON CONFLICT(post_id, tag_id) DO NOTHING',
      )
      .bind(postId, tag)
      .run()
  }
}

const fetchTagsByPostId = async (db: D1Database, postId: number): Promise<string[]> => {
  const result = await db
    .prepare(
      `SELECT t.name
       FROM post_tags pt
       JOIN tags t ON t.id = pt.tag_id
       WHERE pt.post_id = ?
       ORDER BY t.name ASC`,
    )
    .bind(postId)
    .all<{ name: string }>()

  return (result.results ?? []).map((row) => row.name)
}

const buildCommentTree = (rows: CommentRow[]): Comment[] => {
  const byId = new Map<string, Comment>()
  const roots: Comment[] = []

  for (const row of rows) {
    byId.set(row.id, {
      id: row.id,
      postId: String(row.post_id),
      parentId: row.parent_id,
      author: row.deleted_at ? 'Deleted user' : row.author,
      content: row.deleted_at ? '[deleted]' : row.content,
      createdAt: toIso(row.created_at) ?? new Date().toISOString(),
      replies: [],
    })
  }

  for (const row of rows) {
    const node = byId.get(row.id)
    if (!node) continue

    if (row.parent_id) {
      const parent = byId.get(row.parent_id)
      if (!parent) {
        roots.push(node)
        continue
      }
      parent.replies = parent.replies ?? []
      parent.replies.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

const fetchCommentsByPostId = async (db: D1Database, postId: number): Promise<Comment[]> => {
  const rows = await db
    .prepare(
      `SELECT id, post_id, parent_id, author, content, created_at, deleted_at
       FROM comments
       WHERE post_id = ?
       ORDER BY datetime(created_at) ASC`,
    )
    .bind(postId)
    .all<CommentRow>()

  return buildCommentTree(rows.results ?? [])
}

const toPost = async (db: D1Database, row: PostRow): Promise<Post> => {
  const [tags, comments] = await Promise.all([
    fetchTagsByPostId(db, row.id),
    fetchCommentsByPostId(db, row.id),
  ])

  return {
    id: String(row.id),
    title: row.title,
    content: row.content,
    slug: row.slug,
    status: row.status,
    publishedAt: toIso(row.published_at),
    tags,
    author: row.author,
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    updatedAt: toIso(row.updated_at) ?? new Date().toISOString(),
    comments,
  }
}

export const listPosts = async (db: D1Database): Promise<Post[]> => {
  const rows = await db
    .prepare(
      `SELECT id, title, content, slug, status, published_at, author, created_at, updated_at
       FROM posts
       ORDER BY datetime(created_at) DESC`,
    )
    .all<PostRow>()

  return Promise.all((rows.results ?? []).map((row) => toPost(db, row)))
}

export const getPostById = async (db: D1Database, postId: number): Promise<Post | null> => {
  const row = await db
    .prepare(
      `SELECT id, title, content, slug, status, published_at, author, created_at, updated_at
       FROM posts
       WHERE id = ?`,
    )
    .bind(postId)
    .first<PostRow>()

  if (!row) return null
  return toPost(db, row)
}

export const createPost = async (
  db: D1Database,
  payload: CreatePostInput,
  user: AuthUser,
): Promise<Post> => {
  const tags = normalizeTags(payload.tags)
  const status = payload.status ?? 'published'
  const publishedAt = status === 'published' ? payload.publishedAt ?? new Date().toISOString() : null
  const now = new Date().toISOString()
  const uniqueSlug = await ensureUniqueSlug(db, slugify(payload.title))

  const inserted = await db
    .prepare(
      `INSERT INTO posts(title, content, slug, status, published_at, author, created_at, updated_at)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(payload.title, payload.content, uniqueSlug, status, publishedAt, user.name ?? user.id, now, now)
    .run()

  const postId = Number(inserted.meta.last_row_id)
  await replacePostTags(db, postId, tags)

  const post = await getPostById(db, postId)
  if (!post) throw notFound('Post not found after insert')
  return post
}

export const updatePost = async (
  db: D1Database,
  postId: number,
  payload: UpdatePostInput,
): Promise<Post | null> => {
  const current = await db
    .prepare(
      `SELECT id, title, content, slug, status, published_at, author, created_at, updated_at
       FROM posts
       WHERE id = ?`,
    )
    .bind(postId)
    .first<PostRow>()

  if (!current) return null

  const nextTitle = payload.title ?? current.title
  const nextContent = payload.content ?? current.content
  const nextStatus = payload.status ?? current.status
  const nextPublishedAt =
    nextStatus === 'published'
      ? payload.publishedAt === undefined
        ? current.published_at ?? new Date().toISOString()
        : payload.publishedAt
      : null

  const nextSlug =
    payload.title !== undefined
      ? await ensureUniqueSlug(db, slugify(nextTitle), postId)
      : current.slug

  await db
    .prepare(
      `UPDATE posts
       SET title = ?, content = ?, slug = ?, status = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(nextTitle, nextContent, nextSlug, nextStatus, nextPublishedAt, new Date().toISOString(), postId)
    .run()

  if (payload.tags) {
    await replacePostTags(db, postId, normalizeTags(payload.tags))
  }

  return getPostById(db, postId)
}

export const deletePost = async (db: D1Database, postId: number): Promise<boolean> => {
  const post = await db.prepare('SELECT id FROM posts WHERE id = ?').bind(postId).first<{ id: number }>()
  if (!post) return false

  await db.prepare('DELETE FROM comments WHERE post_id = ?').bind(postId).run()
  await db.prepare('DELETE FROM post_tags WHERE post_id = ?').bind(postId).run()
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run()

  return true
}

export const listTags = async (db: D1Database): Promise<string[]> => {
  const result = await db.prepare('SELECT name FROM tags ORDER BY name ASC').all<{ name: string }>()
  return (result.results ?? []).map((row) => row.name)
}

export const createComment = async (
  db: D1Database,
  payload: CreateCommentInput,
  user: AuthUser,
): Promise<Comment> => {
  const postId = Number(payload.postId)

  const post = await db.prepare('SELECT id FROM posts WHERE id = ?').bind(postId).first<{ id: number }>()
  if (!post) throw notFound('Post not found')

  if (payload.parentId) {
    const parent = await db
      .prepare('SELECT id FROM comments WHERE id = ? AND post_id = ?')
      .bind(payload.parentId, postId)
      .first<{ id: string }>()

    if (!parent) {
      throw badRequest('parentId does not exist in this post')
    }
  }

  const id = `c${Date.now()}${Math.floor(Math.random() * 1000)}`
  const createdAt = new Date().toISOString()
  await db
    .prepare(
      `INSERT INTO comments(id, post_id, parent_id, author, content, created_at, deleted_at)
       VALUES(?, ?, ?, ?, ?, ?, NULL)`,
    )
    .bind(id, postId, payload.parentId, user.name ?? user.id, payload.content, createdAt)
    .run()

  return {
    id,
    postId: payload.postId,
    parentId: payload.parentId,
    author: user.name ?? user.id,
    content: payload.content,
    createdAt,
    replies: [],
  }
}

export const softDeleteComment = async (
  db: D1Database,
  postId: number,
  commentId: string,
): Promise<boolean> => {
  const existing = await db
    .prepare('SELECT id FROM comments WHERE id = ? AND post_id = ?')
    .bind(commentId, postId)
    .first<{ id: string }>()

  if (!existing) return false

  await db
    .prepare(
      `WITH RECURSIVE descendants(id) AS (
         SELECT id FROM comments WHERE id = ? AND post_id = ?
         UNION ALL
         SELECT c.id
         FROM comments c
         JOIN descendants d ON c.parent_id = d.id
         WHERE c.post_id = ?
       )
       UPDATE comments
       SET deleted_at = ?, content = '[deleted]', author = 'Deleted user'
       WHERE id IN (SELECT id FROM descendants)
         AND deleted_at IS NULL`,
    )
    .bind(commentId, postId, postId, new Date().toISOString())
    .run()

  return true
}
