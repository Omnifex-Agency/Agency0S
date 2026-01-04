"use client"

import { useIdea } from "@/hooks/useIdeas"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, Rocket } from "lucide-react"

interface IdeaDetailProps {
    ideaId: string
    workspaceId: string
}

export function IdeaDetail({ ideaId }: IdeaDetailProps) {
    const { data: idea, isLoading, isError } = useIdea(ideaId)

    if (isLoading) return <Skeleton className="h-[600px] w-full" />
    if (isError || !idea) return <div>Error loading idea.</div>

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        {idea.title}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{idea.template_type}</Badge>
                        <Badge>{idea.status.replace("_", " ")}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Convert to Project</Button>
                    <Button><Rocket className="mr-2 h-4 w-4" /> Launch Experiment</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Problem & Insight */}
                <Card>
                    <CardHeader><CardTitle>The Whys</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm">Problem</h4>
                            <p className="text-muted-foreground text-sm mt-1">{idea.problem || "N/A"}</p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-sm">Insight</h4>
                            <p className="text-muted-foreground text-sm mt-1">{idea.insight || "N/A"}</p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-sm">Hypothesis</h4>
                            <p className="text-muted-foreground text-sm mt-1">{idea.hypothesis || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Execution & Metrics */}
                <Card>
                    <CardHeader><CardTitle>The Hows</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm">Execution Plan</h4>
                            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">{idea.execution_plan || "Not defined yet."}</p>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="font-semibold text-sm">Metrics</h4>
                            <p className="text-muted-foreground text-sm mt-1">{idea.metrics || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
