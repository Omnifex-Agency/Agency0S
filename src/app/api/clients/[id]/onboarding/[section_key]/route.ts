import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string; section_key: string }> }
) {
    const supabase: any = await createClient()
    const { id: clientId, section_key } = await params
    const body = await req.json()
    const { status, data: sectionData } = body

    // 1. Get Session ID
    const { data: session } = await supabase
        .from("onboarding_sessions" as any)
        .select("id, workspace_id")
        .eq("client_id", clientId)
        .single() as any

    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 })

    // 2. Update Section
    const { data: section, error } = await supabase
        .from("onboarding_sections" as any)
        .update({
            status,
            data: sectionData,
            updated_at: new Date().toISOString()
        } as any)
        .eq("session_id", session.id)
        .eq("section_key", section_key)
        .select()
        .single() as any

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // 3. Log Activity (Minimal MVP)
    await supabase.from("activity_logs" as any).insert({
        workspace_id: session.workspace_id,
        action: "update_section",
        entity_type: "section",
        entity_id: section.id,
        after_state: { status }
    } as any)

    // 4. Recalculate Progress (in background ideally, but here sync)
    // Fetch all sections status
    const { data: allSections } = await supabase
        .from("onboarding_sections" as any)
        .select("status")
        .eq("session_id", session.id) as any

    if (allSections) {
        const total = allSections.length
        const done = allSections.filter((s: any) => s.status === 'done').length
        const pct = total > 0 ? Math.round((done / total) * 100) : 0

        let sessionStatus = 'incomplete'
        if (pct === 0) sessionStatus = 'not_started'
        if (pct === 100) sessionStatus = 'submitted' // 'approved' is manual

        await supabase.from("onboarding_sessions" as any).update({
            completion_percentage: pct,
            status: sessionStatus
        } as any).eq("id", session.id)

        // Return updated session subset
        return NextResponse.json({
            section,
            session: { status: sessionStatus, completion_percentage: pct }
        })
    }

    return NextResponse.json({ section })
}
