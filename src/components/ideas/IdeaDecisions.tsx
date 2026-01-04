"use client"

import { useState } from "react"
import { DecisionLog, Idea, DecisionOutcome } from "@/types/idea-storm"
import { useDecisions, useLogDecision, useUpdateIdea } from "@/hooks/useIdeaStorm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, XCircle, Clock, Gavel } from "lucide-react"

export function IdeaDecisions({ idea }: { idea: Idea }) {
    const { data: decisions, isLoading } = useDecisions(idea.id)

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg border">
                <div>
                    <h3 className="text-lg font-medium">Decision Log</h3>
                    <p className="text-sm text-muted-foreground">Formal history of Go/No-Go decisions.</p>
                </div>
                <LogDecisionModal idea={idea} />
            </div>

            {isLoading ? <div>Loading...</div> : decisions?.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
                    <Gavel className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    No decisions logged yet. Is it time to build?
                </div>
            ) : (
                <div className="space-y-4">
                    {decisions?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(d => (
                        <DecisionCard key={d.id} log={d} />
                    ))}
                </div>
            )}
        </div>
    )
}

function DecisionCard({ log }: { log: DecisionLog }) {
    const outcomeConfig: Record<DecisionOutcome, { color: string, icon: any }> = {
        approved: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
        rejected: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
        deferred: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
        needs_data: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle },
    }
    const config = outcomeConfig[log.outcome]
    const Icon = config.icon

    return (
        <Card>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                    <Badge variant="outline" className={`flex items-center gap-1.5 px-2 py-1 ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {log.outcome.toUpperCase().replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="text-sm whitespace-pre-wrap">{log.rationale}</p>
                {log.snapshot?.stage && (
                    <div className="mt-3 text-xs text-muted-foreground flex gap-3">
                        <span>Snapshot: <strong>{log.snapshot.stage}</strong></span>
                        {log.snapshot.rice_score && <span>RICE: <strong>{log.snapshot.rice_score}</strong></span>}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function LogDecisionModal({ idea }: { idea: Idea }) {
    const [open, setOpen] = useState(false)
    const logDecision = useLogDecision()
    const updateIdea = useUpdateIdea()

    const [outcome, setOutcome] = useState<DecisionOutcome>('needs_data')
    const [rationale, setRationale] = useState("")

    const handleSubmit = async () => {
        await logDecision.mutateAsync({
            idea_id: idea.id,
            outcome,
            rationale,
            snapshot: {
                stage: idea.stage,
                rice_score: idea.scores.rice.total,
                ice_score: idea.scores.ice.total
            }
        })

        // Auto-move stage based on decision?
        if (outcome === 'approved' && idea.stage !== 'building') {
            updateIdea.mutate({ id: idea.id, updates: { stage: 'building' } })
        } else if (outcome === 'rejected') {
            updateIdea.mutate({ id: idea.id, updates: { stage: 'archived' } })
        }

        setOpen(false)
        setRationale("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Gavel className="mr-2 h-4 w-4" /> Log Decision
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Log Formal Decision</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Outcome</label>
                        <Select value={outcome} onValueChange={(v: any) => setOutcome(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="approved">Approved (Move to Build)</SelectItem>
                                <SelectItem value="rejected">Rejected (Archive)</SelectItem>
                                <SelectItem value="deferred">Deferred (Backlog)</SelectItem>
                                <SelectItem value="needs_data">Needs More Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rationale</label>
                        <Textarea
                            placeholder="Why was this decision made? Reference research or scores."
                            value={rationale}
                            onChange={e => setRationale(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <Button className="w-full" onClick={handleSubmit} disabled={logDecision.isPending}>
                        Commit Decision
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
