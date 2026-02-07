import { TagForm } from "@/components/tag-form";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTagPage({ params }: PageProps) {
    const { id } = await params;
    const tagId = parseInt(id);
    if (isNaN(tagId)) notFound();

    let tag;
    try {
        tag = await db.query.tags.findFirst({
            where: (t, { eq }) => eq(t.id, tagId),
        });
    } catch (e) {
        console.error("Error fetching tag:", e);
    }

    if (!tag) {
        return <div>Tag not found</div>;
    }

    return (
        <div className="container py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Tag</h1>
            <TagForm tag={tag} />
        </div>
    )
}
