"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types/database"
import { formatCurrency } from "@/lib/utils"

type Lead = Database["public"]["Tables"]["leads"]["Row"]

interface PipelineCardProps {
    lead: Lead
}

export function PipelineCard({ lead }: PipelineCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: lead.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium leading-tight">
                        {lead.title}
                    </CardTitle>
                    {/* Company name removed as it is not in the leads table schema */}
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="font-normal">
                            {formatCurrency(lead.estimated_value || 0)}
                        </Badge>
                        {lead.probability > 0 && (
                            <span className="text-xs text-muted-foreground">{lead.probability}%</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
