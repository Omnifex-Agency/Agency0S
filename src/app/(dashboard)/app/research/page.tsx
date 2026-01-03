"use client"

import Link from "next/link"
import { useResearchDocs, ResearchDoc } from "@/hooks/useResearch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical, FileText, Plus, Calendar, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResearchPage() {
    const { data: docs, isLoading } = useResearchDocs()

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Research Hub</h1>
                    <p className="text-muted-foreground">Manage structured research, market analysis, and notes.</p>
                </div>
                <Link href="/app/research/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Document
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[200px]" />
                    <Skeleton className="h-[200px]" />
                    <Skeleton className="h-[200px]" />
                </div>
            ) : docs?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/10">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <FlaskConical className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No research documents yet</h3>
                    <p className="text-muted-foreground mb-4">Start by creating a market analysis or competitor review.</p>
                    <Link href="/app/research/new">
                        <Button variant="outline">Create your first doc</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs?.map((doc) => (
                        <ResearchCard key={doc.id} doc={doc} />
                    ))}
                </div>
            )}
        </div>
    )
}

function ResearchCard({ doc }: { doc: ResearchDoc }) {
    const typeLabel = doc.type.replace("_", " ").toUpperCase()

    return (
        <Link href={`/app/research/${doc.id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground border px-2 py-1 rounded">
                            {typeLabel}
                        </span>
                    </div>
                    <CardTitle className="mt-4 line-clamp-1 group-hover:text-primary transition-colors">
                        {doc.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {doc.content ? doc.content.substring(0, 100) : "No content preview..."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
