"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    KanbanSquare,
    FlaskConical,
    FolderKanban,
    CheckSquare,
    StickyNote,
    Settings,
    Menu,
    Target,
    Lightbulb,
    Bot,
    Gavel,
    BrainCircuit,
    Database
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/app",
        icon: LayoutDashboard,
    },
    {
        title: "Targets",
        href: "/app/targets",
        icon: Target,
    },
    {
        title: "Pipeline",
        href: "/app/pipeline",
        icon: KanbanSquare,
    },
    {
        title: "Clients",
        href: "/app/clients",
        icon: Users,
    },
    {
        title: "Ideas Hub",
        href: "/app/ideas",
        icon: Lightbulb,
    },
    {
        title: "Brainstorm",
        href: "/app/storm",
        icon: BrainCircuit,
    },
    {
        title: "Decisions",
        href: "/app/decisions",
        icon: Gavel,
    },
    {
        title: "Projects",
        href: "/app/projects",
        icon: FolderKanban,
    },
    {
        title: "Tasks",
        href: "/app/tasks",
        icon: CheckSquare,
    },
    {
        title: "Research", // Keeping this as general research documents
        href: "/app/research",
        icon: FlaskConical,
    },
    {
        title: "Notes",
        href: "/app/notes",
        icon: StickyNote,
    },
    {
        title: "Test Telegram",
        href: "/app/settings/notifications",
        icon: Bot,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block lg:w-64">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                    <Link className="flex items-center gap-2 font-semibold" href="/app">
                        <span className="">Agency OS</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {sidebarItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    pathname === item.href
                                        ? "bg-gray-100 text-primary dark:bg-gray-800"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4 space-y-1">
                    <Link
                        href="/app/settings/data"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground",
                            pathname === "/app/settings/data" ? "bg-gray-100 text-primary dark:bg-gray-800" : ""
                        )}
                    >
                        <Database className="h-4 w-4" />
                        Data & Backup
                    </Link>
                    <Link
                        href="/app/settings"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary text-muted-foreground",
                            pathname === "/app/settings" ? "bg-gray-100 text-primary dark:bg-gray-800" : ""
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
            </div>
        </div>
    )
}
