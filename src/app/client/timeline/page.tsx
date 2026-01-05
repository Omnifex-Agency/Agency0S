"use client";

import { TimelineEvent } from "@/components/client/TimelineEvent";
import { Clock, CheckCircle2 } from "lucide-react";

const timelineEvents = [
    {
        id: "1",
        type: "milestone" as const,
        title: "Design System Review",
        description: "Complete design system documentation ready for stakeholder approval",
        project: "Brand Platform Redesign",
        date: "Jan 18, 2026",
        status: "upcoming" as const,
        isPast: false
    },
    {
        id: "2",
        type: "milestone" as const,
        title: "Strategy Presentation",
        description: "Present market expansion strategy and recommendations to executive team",
        project: "Market Expansion Strategy",
        date: "Jan 15, 2026",
        status: "upcoming" as const,
        isPast: false
    },
    {
        id: "3",
        type: "delivery" as const,
        title: "Wireframe Package Delivered",
        description: "Complete set of wireframes for customer portal delivered and approved",
        project: "Customer Portal Development",
        date: "Jan 3, 2026",
        status: "completed" as const,
        isPast: true
    },
    {
        id: "4",
        type: "milestone" as const,
        title: "Discovery Phase Complete",
        description: "Research synthesis and strategic brief finalized",
        project: "Market Expansion Strategy",
        date: "Dec 28, 2025",
        status: "completed" as const,
        isPast: true
    },
    {
        id: "5",
        type: "delivery" as const,
        title: "Brand Guidelines v1.0",
        description: "Initial brand guidelines package delivered including logo system and color palette",
        project: "Brand Platform Redesign",
        date: "Dec 20, 2025",
        status: "completed" as const,
        isPast: true
    },
    {
        id: "6",
        type: "milestone" as const,
        title: "Project Kickoff",
        description: "All three projects initiated with stakeholder alignment sessions",
        project: "All Projects",
        date: "Dec 8, 2025",
        status: "completed" as const,
        isPast: true
    }
];

export default function ClientTimelinePage() {
    const upcomingEvents = timelineEvents.filter(e => !e.isPast);
    const pastEvents = timelineEvents.filter(e => e.isPast);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-slate-400" />
                        <h1 className="text-2xl font-semibold text-slate-900">Timeline</h1>
                    </div>
                    <p className="text-sm text-slate-500">Milestone progression and engagement continuity</p>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-8 py-8 max-w-4xl">
                {/* Upcoming Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
                            <p className="text-sm text-slate-500">{upcomingEvents.length} milestone{upcomingEvents.length !== 1 ? 's' : ''} ahead</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-blue-200"></div>

                        <div className="space-y-6">
                            {upcomingEvents.map((event, index) => (
                                <TimelineEvent
                                    key={event.id}
                                    {...event}
                                    isLast={index === upcomingEvents.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Past Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Completed</h2>
                            <p className="text-sm text-slate-500">{pastEvents.length} milestone{pastEvents.length !== 1 ? 's' : ''} achieved</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200"></div>

                        <div className="space-y-6">
                            {pastEvents.map((event, index) => (
                                <TimelineEvent
                                    key={event.id}
                                    {...event}
                                    isLast={index === pastEvents.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-8">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Timeline View</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        This timeline emphasizes milestone progression and engagement continuity.
                        Dates represent target completion, not strict deadlines. The focus is on forward momentum
                        and maintaining visibility into what's been accomplished and what's ahead.
                    </p>
                </div>
            </div>
        </div>
    );
}
