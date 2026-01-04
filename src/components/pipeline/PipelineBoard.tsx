"use client"

import { useMemo, useState } from "react"
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { PipelineColumn } from "./PipelineColumn"
import { PipelineCard } from "./PipelineCard"
import { useLeads, useUpdateLead } from "@/hooks/useLeads"
import { Database } from "@/types/database"
import { Loader2 } from "lucide-react"

type Lead = Database["public"]["Tables"]["leads"]["Row"]

const COLUMNS: { id: string; title: string }[] = [
    { id: "new", title: "New" },
    { id: "contacted", title: "Contacted" },
    { id: "qualified", title: "Qualified" },
    { id: "proposal", title: "Proposal" },
    { id: "negotiation", title: "Negotiation" },
    { id: "won", title: "Won" },
    { id: "lost", title: "Lost" },
]

export function PipelineBoard() {
    const { data: leads, isLoading } = useLeads()
    const updateLead = useUpdateLead()
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const columns = useMemo(() => {
        if (!leads) return {}
        const acc: Record<string, Lead[]> = {}
        COLUMNS.forEach((col) => {
            acc[col.id] = []
        })
        leads.forEach((lead) => {
            if (acc[lead.stage]) { // Using 'stage'
                acc[lead.stage].push(lead)
            }
        })
        return acc
    }, [leads])

    const activeLead = useMemo(() => {
        return leads?.find((lead) => lead.id === activeId)
    }, [leads, activeId])

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        const activeLead = leads?.find((l) => l.id === active.id)
        if (!activeLead) return

        let newStage: string | undefined

        if (COLUMNS.find(c => c.id === over.id)) {
            newStage = over.id as string
        } else {
            const overLead = leads?.find((l) => l.id === over.id)
            if (overLead) {
                newStage = overLead.stage
            }
        }

        if (newStage && newStage !== activeLead.stage) {
            updateLead.mutate({
                id: activeLead.id,
                values: { stage: newStage as any }
            })
        }
    }

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((column) => (
                    <PipelineColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        leads={columns[column.id] || []}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeLead ? <PipelineCard lead={activeLead} /> : null}
            </DragOverlay>
        </DndContext>
    )
}
