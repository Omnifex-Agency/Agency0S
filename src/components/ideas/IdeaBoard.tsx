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
import { IdeaColumn } from "./IdeaColumn"
import { IdeaCard } from "./IdeaCard"
import { useIdeas, useUpdateIdea } from "@/hooks/useIdeas"
import { Database } from "@/types/database"
import { Loader2 } from "lucide-react"

type Idea = Database["public"]["Tables"]["ideas"]["Row"]

const COLUMNS: { id: string; title: string }[] = [
    { id: "new", title: "New" },
    { id: "validating", title: "Validating" },
    { id: "refined", title: "Refined" },
    { id: "approved", title: "Approved" },
    { id: "turned_into_project", title: "Project" },
    { id: "parked", title: "Parked" },
    { id: "rejected", title: "Rejected" },
]

export function IdeaBoard() {
    const { data: ideas, isLoading } = useIdeas()
    const updateIdea = useUpdateIdea()
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const columns = useMemo(() => {
        if (!ideas) return {}
        const acc: Record<string, Idea[]> = {}
        COLUMNS.forEach((col) => { acc[col.id] = [] })
        ideas.forEach((idea) => {
            if (acc[idea.status]) {
                acc[idea.status].push(idea)
            }
        })
        return acc
    }, [ideas])

    const activeIdea = useMemo(() => {
        return ideas?.find((i) => i.id === activeId)
    }, [ideas, activeId])

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)
        if (!over) return

        const activeIdea = ideas?.find((i) => i.id === active.id)
        if (!activeIdea) return

        let newStatus: string | undefined

        if (COLUMNS.find(c => c.id === over.id)) {
            newStatus = over.id as string
        } else {
            const overIdea = ideas?.find((i) => i.id === over.id)
            if (overIdea) newStatus = overIdea.status
        }

        if (newStatus && newStatus !== activeIdea.status) {
            updateIdea.mutate({
                id: activeIdea.id,
                values: { status: newStatus as any }
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
                    <IdeaColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        ideas={columns[column.id] || []}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeIdea ? <IdeaCard idea={activeIdea} /> : null}
            </DragOverlay>
        </DndContext>
    )
}
