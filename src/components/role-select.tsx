"use client"

import { updateUserRole } from "@/app/actions/users"
import { useState } from "react"

export function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [loading, setLoading] = useState(false)

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newRole = e.target.value
        if (newRole === currentRole) return
        if (!confirm(`Change role to ${newRole}?`)) return
        setLoading(true)
        try {
            await updateUserRole(userId, newRole)
        } catch (error) {
            alert("Failed to update role")
        } finally {
            setLoading(false)
        }
    }

    return (
        <select value={currentRole} onChange={handleChange} disabled={loading} className="border rounded p-1 text-sm bg-background text-foreground">
            <option value="USER">USER</option>
            <option value="WRITER">WRITER</option>
            <option value="ADMIN">ADMIN</option>
        </select>
    )
}
