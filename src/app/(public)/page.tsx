import { db } from "@/db";
import { posts, usersProfile, categories } from "@/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { VinylBackground } from "@/components/vinyl-background";

export default async function Home() {
  let latestPosts: any[] = [];
  let allCategories: any[] = [];

  try {
    latestPosts = await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.status, "published"),
      orderBy: [desc(posts.published_at)],
      limit: 12,
      with: {
        author: true,
        postCategories: {
          with: {
            category: true
          }
        }
      }
    });

    allCategories = await db.query.categories.findMany({
      orderBy: [asc(categories.name)]
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    // In a real build without DB access, this allows the build to pass but renders empty
  }

  return (
    <main className="container mx-auto py-8 md:py-12 px-4 relative">
      <VinylBackground />
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Retumba Music Blog
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Reseñas, entrevistas, recomendaciones. Registramos el ruido más actual y las novedades de este mundo.
          </p>
        </div>
      </section>

      {allCategories.length > 0 && (
        <section className="container py-4 flex flex-wrap gap-2 justify-center mb-8">
          {allCategories.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="text-sm py-1 px-3">
              {cat.name}
            </Badge>
          ))}
        </section>
      )}

      {latestPosts.length > 0 ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p>No posts found (or database connection failed).</p>
        </div>
      )}
    </main>
  );
}
