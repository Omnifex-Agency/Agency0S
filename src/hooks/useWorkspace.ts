"use client"

import { useContext, createContext } from "react"
import { Database } from "@/types/database"

type Workspace = Database["public"]["Tables"]["workspaces"]["Row"]

export interface WorkspaceContextType {
    workspace: Workspace | null
    workspaces: Workspace[]
    isLoading: boolean
    setWorkspace: (workspace: Workspace) => void
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider")
    }
    return context
}
