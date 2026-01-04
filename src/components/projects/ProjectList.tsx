"use client"

import { useProjects } from "@/hooks/useProjects"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase } from "lucide-react"

export function ProjectList() {
    const { data: projects, isLoading, isError } = useProjects()

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[200px] w-full" />
                ))}
            </div>
        )
    }

    if (!projects?.length) {
        return (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No projects started</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                    Launch a new project to start tracking progress.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project as any} />
            ))}
        </div>
    )
}
