import { db } from "@/db"
import { categories } from "@/db/schema"
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
import { DeleteCategoryButton } from "@/components/delete-category-button"

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    let allCategories: any[] = [];
    try {
        allCategories = await db.query.categories.findMany({
            orderBy: [desc(categories.created_at)],
        })
    } catch (e) {
        console.error("Failed to fetch categories:", e);
    }

    return (
        <div className="container py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/admin/categories/create">
                    <Button>Create Category</Button>
                </Link>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>
                                    {category.created_at ? format(new Date(category.created_at), 'MMM d, yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <DeleteCategoryButton id={category.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {allCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
