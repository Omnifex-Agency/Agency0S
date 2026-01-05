"use client";

import { CommunicationThread } from "@/components/client/CommunicationThread";
import { MessageSquare, Bell, Users } from "lucide-react";

const threads = [
    {
        id: "1",
        project: "Brand Platform Redesign",
        subject: "Design System Review Preparation",
        lastMessage: "We've finalized the component library documentation and it's ready for your review. The package includes usage guidelines, accessibility notes, and implementation examples.",
        lastMessageFrom: "Sarah Chen, Design Lead",
        lastMessageDate: "2 hours ago",
        messageType: "update" as const,
        unread: true,
        messageCount: 8
    },
    {
        id: "2",
        project: "Market Expansion Strategy",
        subject: "Strategic Brief Approval Required",
        lastMessage: "The strategic brief is complete and requires your sign-off before we proceed to the execution planning phase. Please review the attached document at your earliest convenience.",
        lastMessageFrom: "Michael Torres, Strategy Director",
        lastMessageDate: "1 day ago",
        messageType: "action-required" as const,
        unread: true,
        messageCount: 3
    },
    {
        id: "3",
        project: "Customer Portal Development",
        subject: "Backend Integration Progress",
        lastMessage: "Integration with your existing systems is progressing well. We've completed the authentication flow and are now working on the data synchronization layer.",
        lastMessageFrom: "Alex Kumar, Technical Lead",
        lastMessageDate: "2 days ago",
        messageType: "update" as const,
        unread: false,
        messageCount: 12
    }
];

export default function ClientCommunicationPage() {
    const unreadCount = threads.filter(t => t.unread).length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                        <h1 className="text-2xl font-semibold text-slate-900">Communication</h1>
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500">Project-linked conversations and updates</p>
                </div>
            </header>

            {/* Info Banner */}
            <div className="bg-blue-50 border-b border-blue-100">
                <div className="px-8 py-4">
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-900 font-medium">Structured Communication</p>
                            <p className="text-sm text-blue-700 mt-1">
                                All conversations are linked to specific projects and organized by context.
                                System updates and human messages are clearly separated for clarity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-8 max-w-5xl">
                <div className="space-y-4">
                    {threads.map((thread) => (
                        <CommunicationThread key={thread.id} {...thread} />
                    ))}
                </div>

                {/* Empty State */}
                {threads.length === 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-12">
                        <div className="text-center max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Messages</h3>
                            <p className="text-sm text-slate-600">
                                You'll see project updates and conversations here as they arrive.
                            </p>
                        </div>
                    </div>
                )}

                {/* Communication Guidelines */}
                <div className="mt-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 mb-2">Communication Approach</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                We maintain asynchronous, structured communication to respect your time.
                                Messages are contextual and actionable, with clear separation between system notifications
                                and team updates requiring your input.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                                    <p className="text-sm text-slate-600">Updates are batched and sent at logical intervals</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                                    <p className="text-sm text-slate-600">Action items are clearly flagged and prioritized</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                                    <p className="text-sm text-slate-600">All conversations are linked to specific projects</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
