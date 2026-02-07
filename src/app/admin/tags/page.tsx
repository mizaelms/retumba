import { db } from "@/db"
import { tags } from "@/db/schema"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { DeleteTagButton } from "@/components/delete-tag-button"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function AdminTagsPage() {
    let allTags: any[] = [];
    try {
        allTags = await db.query.tags.findMany({
            orderBy: [desc(tags.created_at)],
        })
    } catch (e) {
        console.error("Failed to fetch tags:", e);
    }

    return (
        <div className="container py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Tags</h1>
                <Link href="/admin/tags/create">
                    <Button>Create Tag</Button>
                </Link>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Preview</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allTags.map((tag) => (
                            <TableRow key={tag.id}>
                                <TableCell className="font-medium">{tag.name}</TableCell>
                                <TableCell>{tag.slug}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{tag.name}</Badge>
                                </TableCell>
                                <TableCell>
                                    {tag.created_at ? format(new Date(tag.created_at), 'MMM d, yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/tags/${tag.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <DeleteTagButton id={tag.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {allTags.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    No tags found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
