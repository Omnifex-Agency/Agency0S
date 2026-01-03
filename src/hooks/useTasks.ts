import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database"
import { TaskFormValues } from "@/lib/validations/task"
import { useWorkspace } from "@/hooks/useWorkspace"
import { logActivity } from "@/lib/logger"
import { notify } from "@/app/(app)/notify/actions"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

export function useTasks(filters?: { clientId?: string; projectId?: string }) {
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    // Unified Query Key: ['workspace', workspaceId, 'tasks', filters]
    const queryKey = ["workspace", workspaceId, "tasks", filters] as const

    return useQuery({
        queryKey,
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            let query = supabase
                .from("tasks")
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
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: TaskFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            // Process date to ensure it's valid format or null
            const dueDate = values.due_date ? new Date(values.due_date).toISOString() : null

            const { data, error } = await supabase
                .from("tasks")
                .insert({
                    ...values,
                    workspace_id: workspaceId,
                    assignee_id: values.assignee_id || null,
                    client_id: values.client_id || null,
                    project_id: values.project_id || null,
                    due_date: dueDate,
                    status: values.status || "todo", // Default
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
                    entityType: "task",
                    entityId: data.id,
                    entityName: data.title,
                    workspaceId: workspaceId,
                    clientId: data.client_id || undefined,
                    metadata: { project_id: data.project_id }
                })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
            }
        },
    })
}

export function useUpdateTask() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: Partial<TaskFormValues> }) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const updates: any = { ...values }

            if (values.due_date !== undefined) {
                updates.due_date = values.due_date ? new Date(values.due_date).toISOString() : null
            }
            if (values.assignee_id !== undefined) updates.assignee_id = values.assignee_id || null
            if (values.client_id !== undefined) updates.client_id = values.client_id || null
            if (values.project_id !== undefined) updates.project_id = values.project_id || null

            const { data, error } = await supabase
                .from("tasks")
                .update(updates)
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
            const previousData = queryClient.getQueriesData({ queryKey: ["workspace", workspaceId, "tasks"] })

            queryClient.setQueriesData({ queryKey: ["workspace", workspaceId, "tasks"] }, (old: Task[] | undefined) => {
                if (!old) return []
                return old.map((t) => (t.id === id ? { ...t, ...values } : t))
            })

            return { previousData }
        },
        onError: (err, newTodo, context) => {
            if (context?.previousData) {
                context.previousData.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSettled: (data) => {
            if (workspaceId && data) {
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
            }
        },
        onSuccess: (data, variables) => {
            if (workspaceId) {
                if (variables.values.status === "done") {
                    notify(`✅ Task Done: <b>${data.title}</b>`)
                }
                logActivity({
                    action: "updated",
                    entityType: "task",
                    entityId: data.id,
                    entityName: data.title,
                    workspaceId: workspaceId,
                    clientId: data.client_id || undefined,
                })
            }
        }
    })
}

export function useDeleteTask() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (id: string) => {
            if (!workspaceId) throw new Error("Workspace ID missing")
            const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "tasks"] })
            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "dashboard"] })
        },
    })
}
