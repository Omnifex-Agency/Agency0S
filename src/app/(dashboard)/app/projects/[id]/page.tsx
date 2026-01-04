import { ProjectDetail } from "@/components/projects/ProjectDetail"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: PageProps) {
    const resolvedParams = await params

    return <ProjectDetail projectId={resolvedParams.id} />
}
