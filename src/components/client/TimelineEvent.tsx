import { CheckCircle2, Package, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEventProps {
    type: "milestone" | "delivery" | "decision";
    title: string;
    description: string;
    project: string;
    date: string;
    status: "upcoming" | "completed" | "in-progress";
    isPast: boolean;
    isLast?: boolean;
}

const typeConfig = {
    milestone: {
        icon: CheckCircle2,
        color: "blue"
    },
    delivery: {
        icon: Package,
        color: "purple"
    },
    decision: {
        icon: Calendar,
        color: "amber"
    }
};

export function TimelineEvent({
    type,
    title,
    description,
    project,
    date,
    status,
    isPast,
    isLast = false
}: TimelineEventProps) {
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <div className="relative pl-12">
            {/* Timeline Dot */}
            <div className={cn(
                "absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white z-10",
                isPast
                    ? "bg-slate-100"
                    : status === "in-progress"
                        ? "bg-blue-100"
                        : "bg-white shadow-sm"
            )}>
                <Icon className={cn(
                    "w-5 h-5",
                    isPast
                        ? "text-slate-400"
                        : status === "in-progress"
                            ? "text-blue-600"
                            : `text-${config.color}-600`
                )} />
            </div>

            {/* Content Card */}
            <div className={cn(
                "rounded-lg border p-6 transition-all duration-200",
                isPast
                    ? "bg-white border-slate-200"
                    : "bg-white border-blue-200 shadow-sm hover:shadow-md"
            )}>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                                "text-base font-semibold",
                                isPast ? "text-slate-700" : "text-slate-900"
                            )}>
                                {title}
                            </h3>
                            {!isPast && status === "upcoming" && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                    Upcoming
                                </span>
                            )}
                        </div>
                        <p className={cn(
                            "text-sm leading-relaxed",
                            isPast ? "text-slate-500" : "text-slate-600"
                        )}>
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                        <span className={cn(
                            "font-medium",
                            isPast ? "text-slate-500" : "text-slate-700"
                        )}>
                            {project}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className={cn(
                            "w-4 h-4",
                            isPast ? "text-slate-400" : "text-slate-500"
                        )} />
                        <span className={cn(
                            isPast ? "text-slate-500" : "text-slate-600"
                        )}>
                            {date}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
