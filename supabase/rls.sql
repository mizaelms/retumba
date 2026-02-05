-- Create a secure function to check for admin role to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users_profile
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- POSTS POLICIES

-- 1. Public can read published posts
CREATE POLICY "Public read published posts"
ON posts FOR SELECT
TO public
USING (status = 'published');

-- 2. Admin has full access
CREATE POLICY "Admin full access posts"
ON posts FOR ALL
TO authenticated
USING (is_admin());

-- 3. Writers/Users can read their own posts (drafts etc)
CREATE POLICY "User read own posts"
ON posts FOR SELECT
TO authenticated
USING (author_id = auth.uid());

-- 4. Writers (and Admins) can insert
-- Note: 'is_admin()' covers admins. Writers need explicit check.
-- We assume anyone with 'WRITER' role can insert.
CREATE POLICY "Writer insert own posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid() AND (
    is_admin() OR EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'WRITER'
    )
  )
);

-- 5. Writers update own posts
CREATE POLICY "Writer update own posts"
ON posts FOR UPDATE
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- 6. Writers delete own posts
CREATE POLICY "Writer delete own posts"
ON posts FOR DELETE
TO authenticated
USING (author_id = auth.uid());


-- USERS_PROFILE POLICIES

-- 1. Public can read profiles (needed for author info on posts)
CREATE POLICY "Public read profiles"
ON users_profile FOR SELECT
TO public
USING (true);

-- 2. Admin full access
CREATE POLICY "Admin full access profiles"
ON users_profile FOR ALL
TO authenticated
USING (is_admin());

-- 3. Users can update their own profile
CREATE POLICY "User update own profile"
ON users_profile FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Insert triggers for new users
-- This triggers when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users_profile (id, display_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', new.email), 'USER');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
