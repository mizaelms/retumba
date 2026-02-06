import "./env-config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Applying Storage RLS policies for 'covers' bucket...");

    try {
        await db.execute(sql`
            -- Policy to allow public viewing of files in 'covers' bucket
            DROP POLICY IF EXISTS "Public Access" ON storage.objects;
            CREATE POLICY "Public Access"
            ON storage.objects FOR SELECT
            USING ( bucket_id = 'covers' );

            -- Policy to allow authenticated users to upload to 'covers' bucket
            DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
            CREATE POLICY "Authenticated Upload"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK ( bucket_id = 'covers' );

            -- Policy to allow authenticated users to update/delete their own files (or all files if admin, simplifying to all auth for now)
            DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
            CREATE POLICY "Authenticated Update"
            ON storage.objects FOR UPDATE
            TO authenticated
            USING ( bucket_id = 'covers' );

            DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
            CREATE POLICY "Authenticated Delete"
            ON storage.objects FOR DELETE
            TO authenticated
            USING ( bucket_id = 'covers' );
        `);
        console.log("Storage policies applied successfully.");
        console.log("Storage RLS applied.");
    } catch (e) {
        console.error("Error applying Storage RLS:", e);
    }

    process.exit(0);
}

main().catch(console.error);
