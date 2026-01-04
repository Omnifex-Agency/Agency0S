"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types/database"
import { Lightbulb } from "lucide-react"

type Idea = Database["public"]["Tables"]["ideas"]["Row"]

interface IdeaCardProps {
    idea: Idea
}

export function IdeaCard({ idea }: IdeaCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: idea.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium leading-tight flex justify-between items-start gap-2">
                        <span>{idea.title}</span>
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                            {idea.template_type}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="text-xs text-muted-foreground line-clamp-2">
                        {idea.problem || idea.insight || "No description provided."}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
