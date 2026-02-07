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
import { categorySchema } from "@/lib/validations/taxonomy"
import { createCategory, updateCategory } from "@/app/actions/categories"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CategoryFormProps {
    category?: {
        id: number;
        name: string;
        slug: string;
    }
}

export function CategoryForm({ category }: CategoryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || "",
            slug: category?.slug || "",
        },
    })

    async function onSubmit(values: z.infer<typeof categorySchema>) {
        setLoading(true)
        try {
            if (category) {
                await updateCategory(category.id, values)
            } else {
                await createCategory(values)
            }
            router.push("/admin/categories")
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
                                <Input placeholder="Category Name" {...field} onChange={e => {
                                    field.onChange(e)
                                    if (!category && !form.getValues('slug')) {
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
                    {loading ? "Saving..." : "Save Category"}
                </Button>
            </form>
        </Form>
    )
}
