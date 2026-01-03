"use client"

import { useState } from "react"
import { Idea, ResearchEntry } from "@/types/idea-storm"
import { useResearch, useCreateResearch, useUpdateIdea } from "@/hooks/useIdeaStorm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Link2, Plus, ExternalLink, Quote } from "lucide-react"

export function IdeaResearch({ idea }: { idea: Idea }) {
    const { data: allResearch } = useResearch()
    const updateIdea = useUpdateIdea()

    const linkedResearch = allResearch?.filter(r => idea.link_ids.research.includes(r.id)) || []

    // Simple linker
    const handleLink = (researchId: string) => {
        const newLinks = [...idea.link_ids.research, researchId]
        updateIdea.mutate({ id: idea.id, updates: { link_ids: { ...idea.link_ids, research: newLinks } } })
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Linked Research</h3>
                <CaptureResearchModal onCapture={(id) => handleLink(id)} />
            </div>

            {linkedResearch.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground">
                    No research linked yet. Capture evidence to validate this idea.
                </div>
            ) : (
                <div className="grid gap-4">
                    {linkedResearch.map(r => (
                        <ResearchCard key={r.id} entry={r} />
                    ))}
                </div>
            )}
        </div>
    )
}

function ResearchCard({ entry }: { entry: ResearchEntry }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {entry.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Reliability: {entry.reliability_score}/5
                    </span>
                </div>
                <h4 className="font-semibold mb-1">{entry.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{entry.summary}</p>
                {entry.url && (
                    <a href={entry.url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" /> {entry.url}
                    </a>
                )}
                {entry.key_insights?.length > 0 && (
                    <div className="mt-3 bg-muted/30 p-2 rounded text-xs">
                        <strong>Key Insight:</strong> "{entry.key_insights[0]}"
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function CaptureResearchModal({ onCapture }: { onCapture: (id: string) => void }) {
    const [open, setOpen] = useState(false)
    const createResearch = useCreateResearch()
    const [url, setUrl] = useState("")
    const [summary, setSummary] = useState("")
    const [insight, setInsight] = useState("")

    const handleSubmit = async () => {
        const newEntry = await createResearch.mutateAsync({
            title: summary.substring(0, 50) + "...", // Auto-title for now
            url,
            summary,
            key_insights: insight ? [insight] : [],
            type: 'article',
            reliability_score: 3
        })
        onCapture(newEntry.id)
        setOpen(false)
        setUrl("")
        setSummary("")
        setInsight("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Capture New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Capture Research Snippet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Input
                        placeholder="Source URL (Optional)"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    <Textarea
                        placeholder="Summary of what you found..."
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />
                    <div className="relative">
                        <Quote className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                            className="pl-9"
                            placeholder="Key Insight / Quote"
                            value={insight}
                            onChange={e => setInsight(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" onClick={handleSubmit} disabled={createResearch.isPending}>
                        Save & Link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
