import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    status: "on-track" | "at-risk" | "delayed" | "completed" | "in-progress";
    subtitle: string;
}

const statusStyles = {
    "on-track": "bg-green-50 text-green-700 border-green-200",
    "at-risk": "bg-amber-50 text-amber-700 border-amber-200",
    "delayed": "bg-red-50 text-red-700 border-red-200",
    "completed": "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-purple-50 text-purple-700 border-purple-200",
};

const statusDots = {
    "on-track": "bg-green-500",
    "at-risk": "bg-amber-500",
    "delayed": "bg-red-500",
    "completed": "bg-blue-500",
    "in-progress": "bg-purple-500",
};

export function StatusCard({ icon: Icon, label, value, status, subtitle }: StatusCardProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center border",
                    statusStyles[status]
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={cn("w-2 h-2 rounded-full", statusDots[status])}></div>
            </div>

            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="text-3xl font-semibold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
        </div>
    );
}
