import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    let error = null;

    if (user) {
        const result = await supabase
            .from("users_profile")
            .select("*")
            .eq("id", user.id)
            .single();
        profile = result.data;
        error = result.error;
    }

    return (
        <div className="container py-20 mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Debug User Role</h1>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded overflow-auto">
                {JSON.stringify({
                    auth_user_id: user?.id,
                    email: user?.email,
                    profile_record: profile,
                    fetch_error: error
                }, null, 2)}
            </pre>
            <p className="mt-4">
                If <code>profile_record.role</code> is not "ADMIN", you will be redirected from /admin.
            </p>
        </div>
    );
}
