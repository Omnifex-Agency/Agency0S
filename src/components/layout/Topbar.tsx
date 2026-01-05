"use client"

import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher"
import { UserMenu } from "@/components/layout/UserMenu"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6 sticky top-0 z-40">
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
