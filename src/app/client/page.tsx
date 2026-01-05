"use client";

import { StatusCard } from "@/components/client/StatusCard";
import { ProgressIndicator } from "@/components/client/ProgressIndicator";
import { MilestoneCard } from "@/components/client/MilestoneCard";
import { AttentionCard } from "@/components/client/AttentionCard";
import { FolderKanban, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function ClientOverviewPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">System status and engagement summary</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-8 py-8 space-y-8">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatusCard
                        icon={FolderKanban}
                        label="Active Projects"
                        value="3"
                        status="on-track"
                        subtitle="All progressing as planned"
                    />
                    <StatusCard
                        icon={TrendingUp}
                        label="Current Phase"
                        value="Build"
                        status="in-progress"
                        subtitle="Week 4 of 8"
                    />
                    <StatusCard
                        icon={CheckCircle2}
                        label="Completed Milestones"
                        value="12"
                        status="completed"
                        subtitle="8 pending review"
                    />
                </div>

                {/* Current Phase Progress */}
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Current Phase Progress</h2>
                        <p className="text-sm text-slate-500 mt-1">Build phase across all active engagements</p>
                    </div>

                    <ProgressIndicator
                        phase="Build"
                        progress={52}
                        confidence="on-track"
                        startDate="Dec 8, 2025"
                        targetDate="Feb 2, 2026"
                    />
                </div>

                {/* Next Milestone */}
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Next Milestone</h2>
                        <p className="text-sm text-slate-500 mt-1">Upcoming deliverable requiring your attention</p>
                    </div>

                    <MilestoneCard
                        title="Design System Review"
                        description="Complete design system documentation and component library ready for stakeholder approval"
                        dueDate="Jan 18, 2026"
                        daysRemaining={13}
                        project="Brand Platform Redesign"
                        status="approaching"
                    />
                </div>

                {/* Attention Required - Only shown when applicable */}
                <AttentionCard
                    items={[
                        {
                            id: "1",
                            type: "approval",
                            title: "Strategic Brief Approval",
                            description: "Final strategic brief requires your sign-off to proceed to execution phase",
                            project: "Market Expansion Strategy",
                            dueDate: "Jan 10, 2026",
                            priority: "high"
                        }
                    ]}
                />

                {/* System Health Indicator */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-blue-100 p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">All Systems Operational</h3>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                Your engagement is progressing as planned. All active projects are on track,
                                deliverables are being completed on schedule, and no critical issues require immediate attention.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>Last updated: Today at 2:15 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
