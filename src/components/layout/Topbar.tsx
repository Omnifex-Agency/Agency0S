"use client"

import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher"
import { UserMenu } from "@/components/layout/UserMenu"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar() {
    return (
<<<<<<< HEAD
        <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md px-6 sticky top-0 z-40 transition-all">
=======
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
>>>>>>> cbd75e5 (feat: enhance auth UI with light theme, role-based setup, and UI component fixes)
            <Button className="lg:hidden" variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <div className="w-full flex-1">
                <WorkspaceSwitcher />
            </div>
            <UserMenu />
        </header>
    )
}
