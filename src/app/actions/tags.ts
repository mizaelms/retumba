"use server"

import { db } from "@/db"
import { tags } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { tagSchema } from "@/lib/validations/taxonomy"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

async function checkAuth() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    const userProfileData = await db.query.usersProfile.findFirst({
        where: (p, { eq }) => eq(p.id, user.id)
    })

    if (!userProfileData || (userProfileData.role !== 'ADMIN' && userProfileData.role !== 'WRITER')) {
        throw new Error("Forbidden")
    }

    return { user, userProfile: userProfileData }
}

export async function createTag(data: z.infer<typeof tagSchema>) {
    await checkAuth()

    const validated = tagSchema.safeParse(data)
    if (!validated.success) {
        throw new Error("Invalid data")
    }

    try {
        const [newTag] = await db.insert(tags).values({
            name: validated.data.name,
            slug: validated.data.slug,
        }).returning()

        revalidatePath("/admin/tags")
        revalidatePath("/admin/posts/create")
        return { success: true, tag: newTag }
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error("Tag with this name or slug already exists")
        }
        throw error
    }
}

export async function updateTag(id: number, data: z.infer<typeof tagSchema>) {
    await checkAuth()

    const validated = tagSchema.safeParse(data)
    if (!validated.success) {
        throw new Error("Invalid data")
    }

    try {
        await db.update(tags).set({
            name: validated.data.name,
            slug: validated.data.slug,
        }).where(eq(tags.id, id))
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error("Tag with this name or slug already exists")
        }
        throw error
    }

    revalidatePath("/admin/tags")
    revalidatePath("/admin/posts/create")
    return { success: true }
}

export async function deleteTag(id: number) {
    await checkAuth()

    await db.delete(tags).where(eq(tags.id, id))

    revalidatePath("/admin/tags")
    revalidatePath("/admin/posts/create")
    return { success: true }
}
