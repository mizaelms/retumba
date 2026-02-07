import "./env-config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Applying RLS policies to users_profile...");

    try {
        await db.execute(sql`
            ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
            
            -- Policy 1: Users can view their own profile
            DROP POLICY IF EXISTS "Users can view their own profile" ON public.users_profile;
            CREATE POLICY "Users can view their own profile" 
            ON public.users_profile 
            FOR SELECT 
            USING ( auth.uid() = id );
            
            -- Policy 2: Admins can view all profiles
            -- We avoid infinite recursion by NOT checking the table again if we are just checking our own ID (covered by Policy 1),
            -- but for checking if I am an admin to view OTHERS, we need to read my role.
            -- The subquery (SELECT role FROM users_profile WHERE id = auth.uid()) will be allowed by Policy 1.
            
            DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users_profile;
            CREATE POLICY "Admins can view all profiles"
            ON public.users_profile
            FOR SELECT
            USING ( 
                (SELECT role FROM public.users_profile WHERE id = auth.uid()) = 'ADMIN' 
            );
        `);
        console.log("RLS policies applied successfully.");
    } catch (e) {
        console.error("Error applying RLS:", e);
    }

    process.exit(0);
}

main().catch(console.error);
