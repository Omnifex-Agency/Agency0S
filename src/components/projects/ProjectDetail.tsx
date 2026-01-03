"use client"

import { useProject } from "@/hooks/useProjects"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, Building } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"

interface ProjectDetailProps {
    projectId: string
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
    const { data, isLoading, isError } = useProject(projectId)
    const project = data as any

    if (isLoading) {
        return <Skeleton className="h-[600px] w-full" />
    }

    if (isError || !project) {
        return <div>Error loading project details.</div>
    }

    // Calculate progress placeholder
    const progress = 45

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <Badge variant="outline">{project.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 max-w-2xl">{project.description}</p>
                    <div className="flex items-center gap-4 text-muted-foreground mt-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {project.client?.company_name}
                        </div>
                        {project.start_date && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : "Ongoing"}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Edit Project</Button>
                    <Button>Add Task</Button>
                </div>
            </div>

            {/* Progress Section */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-3 flex-1" />
                        <span className="font-bold">{progress}%</span>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="tasks" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="space-y-4">
                    <div className="rounded-md border p-8 text-center text-muted-foreground bg-muted/20 border-dashed">
                        Task list for this project will appear here.
                        {/* Integration with TaskList filtering by project_id would go here */}
                    </div>
                </TabsContent>
                <TabsContent value="documents">
                    <div className="rounded-md border p-8 text-center text-muted-foreground bg-muted/20 border-dashed">
                        Research and documents linked to this project.
                    </div>
                </TabsContent>
                <TabsContent value="finance">
                    <Card>
                        <CardHeader><CardTitle>Budget Overview</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-2xl font-bold">
                                <DollarSign className="h-6 w-6 text-muted-foreground" />
                                {project.budget ? formatCurrency(project.budget) : "No Budget Set"}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
