"use client"

import { use, useState } from "react"
import { useIdea } from "@/hooks/useIdeaStorm"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { IdeaCanvas } from "@/components/ideas/IdeaCanvas"
import { IdeaScores } from "@/components/ideas/IdeaScores"
import { IdeaResearch } from "@/components/ideas/IdeaResearch"
import { IdeaDecisions } from "@/components/ideas/IdeaDecisions"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function IdeaDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const { data: idea, isLoading } = useIdea(resolvedParams.id)
    const [activeTab, setActiveTab] = useState("canvas")

    if (isLoading) return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>
    if (!idea) return <div className="p-8">Idea not found</div>

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="border-b bg-background px-6 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/app/ideas">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
                            {idea.title}
                            <Badge variant="outline" className="uppercase text-[10px]">{idea.stage}</Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">{idea.one_liner}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b bg-muted/40 shrink-0">
                    <TabsList className="bg-transparent h-12 w-full justify-start gap-8 p-0">
                        <TabsTrigger value="canvas" className="h-12 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent">Canvas</TabsTrigger>
                        <TabsTrigger value="scores" className="h-12 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent">Prioritization</TabsTrigger>
                        <TabsTrigger value="research" className="h-12 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent">Research</TabsTrigger>
                        <TabsTrigger value="decisions" className="h-12 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent">Decisions</TabsTrigger>
                        <TabsTrigger value="experiments" className="h-12 border-b-2 border-transparent data-[state=active]:border-primary rounded-none bg-transparent">Experiments</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-8 bg-background">
                    <TabsContent value="canvas" className="m-0 h-full max-w-4xl mx-auto">
                        <IdeaCanvas idea={idea} />
                    </TabsContent>

                    <TabsContent value="scores" className="m-0 h-full max-w-5xl mx-auto">
                        <IdeaScores idea={idea} />
                    </TabsContent>

                    <TabsContent value="research" className="m-0 h-full max-w-4xl mx-auto">
                        <IdeaResearch idea={idea} />
                    </TabsContent>

                    <TabsContent value="decisions" className="m-0 h-full max-w-4xl mx-auto">
                        <IdeaDecisions idea={idea} />
                    </TabsContent>

                    <TabsContent value="experiments" className="m-0 h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">Experiments</h3>
                            <p>Design and track validation tests (Coming in Phase 3).</p>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
