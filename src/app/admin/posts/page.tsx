import { db } from "@/db"
import { posts } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
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
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DeleteButton } from "@/components/delete-button"

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
    let allPosts: any[] = [];
    try {
        allPosts = await db.query.posts.findMany({
            orderBy: [desc(posts.created_at)],
            with: {
                author: true
            }
        })
    } catch (e) {
        console.error("Failed to fetch posts:", e);
    }

    return (
        <div className="container py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Posts</h1>
                <Link href="/admin/posts/create">
                    <Button>Create Post</Button>
                </Link>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>
                                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                        {post.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{post.author?.display_name}</TableCell>
                                <TableCell>
                                    {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/posts/${post.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <DeleteButton id={post.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
