import * as z from "zod"

export const categorySchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const tagSchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
})

export type TagFormValues = z.infer<typeof tagSchema>
