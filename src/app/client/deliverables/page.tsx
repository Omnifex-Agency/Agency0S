"use client";

import { DeliverableCard } from "@/components/client/DeliverableCard";
import { FileCheck, Package, Clock, CheckCircle2 } from "lucide-react";

const deliverables = {
    delivered: [
        {
            id: "1",
            title: "Brand Guidelines Package v1.0",
            purpose: "Establish consistent brand identity across all touchpoints",
            outcome: "Enables internal teams and partners to maintain brand consistency",
            project: "Brand Platform Redesign",
            deliveredDate: "Dec 20, 2025",
            type: "documentation" as const
        },
        {
            id: "2",
            title: "Customer Portal Wireframes",
            purpose: "Define user experience and information architecture",
            outcome: "Provides development team with clear implementation blueprint",
            project: "Customer Portal Development",
            deliveredDate: "Jan 3, 2026",
            type: "design" as const
        }
    ],
    underReview: [
        {
            id: "3",
            title: "Market Analysis Report",
            purpose: "Comprehensive analysis of target markets and competitive landscape",
            outcome: "Informs strategic decisions for market entry approach",
            project: "Market Expansion Strategy",
            reviewStarted: "Jan 4, 2026",
            type: "strategy" as const
        }
    ],
    upcoming: [
        {
            id: "4",
            title: "Design System Documentation",
            purpose: "Complete component library with usage guidelines",
            outcome: "Enables scalable, consistent product development",
            project: "Brand Platform Redesign",
            expectedDate: "Jan 18, 2026",
            type: "documentation" as const
        },
        {
            id: "5",
            title: "Go-to-Market Strategy",
            purpose: "Detailed execution plan for market expansion",
            outcome: "Provides actionable roadmap for regional launch",
            project: "Market Expansion Strategy",
            expectedDate: "Jan 28, 2026",
            type: "strategy" as const
        }
    ]
};

export default function ClientDeliverablesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FileCheck className="w-6 h-6 text-slate-400" />
                        <h1 className="text-2xl font-semibold text-slate-900">Deliverables</h1>
                    </div>
                    <p className="text-sm text-slate-500">Outcomes and artifacts organized by purpose and impact</p>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-8 py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-slate-600">{deliverables.delivered.length} Delivered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-sm text-slate-600">{deliverables.underReview.length} Under Review</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-slate-600">{deliverables.upcoming.length} Upcoming</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-8 space-y-12">
                {/* Under Review Section */}
                {deliverables.underReview.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Under Review</h2>
                                <p className="text-sm text-slate-500">Awaiting your feedback or approval</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {deliverables.underReview.map((deliverable) => (
                                <DeliverableCard key={deliverable.id} {...deliverable} status="review" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
                            <p className="text-sm text-slate-500">Scheduled for delivery</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {deliverables.upcoming.map((deliverable) => (
                            <DeliverableCard key={deliverable.id} {...deliverable} status="upcoming" />
                        ))}
                    </div>
                </section>

                {/* Delivered Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Delivered</h2>
                            <p className="text-sm text-slate-500">Completed and approved</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {deliverables.delivered.map((deliverable) => (
                            <DeliverableCard key={deliverable.id} {...deliverable} status="delivered" />
                        ))}
                    </div>
                </section>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-8">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Deliverable Framework</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Each deliverable is framed by its purpose and the outcome it enables, not just as a file or artifact.
                        This view helps you understand what you're receiving and why it matters to your business objectives.
                    </p>
                </div>
            </div>
        </div>
    );
}
