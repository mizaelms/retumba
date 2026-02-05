import { db } from "@/db"
import { posts } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://retumba-music-blog.vercel.app'

  let allPosts: any[] = []
  try {
      allPosts = await db.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.status, "published"),
        orderBy: [desc(posts.published_at)],
        limit: 20
      })
  } catch(e) {
      console.error(e)
  }

  const itemsXml = allPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid>${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
    </item>
  `).join('')

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Retumba Music Blog</title>
        <link>${baseUrl}</link>
        <description>Dark Rock | Goth | Industrial</description>
        <language>en</language>
        ${itemsXml}
      </channel>
    </rss>`

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
