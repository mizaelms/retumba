import { PostForm } from "@/components/post-form";
import { db } from "@/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) notFound();

    let post;
    let categories: any[] = [];
    let tags: any[] = [];

    try {
        post = await db.query.posts.findFirst({
            where: (p, { eq }) => eq(p.id, postId),
            with: {
                postCategories: true,
                postTags: true
            }
        });

        if (!post) notFound();

        categories = await db.query.categories.findMany();
        tags = await db.query.tags.findMany();
    } catch (e) {
        console.error("Error fetching post or taxonomy:", e);
        // If we can't fetch the post, we can't edit it.
        // But for build safety, we might just return null or error.
        // If post is missing (due to error), notFound() will trigger if we let it fall through,
        // but here we might just want to show error state.
    }

    if (!post) {
        // If DB failed, we might not want to 404, but for now it's fine.
        return <div>Error loading post (Database connection failed)</div>;
    }

    return (
        <div className="container py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
            <PostForm post={post} categories={categories} tags={tags} />
        </div>
    )
}
