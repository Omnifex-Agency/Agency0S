"use client"

import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher"
import { UserMenu } from "@/components/layout/UserMenu"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar() {
    return (
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
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
