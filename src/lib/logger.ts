import { createClient } from "@/lib/supabase/client"

export type LogActivityParams = {
    action: string
    entityType: string
    entityId: string
    entityName?: string
    workspaceId: string
    clientId?: string
    metadata?: Record<string, any>
}

export async function logActivity(params: LogActivityParams) {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const userName = user.user_metadata?.full_name || user.email || "Unknown"

    const { error } = await supabase.from('activity_log').insert({
        workspace_id: params.workspaceId,
        user_id: user.id,
        user_name: userName,
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId,
        entity_name: params.entityName,
        client_id: params.clientId,
        metadata: params.metadata || {}
    })

    if (error) {
        console.error("Failed to log activity:", error)
    }
}
