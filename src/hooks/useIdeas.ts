import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database"
import { IdeaFormValues } from "@/lib/validations/idea"
import { useWorkspace } from "@/hooks/useWorkspace"
import { logActivity } from "@/lib/logger"

type Idea = Database["public"]["Tables"]["ideas"]["Row"]

export function useIdeas() {
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery({
        queryKey: ["workspace", workspaceId, "ideas"],
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("ideas")
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })

            if (error) throw error
            return data as Idea[]
        },
        enabled: !!workspaceId,
    })
}

export function useIdea(id: string) {
    const supabase = createClient()

    return useQuery({
        queryKey: ["idea", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("ideas")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            return data as Idea
        },
        enabled: !!id,
    })
}

export function useCreateIdea() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: IdeaFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("ideas")
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
                    entityType: "idea",
                    entityId: data.id,
                    entityName: data.title,
                    workspaceId: workspaceId,
                })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "ideas"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
            }
        },
    })
}

export function useUpdateIdea() {
    const queryClient = useQueryClient()
    const supabase = createClient()
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
        // Optimistic Update
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
        onError: (err, newIdea, context) => {
            if (context?.previousIdeas) {
                queryClient.setQueryData(["workspace", workspaceId, "ideas"], context.previousIdeas)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "ideas"] })
            queryClient.invalidateQueries({ queryKey: ["idea"] })
        },
    })
}
