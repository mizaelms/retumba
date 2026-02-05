"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { postSchema } from "@/lib/validations/post"
import { createPost, updatePost } from "@/app/actions/posts"
import { uploadImage } from "@/app/actions/upload"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface PostFormProps {
    post?: any; // strict type ideally
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
}

export function PostForm({ post, categories, tags }: PostFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            excerpt: post?.excerpt || "",
            content: post?.content || "",
            cover_image_url: post?.cover_image_url || "",
            status: post?.status || "draft",
            category_ids: post?.postCategories?.map((pc: any) => pc.category_id) || [],
            tag_ids: post?.postTags?.map((pt: any) => pt.tag_id) || [],
        },
    })

    async function onSubmit(values: z.infer<typeof postSchema>) {
        setLoading(true)
        try {
            if (post) {
                await updatePost(post.id, values)
            } else {
                await createPost(values)
            }
            router.push("/admin/posts")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Something went wrong: " + error)
        } finally {
            setLoading(false)
        }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const { publicUrl } = await uploadImage(formData)
            form.setValue("cover_image_url", publicUrl)
        } catch (error: any) {
            console.error(error)
            alert("Upload failed: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} onChange={e => {
                                    field.onChange(e)
                                    if (!post && !form.getValues('slug')) {
                                         form.setValue('slug', e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                                    }
                                }}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input placeholder="slug" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short summary" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content (MDX)</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-[300px] font-mono" placeholder="# Hello World" {...field} />
                            </FormControl>
                            <FormDescription>
                                Supports Markdown and Embeds.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                 <FormField
                    control={form.control}
                    name="cover_image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                                <div className="flex gap-4 items-center">
                                    <Input placeholder="https://..." {...field} />
                                    <Input type="file" className="w-[200px]" onChange={handleFileChange} disabled={uploading} />
                                </div>
                            </FormControl>
                            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                         <FormLabel>Categories</FormLabel>
                         <div className="border p-4 rounded-md h-[150px] overflow-y-auto space-y-2">
                             {categories.map(cat => (
                                 <div key={cat.id} className="flex items-center space-x-2">
                                     <input
                                        type="checkbox"
                                        value={cat.id}
                                        checked={form.watch('category_ids')?.includes(cat.id)}
                                        onChange={e => {
                                            const current = form.getValues('category_ids') || []
                                            if (e.target.checked) {
                                                form.setValue('category_ids', [...current, cat.id])
                                            } else {
                                                form.setValue('category_ids', current.filter(id => id !== cat.id))
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-input bg-background"
                                     />
                                     <span className="text-sm">{cat.name}</span>
                                 </div>
                             ))}
                         </div>
                    </FormItem>
                    <FormItem>
                         <FormLabel>Tags</FormLabel>
                         <div className="border p-4 rounded-md h-[150px] overflow-y-auto space-y-2">
                             {tags.map(tag => (
                                 <div key={tag.id} className="flex items-center space-x-2">
                                     <input
                                        type="checkbox"
                                        value={tag.id}
                                        checked={form.watch('tag_ids')?.includes(tag.id)}
                                        onChange={e => {
                                            const current = form.getValues('tag_ids') || []
                                            if (e.target.checked) {
                                                form.setValue('tag_ids', [...current, tag.id])
                                            } else {
                                                form.setValue('tag_ids', current.filter(id => id !== tag.id))
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-input bg-background"
                                     />
                                     <span className="text-sm">{tag.name}</span>
                                 </div>
                             ))}
                         </div>
                    </FormItem>
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="draft">Draft</option>
                                    <option value="review">Review</option>
                                    <option value="published">Published</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading || uploading}>
                    {loading ? "Saving..." : "Save Post"}
                </Button>
            </form>
        </Form>
    )
}
