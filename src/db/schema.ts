import { pgTable, serial, text, timestamp, boolean, uuid, primaryKey, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoles = ["ADMIN", "WRITER", "USER"] as const;
export type UserRole = (typeof userRoles)[number];

export const usersProfile = pgTable("users_profile", {
  id: uuid("id").primaryKey(), // references auth.users
  display_name: text("display_name"),
  avatar_url: text("avatar_url"),
  role: text("role").$type<UserRole>().default("USER").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const postStatus = ["draft", "review", "published"] as const;
export type PostStatus = (typeof postStatus)[number];

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"), // Markdown/MDX
  cover_image_url: text("cover_image_url"),
  status: text("status").$type<PostStatus>().default("draft").notNull(),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  author_id: uuid("author_id").references(() => usersProfile.id).notNull(),
});

export const postCategories = pgTable("post_categories", {
  post_id: integer("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  category_id: integer("category_id").references(() => categories.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.post_id, t.category_id] }),
}));

export const postTags = pgTable("post_tags", {
  post_id: integer("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  tag_id: integer("tag_id").references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.post_id, t.tag_id] }),
}));

// Relations
export const usersProfileRelations = relations(usersProfile, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(usersProfile, {
    fields: [posts.author_id],
    references: [usersProfile.id],
  }),
  postCategories: many(postCategories),
  postTags: many(postTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.post_id],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.category_id],
    references: [categories.id],
  }),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.post_id],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tag_id],
    references: [tags.id],
  }),
}));
