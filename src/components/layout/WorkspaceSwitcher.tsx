"use client"

import * as React from "react"
import { ChevronsUpDown, Check, PlusCircle, Building } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWorkspace } from "@/hooks/useWorkspace"

export function WorkspaceSwitcher() {
    const { workspace, workspaces, setWorkspace } = useWorkspace()

    if (!workspace) {
        return <Button variant="outline" className="w-[200px]" disabled>No Workspace</Button>
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-[200px] justify-between")}
                >
                    <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                            src={`https://avatar.vercel.sh/${workspace.id}.png`}
                            alt={workspace.name}
                        />
                        <AvatarFallback>{workspace.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{workspace.name}</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>My Workspaces</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {workspaces.map((ws) => (
                        <DropdownMenuItem
                            key={ws.id}
                            onSelect={() => setWorkspace(ws)}
                            className="text-sm cursor-pointer"
                        >
                            <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage
                                    src={`https://avatar.vercel.sh/${ws.id}.png`}
                                    alt={ws.name}
                                />
                                <AvatarFallback>{ws.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="truncate">{ws.name}</span>
                            <Check
                                className={cn(
                                    "ml-auto h-4 w-4",
                                    workspace.id === ws.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                )}
                            />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                    <PlusCircle className="h-4 w-4" />
                    Create Workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
