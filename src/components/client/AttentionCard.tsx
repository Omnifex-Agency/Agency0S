import { AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttentionItem {
    id: string;
    type: "approval" | "feedback" | "review";
    title: string;
    description: string;
    project: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
}

interface AttentionCardProps {
    items: AttentionItem[];
}

const priorityStyles = {
    high: "border-red-200 bg-red-50",
    medium: "border-amber-200 bg-amber-50",
    low: "border-blue-200 bg-blue-50"
};

const priorityIcons = {
    high: AlertCircle,
    medium: AlertCircle,
    low: FileText
};

const priorityColors = {
    high: "text-red-600",
    medium: "text-amber-600",
    low: "text-blue-600"
};

export function AttentionCard({ items }: AttentionCardProps) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Attention Required</h2>
                        <p className="text-sm text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''} requiring your input</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const Icon = priorityIcons[item.priority];

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "rounded-lg border p-5 transition-all duration-200 hover:shadow-sm",
                                priorityStyles[item.priority]
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", priorityColors[item.priority])} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                                            Due {item.dueDate}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Project:</span>
                                        <span className="text-xs font-medium text-slate-700">{item.project}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
