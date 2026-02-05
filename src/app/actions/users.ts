"use server"

import { db } from "@/db"
import { usersProfile, userRoles } from "@/db/schema"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function updateUserRole(userId: string, role: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Check if requester is ADMIN
    const requester = await db.query.usersProfile.findFirst({
        where: (p, { eq }) => eq(p.id, user.id)
    })

    if (requester?.role !== 'ADMIN') throw new Error("Forbidden")

    // Validate role
    if (!userRoles.includes(role as any)) throw new Error("Invalid role")

    await db.update(usersProfile)
        .set({ role: role as any })
        .where(eq(usersProfile.id, userId))

    revalidatePath("/admin/users")
    return { success: true }
}
