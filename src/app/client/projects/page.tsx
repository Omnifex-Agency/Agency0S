"use client";

import { ProjectStateCard } from "@/components/client/ProjectStateCard";
import { FolderKanban } from "lucide-react";

const projects = [
    {
        id: "1",
        name: "Brand Platform Redesign",
        currentState: "Build",
        confidence: "on-track" as const,
        lastActivity: "Design system components finalized",
        lastActivityDate: "2 hours ago",
        nextTransition: "Review Phase",
        nextTransitionDate: "Jan 22, 2026",
        progress: 68,
        description: "Complete redesign of digital brand presence including website, design system, and brand guidelines"
    },
    {
        id: "2",
        name: "Market Expansion Strategy",
        currentState: "Discovery",
        confidence: "on-track" as const,
        lastActivity: "Competitive analysis completed",
        lastActivityDate: "1 day ago",
        nextTransition: "Strategy Development",
        nextTransitionDate: "Jan 15, 2026",
        progress: 42,
        description: "Strategic framework for entering three new regional markets with go-to-market recommendations"
    },
    {
        id: "3",
        name: "Customer Portal Development",
        currentState: "Build",
        confidence: "at-risk" as const,
        lastActivity: "Backend integration in progress",
        lastActivityDate: "5 hours ago",
        nextTransition: "Testing Phase",
        nextTransitionDate: "Feb 5, 2026",
        progress: 55,
        description: "Self-service customer portal with account management, billing, and support ticket functionality"
    }
];

export default function ClientProjectsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FolderKanban className="w-6 h-6 text-slate-400" />
                        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
                    </div>
                    <p className="text-sm text-slate-500">Current state and progress across all active engagements</p>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-8 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-slate-600">2 On Track</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-sm text-slate-600">1 At Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <span className="text-sm text-slate-600">0 Delayed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="px-8 py-8">
                <div className="space-y-6">
                    {projects.map((project) => (
                        <ProjectStateCard key={project.id} {...project} />
                    ))}
                </div>

                {/* Empty State Message */}
                <div className="mt-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                            <FolderKanban className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Project View</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Projects are presented as state machines showing current phase, confidence level,
                            and upcoming transitions. You can view progress but cannot modify workflows or internal processes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
