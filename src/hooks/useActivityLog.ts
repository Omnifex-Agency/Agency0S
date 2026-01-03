import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/hooks/useWorkspace"

export function useActivityLog(filters?: { limit?: number; entityId?: string; entityType?: string }) {
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery({
        queryKey: ["workspace", workspaceId, "activity", filters],
        queryFn: async () => {
            if (!workspaceId) return []

            let query = supabase
                .from("activity_log" as any)
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })
                .limit(filters?.limit || 20)

            if (filters?.entityId) {
                query = query.eq("entity_id", filters.entityId)
            }

            if (filters?.entityType) {
                query = query.eq("entity_type", filters.entityType)
            }

            const { data, error } = await query

            if (error) throw error
            return data
        },
        enabled: !!workspaceId
    })
}
