import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database"
import { TaskFormValues } from "@/lib/validations/task"
import { useWorkspace } from "@/hooks/useWorkspace"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

export function useTasks(filters?: { clientId?: string; projectId?: string }) {
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery({
        queryKey: ["workspace", workspaceId, "tasks", filters],
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            let query = supabase
                .from("tasks" as any)
                .select("*")
                .eq("workspace_id", workspaceId)
                .order("created_at", { ascending: false })

            if (filters?.clientId) {
                query = query.eq("client_id", filters.clientId)
            }
            if (filters?.projectId) {
                query = query.eq("project_id", filters.projectId)
            }

            const { data, error } = await query

            if (error) throw error
            return data as Task[]
        },
        enabled: !!workspaceId,
    })
}

export function useCreateTask() {
    const queryClient = useQueryClient()
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: TaskFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("tasks" as any)
                .insert({
                    ...values,
                    workspace_id: workspaceId,
                    due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
                } as any)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}

export function useUpdateTask() {
    const queryClient = useQueryClient()
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: Partial<TaskFormValues> }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const updates: any = { ...values }
            if (values.due_date) updates.due_date = new Date(values.due_date).toISOString()

            const { data, error } = await supabase
                .from("tasks" as any)
                .update(updates as any)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        // Optimistic Update
        onMutate: async ({ id, values }) => {
            if (!workspaceId) return
            await queryClient.cancelQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
            const previousTasks = queryClient.getQueryData<Task[]>(["workspace", workspaceId, "tasks"])

            if (previousTasks) {
                queryClient.setQueryData<Task[]>(["workspace", workspaceId, "tasks"], (old) =>
                    old ? old.map((t) => (t.id === id ? { ...t, ...values } : t)) : []
                )
            }
            return { previousTasks }
        },
        onError: (err, newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["workspace", workspaceId, "tasks"], context.previousTasks)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
            queryClient.invalidateQueries({ queryKey: ["task"] })
        },
    })
}

export function useToggleTask() {
    const queryClient = useQueryClient()
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { data, error } = await supabase
                .from("tasks" as any)
                .update({
                    status: completed ? "completed" : "todo",
                    completed_at: completed ? new Date().toISOString() : null,
                } as any)
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
        },
    })
}

export function useDeleteTask() {
    const queryClient = useQueryClient()
    const supabase = createClient() as any
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (id: string) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { error } = await supabase
                .from("tasks" as any)
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
        },
    })
}
