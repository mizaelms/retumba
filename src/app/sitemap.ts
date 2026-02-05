import { MetadataRoute } from 'next'
import { db } from "@/db"
import { posts } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://retumba-music-blog.vercel.app'

  let allPosts: any[] = []
  try {
      allPosts = await db.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.status, "published"),
        orderBy: [desc(posts.published_at)],
      })
  } catch(e) {
      console.error(e)
  }

  const routes = allPosts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.updated_at || new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...routes,
  ]
}
