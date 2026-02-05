import { db } from "@/db"
import { usersProfile } from "@/db/schema"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RoleSelect } from "@/components/role-select"

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    let users: any[] = [];
    try {
        users = await db.query.usersProfile.findMany()
    } catch (e) {
        console.error("Failed to fetch users:", e);
    }

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Display Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>{u.display_name || "N/A"}</TableCell>
                                <TableCell className="font-mono text-xs">{u.id}</TableCell>
                                <TableCell>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</TableCell>
                                <TableCell>
                                    <RoleSelect userId={u.id} currentRole={u.role} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
