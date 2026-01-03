"use client"

import { useState } from "react"
import { useIdeas, useCreateIdea } from "@/hooks/useIdeaStorm"
import { IdeaStage, Idea } from "@/types/idea-storm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function IdeasPage() {
    const [currentTab, setCurrentTab] = useState<IdeaStage | 'all'>('all')
    const { data: ideas, isLoading } = useIdeas(currentTab === 'all' ? undefined : currentTab)

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Idea Vault</h1>
                    <p className="text-muted-foreground">Capture, validate, and prioritize your master plan.</p>
                </div>
                <CreateIdeaButton />
            </div>

            <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as any)} className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="exploring">Exploring</TabsTrigger>
                    <TabsTrigger value="validated">Validated</TabsTrigger>
                    <TabsTrigger value="building">Building</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped</TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoading ? (
                <div>Loading ideas...</div>
            ) : ideas?.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas?.map(idea => (
                        <IdeaCard key={idea.id} idea={idea} />
                    ))}
                </div>
            )}
        </div>
    )
}

function IdeaCard({ idea }: { idea: Idea }) {
    const stageColors: Record<IdeaStage, string> = {
        inbox: "bg-gray-100 text-gray-800",
        exploring: "bg-blue-100 text-blue-800",
        validated: "bg-purple-100 text-purple-800",
        building: "bg-amber-100 text-amber-800",
        shipped: "bg-green-100 text-green-800",
        archived: "bg-gray-200 text-gray-500"
    }

    return (
        <Link href={`/app/ideas/${idea.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={`border-0 ${stageColors[idea.stage]} uppercase text-[10px]`}>
                            {idea.stage}
                        </Badge>
                        <span className="text-xs font-mono font-medium text-muted-foreground">
                            RICE: {idea.scores.rice.total}
                        </span>
                    </div>
                    <CardTitle className="leading-snug group-hover:text-primary transition-colors">
                        {idea.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {idea.one_liner || idea.description || "No description provided."}
                    </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-3 mt-auto">
                    Updated {formatDistanceToNow(new Date(idea.updated_at))} ago
                </CardFooter>
            </Card>
        </Link>
    )
}

function CreateIdeaButton() {
    const [open, setOpen] = useState(false)
    const createIdea = useCreateIdea()
    const [title, setTitle] = useState("")
    const [oneLiner, setOneLiner] = useState("")

    const handleSubmit = async () => {
        if (!title.trim()) return
        await createIdea.mutateAsync({ title, one_liner: oneLiner })
        setOpen(false)
        setTitle("")
        setOneLiner("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Sparkles className="mr-2 h-4 w-4" /> Quick Capture
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Capture New Idea</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">What's the idea?</label>
                        <Input
                            placeholder="e.g. AI-powered user interviews"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">One-liner pitch</label>
                        <Textarea
                            placeholder="Explain the value in one sentence..."
                            value={oneLiner}
                            onChange={e => setOneLiner(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" onClick={handleSubmit} disabled={createIdea.isPending}>
                        {createIdea.isPending ? "Capturing..." : "Save to Inbox"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg bg-muted/10 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">The vault is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">Every great product starts as a raw idea. Capture your first spark now.</p>
            <CreateIdeaButton />
        </div>
    )
}
