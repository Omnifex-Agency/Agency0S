import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectStateCardProps {
    name: string;
    currentState: string;
    confidence: "on-track" | "at-risk" | "delayed";
    lastActivity: string;
    lastActivityDate: string;
    nextTransition: string;
    nextTransitionDate: string;
    progress: number;
    description: string;
}

const confidenceStyles = {
    "on-track": {
        badge: "bg-green-50 text-green-700 border-green-200",
        dot: "bg-green-500",
        bar: "bg-green-500"
    },
    "at-risk": {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        bar: "bg-amber-500"
    },
    "delayed": {
        badge: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
        bar: "bg-red-500"
    }
};

const confidenceLabels = {
    "on-track": "On Track",
    "at-risk": "At Risk",
    "delayed": "Delayed"
};

export function ProjectStateCard({
    name,
    currentState,
    confidence,
    lastActivity,
    lastActivityDate,
    nextTransition,
    nextTransitionDate,
    progress,
    description
}: ProjectStateCardProps) {
    const styles = confidenceStyles[confidence];

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">{name}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
                <div className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2",
                    styles.badge
                )}>
                    <div className={cn("w-2 h-2 rounded-full", styles.dot)}></div>
                    {confidenceLabels[confidence]}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Overall Progress</span>
                    <span className="font-semibold text-slate-900">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500", styles.bar)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* State Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-100">
                <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">CURRENT STATE</p>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-slate-900">{currentState}</p>
                            <p className="text-xs text-slate-500">Active phase</p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">NEXT TRANSITION</p>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-slate-900">{nextTransition}</p>
                            <p className="text-xs text-slate-500">{nextTransitionDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">{lastActivity}</p>
                    <p className="text-xs text-slate-500 mt-1">{lastActivityDate}</p>
                </div>
            </div>
        </div>
    );
}
