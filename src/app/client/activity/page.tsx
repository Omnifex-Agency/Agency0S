"use client";

import { ActivityLogItem } from "@/components/client/ActivityLogItem";
import { Shield, CheckCircle2, TrendingUp } from "lucide-react";

const activities = [
    {
        id: "1",
        type: "state-change" as const,
        title: "Project Phase Transition",
        description: "Customer Portal Development moved from Discovery to Build phase",
        project: "Customer Portal Development",
        timestamp: "Today at 9:30 AM",
        significance: "high" as const
    },
    {
        id: "2",
        type: "deliverable" as const,
        title: "Deliverable Released",
        description: "Customer Portal Wireframes package delivered and available for review",
        project: "Customer Portal Development",
        timestamp: "Jan 3, 2026",
        significance: "high" as const
    },
    {
        id: "3",
        type: "approval" as const,
        title: "Milestone Approved",
        description: "Brand Guidelines v1.0 approved by stakeholder team",
        project: "Brand Platform Redesign",
        timestamp: "Dec 28, 2025",
        significance: "high" as const
    },
    {
        id: "4",
        type: "decision" as const,
        title: "Strategic Decision",
        description: "Market prioritization framework finalized: focusing on Northeast and Southwest regions first",
        project: "Market Expansion Strategy",
        timestamp: "Dec 22, 2025",
        significance: "high" as const
    },
    {
        id: "5",
        type: "state-change" as const,
        title: "Phase Progress Update",
        description: "Brand Platform Redesign Build phase reached 68% completion",
        project: "Brand Platform Redesign",
        timestamp: "Dec 20, 2025",
        significance: "medium" as const
    },
    {
        id: "6",
        type: "deliverable" as const,
        title: "Deliverable Released",
        description: "Brand Guidelines Package v1.0 delivered with complete brand identity system",
        project: "Brand Platform Redesign",
        timestamp: "Dec 20, 2025",
        significance: "high" as const
    }
];

export default function ClientActivityPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-slate-400" />
                        <h1 className="text-2xl font-semibold text-slate-900">Trust & Activity</h1>
                    </div>
                    <p className="text-sm text-slate-500">Transparent audit trail of significant events and decisions</p>
                </div>
            </header>

            {/* Trust Indicators */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">System Health</p>
                                <p className="text-xs text-slate-500 mt-1">All engagements operational</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Momentum</p>
                                <p className="text-xs text-slate-500 mt-1">Consistent forward progress</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Transparency</p>
                                <p className="text-xs text-slate-500 mt-1">Full visibility maintained</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Log */}
            <div className="px-8 py-8 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Activity Log</h2>
                    <p className="text-sm text-slate-500">
                        Significant state changes, deliverables, approvals, and decisions across all projects
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200"></div>

                    <div className="space-y-6">
                        {activities.map((activity, index) => (
                            <ActivityLogItem
                                key={activity.id}
                                {...activity}
                                isLast={index === activities.length - 1}
                            />
                        ))}
                    </div>
                </div>

                {/* Trust Statement */}
                <div className="mt-12 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100 p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">Transparency Without Surveillance</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                This activity log provides visibility into meaningful progress and decisions without
                                overwhelming you with technical details or internal processes. Every entry represents
                                a significant event that impacts your engagement.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                                    <p className="text-sm text-slate-600">Only significant events are logged</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                                    <p className="text-sm text-slate-600">Clear context for every activity</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                                    <p className="text-sm text-slate-600">Auditable trail of decisions and approvals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
