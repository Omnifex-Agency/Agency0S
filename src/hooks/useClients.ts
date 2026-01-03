"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useWorkspace } from "@/hooks/useWorkspace"
import { MOCK_CLIENTS } from "@/lib/mock-data"
import { toast } from "@/hooks/use-toast"

// Helper to get from local storage or fall back to mock
const getClientsFromStorage = () => {
    if (typeof window === "undefined") return MOCK_CLIENTS
    const stored = localStorage.getItem("agency_os_clients")
    if (stored) return JSON.parse(stored)
    // Seed initial
    localStorage.setItem("agency_os_clients", JSON.stringify(MOCK_CLIENTS))
    return MOCK_CLIENTS
}

export function useClients() {
    const { workspace } = useWorkspace() // Keep dependency for signature compat

    return useQuery({
        queryKey: ["clients"], // simplified key
        queryFn: async () => {
            // Simulate network delay
            await new Promise(r => setTimeout(r, 600))
            return getClientsFromStorage()
        }
    })
}

export function useClient(id: string) {
    return useQuery({
        queryKey: ["client", id],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 400))
            const clients = getClientsFromStorage()
            const found = clients.find((c: any) => c.id === id)
            if (!found) throw new Error("Client not found (Mock)")
            return found
        }
    })
}

export function useCreateClient() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (values: any) => {
            await new Promise(r => setTimeout(r, 800))
            const clients = getClientsFromStorage()
            const newClient = {
                id: `c${Date.now()}`,
                workspace_id: "demo-ws",
                stage: "lead", // Default
                onboarding_status: "not_started",
                created_at: new Date().toISOString(),
                ...values
            }
            const updated = [newClient, ...clients]
            localStorage.setItem("agency_os_clients", JSON.stringify(updated))
            return newClient
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] })
            toast({ title: "Client Created", description: "Added to your list." })
        }
    })
}

// ... update and delete hooks can follow similar pattern if needed
export function useUpdateClient() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: any }) => {
            await new Promise(r => setTimeout(r, 500))
            const clients = getClientsFromStorage()
            const updated = clients.map((c: any) => c.id === id ? { ...c, ...values } : c)
            localStorage.setItem("agency_os_clients", JSON.stringify(updated))
            return updated.find((c: any) => c.id === id)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["clients"] })
            queryClient.invalidateQueries({ queryKey: ["client", data.id] })
        }
    })
}
