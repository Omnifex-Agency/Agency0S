import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database"
import { ProjectFormValues } from "@/lib/validations/project"
import { useWorkspace } from "@/hooks/useWorkspace"

type Project = Database["public"]["Tables"]["projects"]["Row"]

export function useProjects(clientId?: string) {
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery({
        queryKey: ["workspace", workspaceId, "projects", clientId],
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            let query = supabase
                .from("projects" as any)
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })

            if (clientId) {
                query = query.eq("client_id", clientId)
            }

            const { data, error } = await query

            if (error) throw error
            return data as Project[]
        },
        enabled: !!workspaceId,
    })
}

export function useProject(id: string) {
    const supabase = createClient() as any

    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("projects" as any)
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            return data as Project
        },
        enabled: !!id,
    })
}

export function useCreateProject() {
    const queryClient = useQueryClient()
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: ProjectFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            // Handle dates
            const startDate = values.start_date ? new Date(values.start_date).toISOString() : null
            const endDate = values.end_date ? new Date(values.end_date).toISOString() : null

            const { data, error } = await supabase
                .from("projects" as any)
                .insert({
                    ...values,
                    workspace_id: workspaceId,
                    start_date: startDate,
                    end_date: endDate,
                } as any)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "projects"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}

export function useUpdateProject() {
    const queryClient = useQueryClient()
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: Partial<ProjectFormValues> }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const updates: any = { ...values }
            if (values.start_date) updates.start_date = new Date(values.start_date).toISOString()
            if (values.end_date) updates.end_date = new Date(values.end_date).toISOString()

            const { data, error } = await supabase
                .from("projects" as any)
                .update(updates as any)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "projects"] })
            queryClient.invalidateQueries({ queryKey: ["project"] }) // also invalidate specific
        },
    })
}
