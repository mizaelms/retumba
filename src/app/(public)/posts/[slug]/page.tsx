import { notFound } from "next/navigation";
import { db } from "@/db";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MDXContent } from "@/components/mdx-content";
import { ShareButtons } from "@/components/share-buttons";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.slug, slug),
        });

        if (!post) return {};

        return {
            title: post.title,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt || "",
                images: post.cover_image_url ? [post.cover_image_url] : [],
            }
        };
    } catch (e) {
        return {}
    }
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;

    let post;
    try {
        post = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.slug, slug),
            with: {
                author: true,
                postCategories: {
                    with: {
                        category: true
                    }
                },
                postTags: {
                    with: {
                        tag: true
                    }
                }
            }
        });
    } catch (e) {
        console.error(e);
        // Fallthrough to notFound
    }

    if (!post || post.status !== 'published') {
        notFound();
    }

    return (
        <article className="container mx-auto max-w-3xl py-12 px-4 font-retro transition-colors duration-300">
            {/* Paper effect wrapper for Light Mode only */}
            <div className="rounded-none md:rounded-lg p-0 md:p-8 lg:p-12 transition-all duration-300 dark:bg-transparent dark:text-foreground bg-[#fdfbf7] text-black shadow-none md:shadow-xl md:border md:border-stone-200 dark:shadow-none dark:border-none">

                <div className="space-y-4 text-center mb-10">
                    <div className="flex justify-center gap-2 flex-wrap">
                        {post.postCategories?.map((pc: any) => (
                            <Badge key={pc.category.id} variant="secondary" className="dark:bg-secondary dark:text-secondary-foreground bg-stone-200 text-stone-800 hover:bg-stone-300">
                                {pc.category.name}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl dark:text-foreground text-black">{post.title}</h1>
                    <div className="flex items-center justify-center gap-4 text-muted-foreground dark:text-muted-foreground text-stone-600">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border border-stone-300 dark:border-none">
                                <AvatarImage src={post.author?.avatar_url || ""} />
                                <AvatarFallback>{post.author?.display_name?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-black dark:text-foreground">{post.author?.display_name}</span>
                        </div>
                        <span className="text-sm">
                            {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                        </span>
                    </div>
                </div>

                {post.cover_image_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg border mb-10 bg-muted shadow-sm dark:shadow-none dark:border-border border-stone-200">
                        <img src={post.cover_image_url} alt={post.title} className="object-cover w-full h-full mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                )}

                <div className="prose prose-lg max-w-none 
                    dark:prose-invert 
                    text-black dark:text-foreground 
                    prose-headings:text-black dark:prose-headings:text-foreground 
                    prose-p:text-black dark:prose-p:text-foreground 
                    prose-strong:text-black dark:prose-strong:text-primary 
                    prose-li:text-black dark:prose-li:text-foreground
                    prose-a:text-stone-800 dark:prose-a:text-primary hover:prose-a:text-stone-600">
                    <MDXContent content={post.content || ""} />
                </div>

                <div className="mt-10 pt-10 border-t border-stone-200 dark:border-border">
                    <ShareButtons />
                </div>

                <div className="mt-6 flex gap-2 flex-wrap justify-center">
                    {post.postTags?.map((pt: any) => (
                        <Badge key={pt.tag.id} variant="outline" className="dark:border-border border-stone-300 text-stone-600 dark:text-foreground">
                            #{pt.tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </article>
    );
}
