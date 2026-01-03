import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database"
import { TargetFormValues } from "@/lib/validations/target"
import { useWorkspace } from "@/hooks/useWorkspace"
import { logActivity } from "@/lib/logger"
import { notify } from "@/app/(app)/notify/actions"

type Target = Database["public"]["Tables"]["targets"]["Row"]

export function useTargets() {
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery({
        queryKey: ["workspace", workspaceId, "targets"],
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("targets")
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })

            if (error) throw error
            return data as Target[]
        },
        enabled: !!workspaceId,
    })
}

export function useTarget(id: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: ["target", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("targets")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            return data as Target
        },
        enabled: !!id,
    })
}

export function useCreateTarget() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: TargetFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("targets")
                .insert({
                    ...values,
                    workspace_id: workspaceId,
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            if (workspaceId) {
                logActivity({
                    action: "created",
                    entityType: "target",
                    entityId: data.id,
                    entityName: data.company_name,
                    workspaceId: workspaceId,
                })
                notify(`✅ New Target Added: <b>${data.company_name}</b>`)
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "targets"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
            }
        },
    })
}

export function useCreateTargets() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: TargetFormValues[]) => {
            if (!workspaceId) throw new Error("Workspace ID missing")

            const toInsert = values.map(v => ({
                ...v,
                workspace_id: workspaceId
            }))

            const { data, error } = await supabase
                .from("targets")
                .insert(toInsert)
                .select()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            if (workspaceId && data) {
                logActivity({
                    action: "bulk_created",
                    entityType: "target",
                    entityId: workspaceId,
                    entityName: `${data.length} Targets`,
                    workspaceId: workspaceId,
                    metadata: { count: data.length }
                })
                // Notify for bulk?
                notify(`✅ Bulk Added ${data.length} Targets`)
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "targets"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
            }
        },
    })
}

export function useUpdateTarget() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: Partial<TargetFormValues> }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("targets")
                .update(values)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        // Optimistic Update
        onMutate: async ({ id, values }) => {
            if (!workspaceId) return
            await queryClient.cancelQueries({ queryKey: ["workspace", workspaceId, "targets"] })
            const previousTargets = queryClient.getQueryData<Target[]>(["workspace", workspaceId, "targets"])

            if (previousTargets) {
                queryClient.setQueryData<Target[]>(["workspace", workspaceId, "targets"], (old) =>
                    old ? old.map((t) => (t.id === id ? { ...t, ...values } : t)) : []
                )
            }
            return { previousTargets }
        },
        onError: (err, newTarget, context) => {
            if (context?.previousTargets) {
                queryClient.setQueryData(["workspace", workspaceId, "targets"], context.previousTargets)
            }
        },
        onSuccess: (data, variables) => {
            if (variables.values.status) {
                notify(`🔁 Target moved: <b>${data.company_name}</b> → ${variables.values.status}`)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "targets"] })
            queryClient.invalidateQueries({ queryKey: ["target"] })
        },
    })
}

export function useConvertTarget() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (target: Target) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase.rpc('convert_target_to_client', {
                p_target_id: target.id,
                p_workspace_id: workspaceId
            })

            if (error) throw error
            return data
        },
        onSuccess: (data, target) => {
            notify(`🚀 Target Converted: <b>${target.company_name}</b>`)
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "targets"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "clients"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "leads"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}
