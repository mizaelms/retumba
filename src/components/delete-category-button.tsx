"use client"

import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/app/actions/categories"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteCategoryButton({ id }: { id: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm("Are you sure? This might affect posts associated with this category.")) return
        setLoading(true)
        try {
            await deleteCategory(id)
            router.refresh()
        } catch (error: any) {
            alert("Error deleting category: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
            Delete
        </Button>
    )
}
