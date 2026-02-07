"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { tagSchema } from "@/lib/validations/taxonomy"
import { createTag, updateTag } from "@/app/actions/tags"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface TagFormProps {
    tag?: {
        id: number;
        name: string;
        slug: string;
    }
}

export function TagForm({ tag }: TagFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof tagSchema>>({
        resolver: zodResolver(tagSchema),
        defaultValues: {
            name: tag?.name || "",
            slug: tag?.slug || "",
        },
    })

    async function onSubmit(values: z.infer<typeof tagSchema>) {
        setLoading(true)
        try {
            if (tag) {
                await updateTag(tag.id, values)
            } else {
                await createTag(values)
            }
            router.push("/admin/tags")
            router.refresh()
        } catch (error: any) {
            console.error(error)
            alert("Something went wrong: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Tag Name" {...field} onChange={e => {
                                    field.onChange(e)
                                    if (!tag && !form.getValues('slug')) {
                                        form.setValue('slug', e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                                    }
                                }} />
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

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Tag"}
                </Button>
            </form>
        </Form>
    )
}
