import { FileText, Lightbulb, Layout, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliverableCardProps {
    title: string;
    purpose: string;
    outcome: string;
    project: string;
    type: "documentation" | "design" | "strategy" | "development";
    status: "delivered" | "review" | "upcoming";
    deliveredDate?: string;
    reviewStarted?: string;
    expectedDate?: string;
}

const typeConfig = {
    documentation: {
        icon: FileText,
        color: "blue",
        label: "Documentation"
    },
    design: {
        icon: Layout,
        color: "purple",
        label: "Design"
    },
    strategy: {
        icon: Lightbulb,
        color: "amber",
        label: "Strategy"
    },
    development: {
        icon: Calendar,
        color: "green",
        label: "Development"
    }
};

const statusStyles = {
    delivered: "border-slate-200 bg-white",
    review: "border-amber-200 bg-amber-50",
    upcoming: "border-blue-200 bg-blue-50"
};

export function DeliverableCard({
    title,
    purpose,
    outcome,
    project,
    type,
    status,
    deliveredDate,
    reviewStarted,
    expectedDate
}: DeliverableCardProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <div className={cn(
            "rounded-xl border p-8 transition-all duration-200 hover:shadow-md",
            statusStyles[status]
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            `bg-${config.color}-100`
                        )}>
                            <Icon className={cn("w-5 h-5", `text-${config.color}-600`)} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                            <p className="text-xs text-slate-500">{config.label}</p>
                        </div>
                    </div>
                </div>

                {status === "review" && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                        Review Required
                    </span>
                )}
                {status === "delivered" && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Delivered
                    </span>
                )}
            </div>

            {/* Purpose & Outcome */}
            <div className="space-y-4 mb-6">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Purpose</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{purpose}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Outcome</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{outcome}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-sm font-medium text-slate-700">{project}</span>
                <div className="text-sm text-slate-500">
                    {deliveredDate && <span>Delivered {deliveredDate}</span>}
                    {reviewStarted && <span>Review started {reviewStarted}</span>}
                    {expectedDate && <span>Expected {expectedDate}</span>}
                </div>
            </div>
        </div>
    );
}
