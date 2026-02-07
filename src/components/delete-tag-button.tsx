"use client"

import { Button } from "@/components/ui/button"
import { deleteTag } from "@/app/actions/tags"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteTagButton({ id }: { id: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm("Are you sure? This might affect posts associated with this tag.")) return
        setLoading(true)
        try {
            await deleteTag(id)
            router.refresh()
        } catch (error: any) {
            alert("Error deleting tag: " + error.message)
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
