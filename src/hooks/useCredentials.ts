"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useWorkspace } from "@/hooks/useWorkspace"
import { logActivity } from "@/lib/logger"

export type Credential = {
    id: string
    title: string
    username?: string
    password?: string
    url?: string
    created_at: string
}

export type CredentialFormValues = {
    title: string
    username?: string
    password?: string
    url?: string
}

export function useCredentials() {
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useQuery<Credential[]>({
        queryKey: ["workspace", workspaceId, "credentials"],
        enabled: !!workspaceId,
        queryFn: async () => {
            if (!workspaceId) throw new Error("Workspace ID missing")

            const { data, error } = await supabase
                .from("ideas")
                .select("*")
                .eq("workspace_id", workspaceId)
                .eq("template_type", "credential")
                .order("created_at", { ascending: false })

            if (error) throw error

            // Map ideas to credentials
            return (data || []).map(idea => ({
                id: idea.id,
                title: idea.title,
                created_at: idea.created_at,
                // Parse assets JSON
                ...(typeof idea.assets === 'object' ? idea.assets : {})
            }))
        },
    })
}

export function useCreateCredential() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (values: CredentialFormValues) => {
            if (!workspaceId) throw new Error("Workspace ID missing")

            const { data, error } = await supabase
                .from("ideas")
                .insert([{
                    workspace_id: workspaceId,
                    title: values.title,
                    status: "approved",
                    template_type: "credential",
                    assets: {
                        username: values.username,
                        password: values.password,
                        url: values.url
                    }
                }])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            if (!workspaceId) return

            logActivity({
                action: "created",
                entityType: "credential",
                entityId: data.id,
                entityName: data.title,
                workspaceId: workspaceId,
            })

            queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "credentials"] })
        },
    })
}

export function useDeleteCredential() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("ideas")
                .delete()
                .eq("id", id)

            if (error) throw error
        },
        onSuccess: () => {
            if (workspaceId) {
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "credentials"] })
            }
        }
    })
}

export function useUpdateCredential() {
    const queryClient = useQueryClient()
    const { workspace } = useWorkspace()
    const workspaceId = workspace?.id

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: CredentialFormValues }) => {
            const { data, error } = await supabase
                .from("ideas")
                .update({
                    title: values.title,
                    assets: {
                        username: values.username,
                        password: values.password,
                        url: values.url
                    }
                })
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            if (workspaceId) {
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId, "credentials"] })
            }
        }
    })
}
