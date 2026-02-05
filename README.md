# Retumba Music Blog

A modern, fast, SEO-friendly dark rock music blog built with Next.js, Drizzle ORM, and Supabase.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Auth:** Supabase Auth
- **UI:** Tailwind CSS + shadcn/ui
- **Validation:** Zod

## Getting Started

1.  **Environment Variables**
    Copy `.env.example` to `.env.local` (create it if needed) and fill in your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    DATABASE_URL=postgres://postgres.your-project:password@aws-0-region.pooler.supabase.com:6543/postgres
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    - Generate migrations: `npm run db:generate`
    - Apply migrations: `npm run db:migrate`
    - Apply RLS policies: Copy contents of `supabase/rls.sql` and run in Supabase SQL Editor.
    - Seed database (Creates Categories/Tags/Demo Posts): `npm run db:seed`

    *Note: The seed script attempts to use a placeholder Admin ID. For production, you should create a user in Supabase Auth first, then update the ID in `src/db/seed.ts` or promote manually.*

4.  **Create Admin User**
    - Sign up a new user via `/login`.
    - Go to Supabase Table Editor -> `users_profile`.
    - Find your user and change `role` to `ADMIN`.
    - Alternatively, use the SQL Editor:
      ```sql
      UPDATE users_profile SET role = 'ADMIN' WHERE id = 'your-user-uuid';
      ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Features

- **RBAC:** Admin, Writer, User, Public roles.
- **Admin Dashboard:** Manage posts (Create, Edit, Delete) and Users.
- **Secure Embeds:** Whitelisted YouTube and Spotify embeds.
- **Image Upload:** Upload cover images to Supabase Storage.
- **MDX Support:** Write posts in Markdown with component support.
