"use client"

import { useEffect, useState, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { WorkspaceContext } from "@/hooks/useWorkspace"
import { Database } from "@/types/database"
import { Loader2 } from "lucide-react"
import { setWorkspaceCookie } from "@/lib/workspace/actions"

type Workspace = Database["public"]["Tables"]["workspaces"]["Row"]

interface WorkspaceProviderProps {
    children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)

    // 1. Fetch User and Workspaces
    const { data: workspaces, isLoading } = useQuery({
        queryKey: ["my_workspaces"],
        queryFn: async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) throw new Error("Not authenticated")

            const { data: members, error: memberError } = await supabase
                .from("workspace_members")
                .select("workspace_id")
                .eq("user_id", user.id)

            if (memberError) throw memberError
            if (!members || members.length === 0) return []

            const workspaceIds = (members as any[]).map(m => m.workspace_id)

            const { data: workspacesData, error: wsError } = await supabase
                .from("workspaces")
                .select("*")
                .in("id", workspaceIds)
                .order("created_at")

            if (wsError) throw wsError
            return workspacesData as Workspace[]
        },
        retry: false,
    })

    // 2. Hydrate State
    useEffect(() => {
        if (workspaces && workspaces.length > 0) {
            // Check if we have an active ID already set (e.g. from cookie passed as prop, but here we do client side)
            // We can check document.cookie directly for faster initial paint if needed, or wait for state.
            // For now, simple client-side logic + cookie persistence.

            // Try to find cookie from JS (optional, for fast switching)
            const match = document.cookie.match(new RegExp('(^| )agency_os_workspace_id=([^;]+)'))
            const cookieId = match ? match[2] : null

            if (cookieId && workspaces.find(w => w.id === cookieId)) {
                setActiveWorkspaceId(cookieId)
            } else {
                // Default to first
                const first = workspaces[0]
                setActiveWorkspaceId(first.id)
                setWorkspaceCookie(first.id) // Ensure cookie is set
            }
        }
    }, [workspaces])

    const activeWorkspace = workspaces?.find(w => w.id === activeWorkspaceId) || null

    const setWorkspace = (workspace: Workspace) => {
        setActiveWorkspaceId(workspace.id)
        setWorkspaceCookie(workspace.id).catch(console.error)
    }

    const isInitializing = isLoading || (workspaces && workspaces.length > 0 && !activeWorkspaceId)

    return (
        <WorkspaceContext.Provider
            value={{
                workspace: activeWorkspace,
                workspaces: workspaces || [],
                isLoading: isLoading,
                setWorkspace,
            }}
        >
            {isInitializing ? (
                <div className="flex h-screen w-full items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading workspace...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </WorkspaceContext.Provider>
    )
}
