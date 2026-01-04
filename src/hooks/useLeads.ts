import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { Database } from "@/types/database"
import { LeadFormValues } from "@/lib/validations/lead"
import { useWorkspace } from "@/hooks/useWorkspace"

type Lead = Database["public"]["Tables"]["leads"]["Row"]

export function useLeads() {
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery({
        queryKey: ["workspace", workspaceId, "leads"],
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })

            if (error) throw error
            return data as Lead[]
        },
        enabled: !!workspaceId,
    })
}

export function useLead(id: string) {
    return useQuery({
        queryKey: ["lead", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            return data as Lead
        },
        enabled: !!id,
    })
}

export function useCreateLead() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: LeadFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("leads")
                .insert([{
                    ...values,
                    workspace_id: workspaceId,
                }])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "leads"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}

export function useUpdateLead() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: Partial<LeadFormValues> }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("leads")
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
            await queryClient.cancelQueries({ queryKey: ["workspace", workspaceId, "leads"] })
            const previousLeads = queryClient.getQueryData<Lead[]>(["workspace", workspaceId, "leads"])

            if (previousLeads) {
                queryClient.setQueryData<Lead[]>(["workspace", workspaceId, "leads"], (old) =>
                    old ? old.map((l) => (l.id === id ? { ...l, ...values } : l)) : []
                )
            }
            return { previousLeads }
        },
        onError: (err, newLead, context) => {
            if (context?.previousLeads) {
                queryClient.setQueryData(["workspace", workspaceId, "leads"], context.previousLeads)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "leads"] })
            queryClient.invalidateQueries({ queryKey: ["lead"] })
        },
    })
}

export function useDeleteLead() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (id: string) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { error } = await supabase
                .from("leads")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "leads"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}
