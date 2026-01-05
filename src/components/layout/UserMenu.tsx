"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/hooks/useUser"
import { User, Settings, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react"

export function UserMenu() {
    const router = useRouter()
    const supabase = createClient()
    const { email, fullName, avatarUrl, role, loading } = useUser()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push("/login")
    }

    const getInitials = () => {
        if (fullName) {
            return fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        if (email) {
            return email[0].toUpperCase()
        }
        return 'U'
    }

    if (loading) {
        return (
            <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border p-0 overflow-hidden hover:bg-muted transition-all">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={avatarUrl || undefined} alt={fullName || email || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{getInitials()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2 mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold leading-none text-foreground">{fullName || 'User'}</p>
                            {role === 'admin' && (
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary ring-1 ring-inset ring-primary/10">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email || 'No email'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-1 my-1 opacity-50" />
                <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem
                        onClick={() => router.push(role === 'admin' ? '/app' : '/client')}
                        className="cursor-pointer rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground/60" />
                        Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(role === 'admin' ? '/app/settings' : '/client')}
                        className="cursor-pointer rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                        <Settings className="mr-3 h-4 w-4 text-muted-foreground/60" />
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="mx-1 my-1 opacity-50" />
                <div className="p-1">
                    <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer rounded-lg px-3 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 transition-all font-medium"
                    >
                        <LogOut className="mr-3 h-4 w-4 text-destructive/60" />
                        Sign out
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
