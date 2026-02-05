"use client"

import { Button } from "@/components/ui/button"
import { deletePost } from "@/app/actions/posts"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteButton({ id }: { id: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm("Are you sure?")) return
        setLoading(true)
        try {
             await deletePost(id)
             router.refresh()
        } catch (error) {
            alert("Error deleting post")
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
