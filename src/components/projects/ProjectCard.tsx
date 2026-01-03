"use client"

import Link from "next/link"
import { Calendar, MoreVertical, Briefcase } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Database } from "@/types/database"

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
    client: { company_name: string } | null
}

interface ProjectCardProps {
    project: Project
}

const statusColors = {
    planning: "secondary",
    active: "default",
    on_hold: "secondary", // orange-ish ideally
    completed: "outline", // green-ish ideally
    cancelled: "destructive",
}

export function ProjectCard({ project }: ProjectCardProps) {
    // Placeholder progress - ideally calculated from tasks
    const progress = 45

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-medium">
                        <Link href={`/app/projects/${project.id}`} className="hover:underline">
                            {project.name}
                        </Link>
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {project.client?.company_name || "Internal Project"}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant={statusColors[project.status as keyof typeof statusColors] as any || "secondary"}>
                        {project.status.replace("_", " ")}
                    </Badge>
                    {project.budget && (
                        <Badge variant="outline">
                            {formatCurrency(project.budget)}
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground w-full justify-between">
                    {project.end_date && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due {formatDate(project.end_date)}
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}
