import * as z from "zod"

export const postSchema = z.object({
  title: z.string().min(3).max(128),
  slug: z.string().min(3).max(128).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "review", "published"]),
  category_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
})
