"use client"

import { useDecisions } from "@/hooks/useIdeaStorm"
import { IdeaService } from "@/services/idea-services"
import { useQuery } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DecisionsPage() {
    // We need to fetch all decisions and potentially their linked ideas to show titles
    // Since our hooks are granular, let's fetch all ideas and decisions separate (or join in service)
    // For now, client-side join is fine for offline MVP
    const { data: decisions, isLoading } = useDecisions()
    const { data: ideas } = useQuery({ queryKey: ["ideas"], queryFn: () => IdeaService.list() })

    const decisionWithIdea = decisions?.map(d => ({
        ...d,
        idea: ideas?.find(i => i.id === d.idea_id)
    }))?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const stats = {
        approved: decisions?.filter(d => d.outcome === 'approved').length || 0,
        rejected: decisions?.filter(d => d.outcome === 'rejected').length || 0,
        deferred: decisions?.filter(d => d.outcome === 'deferred').length || 0
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
                    <p className="text-muted-foreground">Prioritization matrix and decision history.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Greenlit" count={stats.approved} icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
                <StatCard title="Killed" count={stats.rejected} icon={XCircle} color="text-red-600" bg="bg-red-50" />
                <StatCard title="On Hold" count={stats.deferred} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Decision Stream */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Recent Decisions</h2>
                    {isLoading ? <div>Loading...</div> : decisionWithIdea?.length === 0 ? (
                        <div className="p-8 border rounded text-center text-muted-foreground">No decisions logged.</div>
                    ) : (
                        <div className="space-y-4">
                            {decisionWithIdea?.map(item => (
                                <DecisionHistoryItem key={item.id} log={item} ideaTitle={item.idea?.title} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Pipeline Summary/Matrix */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Prioritization Radar</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Top Opportunities (RICE)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ideas?.filter(i => i.stage === 'exploring' || i.stage === 'validated')
                                .sort((a, b) => b.scores.rice.total - a.scores.rice.total)
                                .slice(0, 5)
                                .map(idea => (
                                    <div key={idea.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                        <div className="truncate max-w-[180px] font-medium">
                                            <Link href={`/app/ideas/${idea.id}`} className="hover:underline">
                                                {idea.title}
                                            </Link>
                                        </div>
                                        <Badge variant="secondary" className="font-mono">{idea.scores.rice.total}</Badge>
                                    </div>
                                ))
                            }
                            {(!ideas || ideas.length === 0) && <div className="text-xs text-muted-foreground">No ideas in pipeline.</div>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, count, icon: Icon, color, bg }: any) {
    return (
        <Card className="flex items-center p-4 gap-4">
            <div className={`p-3 rounded-full ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold">{count}</h3>
            </div>
        </Card>
    )
}

function DecisionHistoryItem({ log, ideaTitle }: any) {
    const outcomeColors: any = {
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        deferred: "bg-amber-100 text-amber-700",
        needs_data: "bg-blue-100 text-blue-700",
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={outcomeColors[log.outcome] || "bg-gray-100"}>
                            {log.outcome}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">
                            {ideaTitle || "Unknown Idea"}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {log.rationale}
                </p>
                <div className="mt-3 flex justify-end">
                    <Link href={`/app/ideas/${log.idea_id}`} className="text-xs flex items-center text-primary hover:underline">
                        View Context <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
