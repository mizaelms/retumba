import { PostForm } from "@/components/post-form";
import { db } from "@/db";

export const dynamic = 'force-dynamic';

export default async function CreatePostPage() {
    let categories: any[] = [];
    let tags: any[] = [];

    try {
        categories = await db.query.categories.findMany();
        tags = await db.query.tags.findMany();
    } catch (e) {
        console.error("Failed to fetch taxonomy for create post:", e);
    }

    return (
        <div className="container py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create Post</h1>
            <PostForm categories={categories} tags={tags} />
        </div>
    )
}
