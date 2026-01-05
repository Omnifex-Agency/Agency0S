"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
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
    Bot,
    Gavel,
    BrainCircuit,
    Database,
    Key,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    { title: "Dashboard", href: "/app", icon: LayoutDashboard },
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
    { title: "Notifications", href: "/app/settings/notifications", icon: Bot },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <motion.div
            initial={{ width: 280 }}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            className={cn(
                "hidden lg:flex flex-col h-screen sticky top-0 z-50",
                "glass-sidebar text-slate-300 shadow-2xl"
            )}
        >
            {/* Header / Logo */}
            <div className={cn("flex h-20 items-center px-6 relative transition-all", isCollapsed ? "justify-center px-0" : "")}>
                <Link className="flex items-center gap-2 font-semibold" href="/app">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400 text-xl font-bold tracking-tight"
                        >
                            Agency OS
                        </motion.span>
                    )}
                </Link>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-8 bg-slate-800 border border-slate-700 text-slate-400 rounded-full p-1 hover:text-white hover:bg-slate-700 transition-colors shadow-md z-50"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar px-3 space-y-2">
                <div className="space-y-1">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-slate-800/50 text-white"
                                        : "hover:bg-slate-800/30 text-slate-400 hover:text-slate-100",
                                )}
                            >
                                {/* Active Indicator styling */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                                    />
                                )}

                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                                )} />

                                {!isCollapsed && (
                                    <span className="font-medium tracking-wide text-sm">{item.title}</span>
                                )}

                                {/* Hover Glow Effect (Subtle) */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-indigo-500/5 rounded-xl pointer-events-none" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Footer Items */}
            <div className="p-4 mt-auto border-t border-white/5 space-y-1">
                <Link
                    href="/app/settings/data"
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-slate-800/30 text-slate-400 hover:text-slate-100",
                        pathname === "/app/settings/data" ? "text-indigo-400" : ""
                    )}
                >
                    <Database className="h-5 w-5" />
                    {!isCollapsed && <span>Data & Backup</span>}
                </Link>
                <Link
                    href="/app/settings"
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-slate-800/30 text-slate-400 hover:text-slate-100",
                        pathname === "/app/settings" ? "text-indigo-400" : ""
                    )}
                >
                    <Settings className="h-5 w-5" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
            </div>
        </motion.div>
    )
}
