import { CategoryForm } from "@/components/category-form";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
    const { id } = await params;
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) notFound();

    let category;
    try {
        category = await db.query.categories.findFirst({
            where: (c, { eq }) => eq(c.id, categoryId),
        });
    } catch (e) {
        console.error("Error fetching category:", e);
    }

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className="container py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
            <CategoryForm category={category} />
        </div>
    )
}
