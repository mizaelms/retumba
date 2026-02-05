import { notFound } from "next/navigation";
import { db } from "@/db";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MDXContent } from "@/components/mdx-content";
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
    <article className="container max-w-3xl py-12 px-4">
        <div className="space-y-4 text-center mb-10">
            <div className="flex justify-center gap-2 flex-wrap">
                {post.postCategories?.map((pc: any) => (
                    <Badge key={pc.category.id} variant="secondary">
                        {pc.category.name}
                    </Badge>
                ))}
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{post.title}</h1>
             <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author?.avatar_url || ""} />
                        <AvatarFallback>{post.author?.display_name?.substring(0,2).toUpperCase() || "??"}</AvatarFallback>
                     </Avatar>
                     <span className="text-sm font-medium">{post.author?.display_name}</span>
                </div>
                <span className="text-sm">
                     {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                </span>
             </div>
        </div>

        {post.cover_image_url && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border mb-10 bg-muted">
                 <img src={post.cover_image_url} alt={post.title} className="object-cover w-full h-full" />
            </div>
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none">
             <MDXContent content={post.content || ""} />
        </div>

        <div className="mt-10 pt-10 border-t flex gap-2 flex-wrap">
             {post.postTags?.map((pt: any) => (
                <Badge key={pt.tag.id} variant="outline">
                    #{pt.tag.name}
                </Badge>
            ))}
        </div>
    </article>
  );
}
