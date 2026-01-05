"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Clock,
    FileCheck,
    MessageSquare,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Overview", href: "/client", icon: LayoutDashboard },
    { name: "Projects", href: "/client/projects", icon: FolderKanban },
    { name: "Timeline", href: "/client/timeline", icon: Clock },
    { name: "Deliverables", href: "/client/deliverables", icon: FileCheck },
    { name: "Communication", href: "/client/communication", icon: MessageSquare },
    { name: "Trust & Activity", href: "/client/activity", icon: Shield },
];

export function ClientSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-background border-r border-border flex flex-col">
            {/* Logo/Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <h1 className="text-xl font-semibold text-foreground">Agency Portal</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <div className="px-4 py-3 bg-muted rounded-lg">
                    <p className="text-xs font-medium text-foreground">Client Portal</p>
                    <p className="text-xs text-muted-foreground mt-1">View-only access</p>
                </div>
            </div>
        </aside>
    );
}
