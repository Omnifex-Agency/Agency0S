"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useWorkspace } from "@/hooks/useWorkspace"
import { useToast } from "@/hooks/use-toast"

export interface ResearchDoc {
    id: string
    workspace_id: string
    title: string
    content: string
    type: "general" | "competitor_analysis" | "swot" | "meeting_notes"
    target_id?: string
    client_id?: string
    project_id?: string
    created_at: string
    updated_at: string
}

export type NewResearchDoc = {
    title: string
    content: string
    type: string
    target_id?: string
    client_id?: string
    project_id?: string
}

export function useResearchDocs() {
    const { workspace } = useWorkspace()
    const supabase = createClient() as any

    return useQuery({
        queryKey: ["research_docs", workspace?.id],
        queryFn: async () => {
            if (!workspace?.id) return []
            const { data, error } = await supabase
                .from("research_docs" as any)
                .select("*")
                .eq("workspace_id", workspace.id)
                .order("updated_at", { ascending: false })

            if (error) throw error
            return data as ResearchDoc[]
        },
        enabled: !!workspace?.id,
    })
}

export function useCreateResearchDoc() {
    const { workspace } = useWorkspace()
    const supabase = createClient() as any
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (doc: NewResearchDoc) => {
            if (!workspace?.id) throw new Error("No workspace")
            const { data, error } = await supabase
                .from("research_docs" as any)
                .insert({
                    ...doc,
                    workspace_id: workspace.id,
                })
                .select()
                .single()

            if (error) throw error
            return data as ResearchDoc
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["research_docs"] })
            toast({ title: "Research Created", description: "Document saved." })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        },
    })
}

export function useResearchDoc(id: string) {
    const supabase = createClient() as any

    return useQuery({
        queryKey: ["research_doc", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("research_docs" as any)
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            return data as ResearchDoc
        },
        enabled: !!id,
    })
}

export function useUpdateResearchDoc() {
    const supabase = createClient() as any
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<NewResearchDoc> }) => {
            const { data, error } = await supabase
                .from("research_docs" as any)
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single()

            if (error) throw error
            return data as ResearchDoc
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["research_docs"] })
            queryClient.invalidateQueries({ queryKey: ["research_doc", data.id] })
            toast({ title: "Saved", description: "Changes saved successfully." })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        },
    })
}
