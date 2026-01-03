"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { PipelineCard } from "./PipelineCard"
import { Database } from "@/types/database"
import { cn } from "@/lib/utils"

type Lead = Database["public"]["Tables"]["leads"]["Row"]

interface PipelineColumnProps {
    id: string
    title: string
    leads: Lead[]
}

export function PipelineColumn({ id, title, leads }: PipelineColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    })

    return (
        <div className="flex h-full w-[280px] min-w-[280px] flex-col rounded-lg bg-muted/50 p-2">
            <div className="mb-3 flex items-center justify-between px-2">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                    {title}
                </h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground bg-background border">
                    {leads.length}
                </span>
            </div>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto">
                <SortableContext
                    id={id}
                    items={leads.map((lead) => lead.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2 min-h-[100px]">
                        {leads.map((lead) => (
                            <PipelineCard key={lead.id} lead={lead} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}
