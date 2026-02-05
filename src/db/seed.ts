import { db } from "./index";
import { categories, tags, posts, usersProfile, postCategories, postTags } from "./schema";

async function seed() {
  console.log("Seeding...");

  // Create Admin User Profile (Placeholder - Replace with real UUID in production)
  // We use a nil UUID for local testing or initial setup if needed,
  // but ideally you run this after creating a user in Supabase Auth.
  const adminId = "00000000-0000-0000-0000-000000000000";

  // Try to insert admin profile if not exists
  await db.insert(usersProfile).values({
    id: adminId,
    display_name: "Admin User",
    role: "ADMIN",
  }).onConflictDoNothing();

  // Categories
  const cats = ["Dark Rock", "Goth", "Industrial", "Post-Punk", "Metal Alternativo"];
  const catIds: number[] = [];

  for (const name of cats) {
    const slug = name.toLowerCase().replace(/ /g, "-");
    const [res] = await db.insert(categories).values({ name, slug }).onConflictDoNothing().returning();
    if (res) {
        catIds.push(res.id);
    } else {
        // If conflict, we assume it exists and we'd need to fetch it to get ID if we strictly wanted to link.
        // For simplicity in this seed, we skip linking if it already exists, or we could fetch.
        // Since we don't have query API enabled in standard insert return on conflict (without 'returning'),
        // we'll skip complex logic for now.
    }
  }

  // Tags
  const tagNames = ["Review", "News", "Interview", "Live", "Classic"];
  const tagIds: number[] = [];
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/ /g, "-");
    const [res] = await db.insert(tags).values({ name, slug }).onConflictDoNothing().returning();
     if (res) tagIds.push(res.id);
  }

  // Posts
  const demoPosts = [
    {
        title: "The Resurrection of Goth",
        slug: "resurrection-of-goth",
        excerpt: "An in-depth look at the modern goth scene.",
        content: "# Goth is back\n\nIt never left, but it's stronger than ever...",
        status: "published" as const,
        author_id: adminId,
        published_at: new Date(),
    },
    {
        title: "Industrial Noise: A History",
        slug: "industrial-noise-history",
        excerpt: "From factory floors to dance floors.",
        content: "# Clank Clank\n\nThe sound of metal...",
        status: "draft" as const,
        author_id: adminId,
    }
  ];

  for (const p of demoPosts) {
      const [post] = await db.insert(posts).values(p).onConflictDoNothing().returning();
      if (post) {
          // Add random category and tag
          if (catIds.length > 0) {
              await db.insert(postCategories).values({ post_id: post.id, category_id: catIds[0] }).onConflictDoNothing();
          }
          if (tagIds.length > 0) {
              await db.insert(postTags).values({ post_id: post.id, tag_id: tagIds[0] }).onConflictDoNothing();
          }
      }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
