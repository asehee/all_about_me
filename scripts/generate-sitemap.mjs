import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE_URL =
  process.env.VITE_API_BASE_URL || 'https://all-about-me-api.asehee127.workers.dev'
const SITE_URL = 'https://hee.dance'

async function fetchPostList(type) {
  const response = await fetch(`${API_BASE_URL}/api/posts?type=${type}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} posts: ${response.status}`)
  }
  const data = await response.json()
  if (!data || !Array.isArray(data.posts)) {
    throw new Error(`Invalid ${type} posts response shape`)
  }
  return data.posts
}

async function fetchPosts() {
  try {
    const [blogPosts, articlePosts] = await Promise.all([
      fetchPostList('blog'),
      fetchPostList('article'),
    ])
    return { blogPosts, articlePosts }
  } catch (error) {
    console.error('Failed to fetch posts:', error.message)
    console.error(`API_BASE_URL used for sitemap: ${API_BASE_URL}`)
    return { blogPosts: [], articlePosts: [] }
  }
}

function generateSitemap(blogPosts, articlePosts) {
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
    { loc: '/articles', priority: '0.9', changefreq: 'weekly' },
    { loc: '/profile', priority: '0.7', changefreq: 'monthly' },
    { loc: '/etc', priority: '0.6', changefreq: 'monthly' },
    { loc: '/etc/github', priority: '0.5', changefreq: 'monthly' },
  ]

  const today = new Date().toISOString().split('T')[0]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  // Add static pages
  staticPages.forEach(({ loc, priority, changefreq }) => {
    xml += '  <url>\n'
    xml += `    <loc>${SITE_URL}${loc}</loc>\n`
    xml += `    <lastmod>${today}</lastmod>\n`
    xml += `    <changefreq>${changefreq}</changefreq>\n`
    xml += `    <priority>${priority}</priority>\n`
    xml += '  </url>\n'
  })

  // Add blog posts
  blogPosts.forEach((post) => {
    if (post.status === 'published' && post.slug) {
      const lastmod = post.updatedAt ? post.updatedAt.split('T')[0] : today
      xml += '  <url>\n'
      xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`
      xml += `    <lastmod>${lastmod}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += '  </url>\n'
    }
  })

  // Add article posts
  articlePosts.forEach((post) => {
    if (post.status === 'published' && post.slug) {
      const lastmod = post.updatedAt ? post.updatedAt.split('T')[0] : today
      xml += '  <url>\n'
      xml += `    <loc>${SITE_URL}/articles/${post.slug}</loc>\n`
      xml += `    <lastmod>${lastmod}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += '  </url>\n'
    }
  })

  xml += '</urlset>\n'
  return xml
}

async function main() {
  console.log('Generating sitemap...')

  const { blogPosts, articlePosts } = await fetchPosts()
  console.log(`Found ${blogPosts.length} blog posts and ${articlePosts.length} articles`)

  const sitemap = generateSitemap(blogPosts, articlePosts)

  const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8')

  console.log(`✅ Sitemap generated at ${sitemapPath}`)
  console.log(`Total URLs: ${blogPosts.length + articlePosts.length + 7}`)
}

main().catch((error) => {
  console.error('Error generating sitemap:', error)
  process.exit(1)
})
