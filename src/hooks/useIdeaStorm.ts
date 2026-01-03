"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IdeaService, ResearchService, DecisionService, SessionService } from "@/services/idea-services"
import { Idea, IdeaStage, BrainstormNote } from "@/types/idea-storm"

// --- IDEAS ---

export function useIdeas(stage?: IdeaStage) {
    return useQuery({
        queryKey: ["ideas", stage],
        queryFn: () => IdeaService.list(stage),
    })
}

export function useIdea(id: string) {
    return useQuery({
        queryKey: ["idea", id],
        queryFn: () => IdeaService.get(id),
        enabled: !!id
    })
}

export function useCreateIdea() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: IdeaService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] })
        }
    })
}

export function useUpdateIdea() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Idea> }) => IdeaService.update(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["ideas"] })
            queryClient.invalidateQueries({ queryKey: ["idea", data.id] })
        }
    })
}

// --- RESEARCH ---

export function useResearch() {
    return useQuery({
        queryKey: ["research"],
        queryFn: () => ResearchService.list()
    })
}

export function useCreateResearch() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ResearchService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["research"] })
        }
    })
}
// --- DECISIONS ---

export function useDecisions(ideaId?: string) {
    return useQuery({
        queryKey: ["decisions", ideaId],
        queryFn: () => DecisionService.list(ideaId)
    })
}

export function useLogDecision() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: DecisionService.log,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["decisions"] })
            queryClient.invalidateQueries({ queryKey: ["idea", data.idea_id] }) // Might update status
        }
    })
}

// --- BRAINSTORM ---

export function useSessions() {
    return useQuery({
        queryKey: ["sessions"],
        queryFn: () => SessionService.list()
    })
}

export function useSession(id: string) {
    return useQuery({
        queryKey: ["session", id],
        queryFn: () => SessionService.get(id),
        enabled: !!id
    })
}

export function useCreateSession() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: SessionService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] })
        }
    })
}

export function useSessionNotes(sessionId: string) {
    return useQuery({
        queryKey: ["session_notes", sessionId],
        queryFn: () => SessionService.listNotes(sessionId),
        enabled: !!sessionId
    })
}

export function useAddNote() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ sessionId, content, color }: { sessionId: string, content: string, color?: string }) => SessionService.addNote(sessionId, content, color),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["session_notes", data.session_id] })
        }
    })
}

export function useUpdateNote() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<BrainstormNote> }) => SessionService.updateNote(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["session_notes", data.session_id] })
        }
    })
}

export function useDeleteNote() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: SessionService.deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["session_notes"] })
        }
    })
}
