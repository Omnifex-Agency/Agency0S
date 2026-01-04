"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { MOCK_SESSIONS } from "@/lib/mock-data"

const getSessionsFromStorage = () => {
    if (typeof window === "undefined") return MOCK_SESSIONS
    const stored = localStorage.getItem("agency_os_onboarding")
    if (stored) return JSON.parse(stored)
    localStorage.setItem("agency_os_onboarding", JSON.stringify(MOCK_SESSIONS))
    return MOCK_SESSIONS
}

export function useOnboarding(clientId: string) {
    return useQuery({
        queryKey: ["onboarding", clientId],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 600))
            const allSessions = getSessionsFromStorage()
            const data = allSessions[clientId]

            if (!data) {
                // Auto-seed empty for this client if missing in mock
                const newSession = {
                    session: {
                        id: `s-${clientId}`,
                        client_id: clientId,
                        status: "not_started",
                        completion_percentage: 0
                    },
                    sections: [
                        { section_key: "basic_info", status: "draft", data: {} },
                        { section_key: "requirements", status: "draft", data: {} },
                        { section_key: "assets", status: "draft", data: {} },
                        { section_key: "access", status: "draft", data: {} },
                        { section_key: "billing", status: "draft", data: {} }
                    ]
                }
                allSessions[clientId] = newSession
                localStorage.setItem("agency_os_onboarding", JSON.stringify(allSessions))
                return newSession
            }
            return data
        },
        enabled: !!clientId
    })
}

export function useUpdateSection(clientId: string, sectionKey: string) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (payload: { status: string, data: any }) => {
            await new Promise(r => setTimeout(r, 500))
            const all = getSessionsFromStorage()
            const clientData = all[clientId]
            if (!clientData) throw new Error("Session not found")

            // Update section
            clientData.sections = clientData.sections.map((s: any) =>
                s.section_key === sectionKey
                    ? { ...s, status: payload.status, data: payload.data }
                    : s
            )

            // Recalc Progress
            const done = clientData.sections.filter((s: any) => s.status === 'done').length
            const total = clientData.sections.length
            const pct = Math.round((done / total) * 100)

            clientData.session.completion_percentage = pct
            if (pct > 0 && pct < 100) clientData.session.status = 'incomplete'
            if (pct === 100) clientData.session.status = 'submitted'
            if (pct === 0) clientData.session.status = 'not_started'

            localStorage.setItem("agency_os_onboarding", JSON.stringify(all))
            return clientData
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["onboarding", clientId] })
            queryClient.invalidateQueries({ queryKey: ["clients"] }) // to update list progress if we show it
            toast({ title: "Saved", description: "Section updated locally." })
        }
    })
}
