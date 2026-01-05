import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
    phase: string;
    progress: number;
    confidence: "on-track" | "at-risk" | "delayed";
    startDate: string;
    targetDate: string;
}

const confidenceStyles = {
    "on-track": {
        bar: "bg-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
        label: "On Track"
    },
    "at-risk": {
        bar: "bg-amber-500",
        bg: "bg-amber-50",
        text: "text-amber-700",
        label: "At Risk"
    },
    "delayed": {
        bar: "bg-red-500",
        bg: "bg-red-50",
        text: "text-red-700",
        label: "Delayed"
    }
};

export function ProgressIndicator({
    phase,
    progress,
    confidence,
    startDate,
    targetDate
}: ProgressIndicatorProps) {
    const styles = confidenceStyles[confidence];

    return (
        <div className="space-y-4">
            {/* Phase and Confidence */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{phase}</h3>
                    <p className="text-sm text-slate-500 mt-1">{startDate} → {targetDate}</p>
                </div>
                <div className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    styles.bg,
                    styles.text
                )}>
                    {styles.label}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-slate-900">{progress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500", styles.bar)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <p className="text-xs text-slate-500 mb-1">Completed</p>
                    <p className="text-sm font-semibold text-slate-900">8 milestones</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">In Progress</p>
                    <p className="text-sm font-semibold text-slate-900">3 milestones</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">Upcoming</p>
                    <p className="text-sm font-semibold text-slate-900">5 milestones</p>
                </div>
            </div>
        </div>
    );
}
