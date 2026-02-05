"use server"

import { db } from "@/db"
import { posts, postCategories, postTags } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { postSchema } from "@/lib/validations/post"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { eq } from "drizzle-orm"

async function checkAuth() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    const userProfile = await db.query.usersProfile.findFirst({
        where: (p, { eq }) => eq(p.id, user.id)
    })

    if (!userProfile || (userProfile.role !== 'ADMIN' && userProfile.role !== 'WRITER')) {
        throw new Error("Forbidden")
    }

    return { user, userProfile }
}

export async function createPost(data: z.infer<typeof postSchema>) {
  const { user } = await checkAuth()

  // Validate data
  const validated = postSchema.safeParse(data)
  if (!validated.success) {
      throw new Error("Invalid data")
  }
  const { data: validData } = validated

  const result = await db.transaction(async (tx) => {
      const [newPost] = await tx.insert(posts).values({
          title: validData.title,
          slug: validData.slug,
          excerpt: validData.excerpt,
          content: validData.content,
          cover_image_url: validData.cover_image_url || null,
          status: validData.status,
          author_id: user.id,
          published_at: validData.status === 'published' ? new Date() : null,
      }).returning();

      if (validData.category_ids && validData.category_ids.length > 0) {
          await tx.insert(postCategories).values(
              validData.category_ids.map(cid => ({ post_id: newPost.id, category_id: cid }))
          )
      }

      if (validData.tag_ids && validData.tag_ids.length > 0) {
          await tx.insert(postTags).values(
              validData.tag_ids.map(tid => ({ post_id: newPost.id, tag_id: tid }))
          )
      }
      return newPost;
  });

  revalidatePath("/")
  revalidatePath("/admin/posts")
  return { success: true, postId: result.id }
}

export async function updatePost(id: number, data: z.infer<typeof postSchema>) {
    const { user, userProfile } = await checkAuth()

    // Check ownership if not admin
    const post = await db.query.posts.findFirst({
        where: (p, { eq }) => eq(p.id, id)
    })

    if (!post) throw new Error("Not found")

    if (userProfile.role !== 'ADMIN' && post.author_id !== user.id) {
        throw new Error("Forbidden")
    }

    const validated = postSchema.safeParse(data)
    if (!validated.success) throw new Error("Invalid data")
    const { data: validData } = validated

    await db.transaction(async (tx) => {
        await tx.update(posts).set({
            title: validData.title,
            slug: validData.slug,
            excerpt: validData.excerpt,
            content: validData.content,
            cover_image_url: validData.cover_image_url || null,
            status: validData.status,
            published_at: (validData.status === 'published' && post.status !== 'published') ? new Date() : post.published_at,
            updated_at: new Date(),
        }).where(eq(posts.id, id))

        // Update relations (delete and re-insert is easiest)
        if (validData.category_ids) {
            await tx.delete(postCategories).where(eq(postCategories.post_id, id))
            if (validData.category_ids.length > 0) {
                 await tx.insert(postCategories).values(
                    validData.category_ids.map(cid => ({ post_id: id, category_id: cid }))
                )
            }
        }
        if (validData.tag_ids) {
            await tx.delete(postTags).where(eq(postTags.post_id, id))
             if (validData.tag_ids.length > 0) {
                 await tx.insert(postTags).values(
                    validData.tag_ids.map(tid => ({ post_id: id, tag_id: tid }))
                )
            }
        }
    })

    revalidatePath("/")
    revalidatePath("/admin/posts")
    revalidatePath(`/posts/${validData.slug}`)
    return { success: true }
}

export async function deletePost(id: number) {
     const { user, userProfile } = await checkAuth()

    // Check ownership if not admin
    const post = await db.query.posts.findFirst({
        where: (p, { eq }) => eq(p.id, id)
    })

    if (!post) throw new Error("Not found")

    if (userProfile.role !== 'ADMIN' && post.author_id !== user.id) {
        throw new Error("Forbidden")
    }

    await db.delete(posts).where(eq(posts.id, id))

    revalidatePath("/")
    revalidatePath("/admin/posts")
    return { success: true }
}
