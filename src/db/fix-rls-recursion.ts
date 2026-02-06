import "./env-config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Fixing RLS recursion in users_profile...");

    try {
        await db.execute(sql`
            -- 1. Create a secure function to check admin status without triggering RLS
            CREATE OR REPLACE FUNCTION public.is_admin()
            RETURNS boolean
            LANGUAGE plpgsql
            SECURITY DEFINER
            SET search_path = public
            AS $$
            BEGIN
              RETURN EXISTS (
                SELECT 1
                FROM public.users_profile
                WHERE id = auth.uid()
                AND role = 'ADMIN'
              );
            END;
            $$;

            -- 2. Drop the problematic recursive policy
            DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users_profile;

            -- 3. Re-create the policy using the secure function
            CREATE POLICY "Admins can view all profiles"
            ON public.users_profile
            FOR SELECT
            USING ( is_admin() );
        `);
        console.log("Function and policy updated successfully.");
        console.log("RLS recursion fix applied.");
    } catch (e) {
        console.error("Error fixing RLS:", e);
    }

    process.exit(0);
}

main().catch(console.error);
