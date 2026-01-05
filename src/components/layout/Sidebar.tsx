"use client"

import * as React from "react"
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
    Target,
    Lightbulb,
    BrainCircuit,
    Database,
    Key,
    Bot,
    Gavel
} from "lucide-react"

const sidebarItems = [
    { title: "Overview", href: "/app", icon: LayoutDashboard },
    { title: "Targets", href: "/app/targets", icon: Target },
    { title: "Pipeline", href: "/app/pipeline", icon: KanbanSquare },
    { title: "Clients", href: "/app/clients", icon: Users },
    { title: "Ideas Hub", href: "/app/ideas", icon: Lightbulb },
    { title: "Credentials", href: "/app/credentials", icon: Key },
    { title: "Brainstorm", href: "/app/storm", icon: BrainCircuit },
    { title: "Decisions", href: "/app/decisions", icon: Gavel },
    { title: "Projects", href: "/app/projects", icon: FolderKanban },
    { title: "Tasks", href: "/app/tasks", icon: CheckSquare },
    { title: "Research", href: "/app/research", icon: FlaskConical },
    { title: "Notes", href: "/app/notes", icon: StickyNote },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0">
            {/* Logo/Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A0</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Agency OS</h1>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                                <span>{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t border-slate-100 space-y-1 bg-slate-50/50">
                <Link
                    href="/app/settings/notifications"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        pathname === "/app/settings/notifications" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    <Bot className="w-5 h-5" />
                    <span>Telegram Bot</span>
                </Link>
                <Link
                    href="/app/settings/data"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        pathname === "/app/settings/data" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    <Database className="w-5 h-5" />
                    <span>Data & Backup</span>
                </Link>
                <Link
                    href="/app/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        pathname === "/app/settings" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
                    )}
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>

                <div className="mt-4 px-3 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace</p>
                    <p className="text-[11px] font-semibold text-slate-600 mt-0.5">Agency Administration</p>
                </div>
            </div>
        </aside>
    )
}
