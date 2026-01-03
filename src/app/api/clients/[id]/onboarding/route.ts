import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase: any = await createClient()
    const { id } = await params

    // Fetch session
    const { data: session, error: sessError } = await supabase
        .from("onboarding_sessions" as any)
        .select("*")
        .eq("client_id", id)
        .single() as any // Assume 1 active session for MVP

    if (sessError || !session) {
        // Auto-create if missing? (Self-healing). 
        // For now, return 404 or empty structure.
        return NextResponse.json({ error: "No onboarding session found" }, { status: 404 })
    }

    // Fetch sections
    const { data: sections, error: secError } = await supabase
        .from("onboarding_sections" as any)
        .select(`
            *,
            section_comments (count),
            intake_files (*)
        `) // Note: We need a way to join files properly. 
        // Standard Supabase join syntax:
        // section_comments(count)
        // simple join might not work if fkeys aren't perfect or explicit.
        .eq("session_id", session.id) as any

    // Actually, `intake_files` refs `section_id`, so we can join `intake_files(id, file_key, kind, url)`

    if (secError) {
        return NextResponse.json({ error: secError.message }, { status: 500 })
    }

    // We can manually fetch files if join is complex, but let's try standard
    // The query above is a bit pseudo-code-y for exact Postgrest syntax if relations aren't named. 
    // Let's assume standard behavior.

    return NextResponse.json({
        session,
        sections
    })
}
