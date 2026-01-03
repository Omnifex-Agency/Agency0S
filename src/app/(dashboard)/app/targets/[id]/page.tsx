import { TargetDetail } from "@/components/targets/TargetDetail"

interface PageProps {
    params: Promise<{ id: string }>
}

const DEMO_WORKSPACE_ID = "00000000-0000-0000-0000-000000000000"

export default async function TargetPage({ params }: PageProps) {
    const resolvedParams = await params

    return <TargetDetail targetId={resolvedParams.id} workspaceId={DEMO_WORKSPACE_ID} />
}
