"use server"

import { db } from "@/db"
import { categories, usersProfile } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { categorySchema } from "@/lib/validations/taxonomy"
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

export async function createCategory(data: z.infer<typeof categorySchema>) {
    await checkAuth()

    const validated = categorySchema.safeParse(data)
    if (!validated.success) {
        throw new Error("Invalid data")
    }

    try {
        await db.insert(categories).values({
            name: validated.data.name,
            slug: validated.data.slug,
        })
    } catch (error: any) {
        // Handle unique constraint violation or other DB errors
        if (error.code === '23505') { // Postgres unique_violation
            throw new Error("Category with this name or slug already exists")
        }
        throw error
    }

    revalidatePath("/admin/categories")
    revalidatePath("/admin/posts/create")
    return { success: true }
}

export async function updateCategory(id: number, data: z.infer<typeof categorySchema>) {
    await checkAuth()

    const validated = categorySchema.safeParse(data)
    if (!validated.success) {
        throw new Error("Invalid data")
    }

    try {
        await db.update(categories).set({
            name: validated.data.name,
            slug: validated.data.slug,
        }).where(eq(categories.id, id))
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error("Category with this name or slug already exists")
        }
        throw error
    }

    revalidatePath("/admin/categories")
    revalidatePath("/admin/posts/create")
    return { success: true }
}

export async function deleteCategory(id: number) {
    await checkAuth()

    await db.delete(categories).where(eq(categories.id, id))

    revalidatePath("/admin/categories")
    revalidatePath("/admin/posts/create")
    return { success: true }
}
