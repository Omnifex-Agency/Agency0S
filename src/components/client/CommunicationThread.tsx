import { MessageSquare, AlertCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommunicationThreadProps {
    project: string;
    subject: string;
    lastMessage: string;
    lastMessageFrom: string;
    lastMessageDate: string;
    messageType: "update" | "action-required" | "system";
    unread: boolean;
    messageCount: number;
}

const typeConfig = {
    "action-required": {
        icon: AlertCircle,
        color: "amber",
        label: "Action Required"
    },
    "update": {
        icon: MessageSquare,
        color: "blue",
        label: "Update"
    },
    "system": {
        icon: Bell,
        color: "slate",
        label: "System"
    }
};

export function CommunicationThread({
    project,
    subject,
    lastMessage,
    lastMessageFrom,
    lastMessageDate,
    messageType,
    unread,
    messageCount
}: CommunicationThreadProps) {
    const config = typeConfig[messageType];
    const Icon = config.icon;

    return (
        <div className={cn(
            "bg-white rounded-xl border p-6 transition-all duration-200 hover:shadow-md cursor-pointer",
            unread ? "border-blue-200 shadow-sm" : "border-slate-200"
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        `bg-${config.color}-50`
                    )}>
                        <Icon className={cn("w-5 h-5", `text-${config.color}-600`)} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn(
                                "text-base font-semibold truncate",
                                unread ? "text-slate-900" : "text-slate-700"
                            )}>
                                {subject}
                            </h3>
                            {unread && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">{project}</p>
                    </div>
                </div>

                {messageType === "action-required" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                        {config.label}
                    </span>
                )}
            </div>

            {/* Message Preview */}
            <div className="mb-4">
                <p className={cn(
                    "text-sm leading-relaxed line-clamp-2",
                    unread ? "text-slate-700" : "text-slate-600"
                )}>
                    {lastMessage}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{lastMessageFrom}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm text-slate-500">{lastMessageDate}</span>
                </div>
                <span className="text-xs text-slate-500">
                    {messageCount} message{messageCount !== 1 ? 's' : ''}
                </span>
            </div>
        </div>
    );
}
