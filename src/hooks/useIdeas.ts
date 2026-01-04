"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { Database } from "@/types/database"
import { IdeaFormValues } from "@/lib/validations/idea"
import { useWorkspace } from "@/hooks/useWorkspace"
import { logActivity } from "@/lib/logger"

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Idea = Database["public"]["Tables"]["ideas"]["Row"]
type IdeaInsert = Database["public"]["Tables"]["ideas"]["Insert"]

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

export function useIdeas() {
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery<Idea[]>({
        queryKey: ["workspace", workspaceId, "ideas"],
        enabled: !!workspaceId,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("ideas")
                .select("id, workspace_id, title, status, template_type, tags, created_at, owner_id, related_client_id, related_project_id")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })

            if (error) throw error
            return data as unknown as Idea[]
        },
    })
}

export function useIdea(id: string) {
    return useQuery<Idea>({
        queryKey: ["idea", id],
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("ideas")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            return data
        },
    })
}

/* -------------------------------------------------------------------------- */
/*                                   Mutations                                 */
/* -------------------------------------------------------------------------- */

export function useCreateIdea() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: IdeaFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")

            const payload: IdeaInsert = {
                workspace_id: workspaceId,
                title: values.title,
                status: values.status,
                template_type: values.template_type,
                problem: values.problem ?? null,
                insight: values.insight ?? null,
                hypothesis: values.hypothesis ?? null,
                tags: values.tags ?? [],
                execution_plan: values.execution_plan ?? null,
                metrics: values.metrics ?? null,
                risks: values.risks ?? null,
                next_steps: values.next_steps ?? null,
            }

            const { data, error } = await supabase
                .from("ideas")
                .insert([payload])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            if (!workspaceId) return

            logActivity({
                action: "created",
                entityType: "idea",
                entityId: data.id,
                entityName: data.title,
                workspaceId: workspaceId,
            })

            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "ideas"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}

export function useUpdateIdea() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: Partial<IdeaFormValues> }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("ideas")
                .update(values)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        /* ----------------------------- Optimistic UI ----------------------------- */
        onMutate: async ({ id, values }) => {
            if (!workspaceId) return
            await queryClient.cancelQueries({ queryKey: ["workspace", workspaceId, "ideas"] })
            const previousIdeas = queryClient.getQueryData<Idea[]>(["workspace", workspaceId, "ideas"])

            if (previousIdeas) {
                queryClient.setQueryData<Idea[]>(["workspace", workspaceId, "ideas"], (old) =>
                    old ? old.map((i) => (i.id === id ? { ...i, ...values } : i)) : []
                )
            }
            return { previousIdeas }
        },
        onError: (_err, _vars, context) => {
            if (context?.previousIdeas && workspaceId) {
                queryClient.setQueryData(["workspace", workspaceId, "ideas"], context.previousIdeas)
            }
        },
        onSettled: () => {
            if (!workspaceId) return
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "ideas"] })
            queryClient.invalidateQueries({ queryKey: ["idea"] })
        },
    })
}
