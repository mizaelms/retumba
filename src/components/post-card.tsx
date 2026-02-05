import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

// We should use strict types, but for now 'any' allows us to move fast with the deeply nested relation structure.
// Ideally we define a type like PostWithRelations
export function PostCard({ post }: { post: any }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:border-foreground/50 text-center font-retro">
      {post.cover_image_url && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={post.cover_image_url} alt={post.title} className="object-cover w-full h-full transition-transform hover:scale-105" />
        </div>
      )}
      <CardHeader>
        <div className="flex gap-2 mb-2 flex-wrap justify-center">
          {post.postCategories?.map((pc: any) => (
            <Badge key={pc.category.id} variant="secondary" className="text-xs">
              {pc.category.name}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2 text-xl">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between mt-auto px-6 pb-6">
        <span>{post.author?.display_name || "Unknown"}</span>
        <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}</span>
      </CardFooter>
    </Card>
  );
}
