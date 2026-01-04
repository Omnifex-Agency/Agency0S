"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types/database"
import { ExternalLink } from "lucide-react"

type Target = Database["public"]["Tables"]["targets"]["Row"]

interface TargetCardProps {
    target: Target
}

export function TargetCard({ target }: TargetCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: target.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium leading-tight flex justify-between items-center">
                        {target.company_name}
                        {target.website && (
                            <a href={target.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground">{target.industry || "No Industry"}</div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="font-normal text-[10px]">
                            {target.primary_contact_name || "No Contact"}
                        </Badge>
                        {target.confidence_score && target.confidence_score > 0 && (
                            <span className="text-xs text-muted-foreground">{target.confidence_score}% Match</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
