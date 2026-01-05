import { CheckCircle2, Package, FileCheck, Lightbulb, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLogItemProps {
    type: "state-change" | "deliverable" | "approval" | "decision";
    title: string;
    description: string;
    project: string;
    timestamp: string;
    significance: "high" | "medium" | "low";
    isLast?: boolean;
}

const typeConfig = {
    "state-change": {
        icon: TrendingUp,
        color: "blue",
        bg: "bg-blue-50",
        text: "text-blue-600"
    },
    "deliverable": {
        icon: Package,
        color: "purple",
        bg: "bg-purple-50",
        text: "text-purple-600"
    },
    "approval": {
        icon: CheckCircle2,
        color: "green",
        bg: "bg-green-50",
        text: "text-green-600"
    },
    "decision": {
        icon: Lightbulb,
        color: "amber",
        bg: "bg-amber-50",
        text: "text-amber-600"
    }
};

export function ActivityLogItem({
    type,
    title,
    description,
    project,
    timestamp,
    significance,
    isLast = false
}: ActivityLogItemProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <div className="relative pl-12">
            {/* Timeline Dot */}
            <div className={cn(
                "absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10",
                config.bg
            )}>
                <Icon className={cn("w-5 h-5", config.text)} />
            </div>

            {/* Content Card */}
            <div className={cn(
                "rounded-lg border bg-white p-6 transition-all duration-200",
                significance === "high"
                    ? "border-slate-300 shadow-sm hover:shadow-md"
                    : "border-slate-200 hover:shadow-sm"
            )}>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className={cn(
                            "text-base font-semibold mb-1",
                            significance === "high" ? "text-slate-900" : "text-slate-800"
                        )}>
                            {title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-700">{project}</span>
                    <span className="text-xs text-slate-500">{timestamp}</span>
                </div>
            </div>
        </div>
    );
}
