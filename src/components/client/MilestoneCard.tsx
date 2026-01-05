import { Calendar, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneCardProps {
    title: string;
    description: string;
    dueDate: string;
    daysRemaining: number;
    project: string;
    status: "upcoming" | "approaching" | "overdue";
}

const statusStyles = {
    upcoming: "border-slate-200 bg-white",
    approaching: "border-amber-200 bg-amber-50",
    overdue: "border-red-200 bg-red-50"
};

export function MilestoneCard({
    title,
    description,
    dueDate,
    daysRemaining,
    project,
    status
}: MilestoneCardProps) {
    return (
        <div className={cn(
            "rounded-lg border p-6 transition-all duration-200",
            statusStyles[status]
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm">
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{project}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{dueDate}</span>
                    <span className="text-slate-400">•</span>
                    <span className={cn(
                        "font-medium",
                        status === "overdue" ? "text-red-600" :
                            status === "approaching" ? "text-amber-600" :
                                "text-slate-600"
                    )}>
                        {daysRemaining} days remaining
                    </span>
                </div>
            </div>
        </div>
    );
}
