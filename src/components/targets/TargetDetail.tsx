"use client"

import { useTarget, useConvertTarget } from "@/hooks/useTargets"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AttachmentManager } from "@/components/attachments/AttachmentManager"

interface TargetDetailProps {
    targetId: string
    workspaceId: string
}

export function TargetDetail({ targetId, workspaceId }: TargetDetailProps) {
    const { data: target, isLoading, isError } = useTarget(targetId)
    // Hook uses context now, no need to pass workspaceId
    const convertTarget = useConvertTarget()

    if (isLoading) return <Skeleton className="h-[600px] w-full" />
    if (isError || !target) return <div>Error loading target.</div>

    const handleConvert = async () => {
        try {
            await convertTarget.mutateAsync(target)
            // Notifications handling is in the hook now
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to convert target.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        {target.company_name}
                        <Badge variant="secondary">{target.status.replace("_", " ")}</Badge>
                    </h1>
                    <p className="text-muted-foreground mt-1">{target.industry} • {target.website}</p>
                </div>
                <div className="flex gap-2">
                    {!["converted", "discarded"].includes(target.status) && (
                        <Button onClick={handleConvert} disabled={convertTarget.isPending}>
                            {convertTarget.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Convert to Client <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                    <TabsTrigger value="pitch">Pitch Plan</TabsTrigger>
                    <TabsTrigger value="outreach">Outreach</TabsTrigger>
                    <TabsTrigger value="ideas">Ideas</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardHeader><CardTitle>Target Info</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Primary Contact:</strong> {target.primary_contact_name} ({target.primary_contact_role})</p>
                            <p><strong>Email:</strong> {target.primary_contact_email}</p>
                            <p><strong>Confidence:</strong> {target.confidence_score}%</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="research">
                    <Card>
                        <CardHeader>
                            <CardTitle>Research & Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AttachmentManager
                                workspaceId={workspaceId}
                                entityId={targetId}
                                entityType="target"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pitch">
                    <div className="p-8 text-center border border-dashed rounded bg-muted/20">Pitch Deck and Strategy planning.</div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
