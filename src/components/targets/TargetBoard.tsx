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
import { TargetColumn } from "./TargetColumn"
import { TargetCard } from "./TargetCard"
import { useTargets, useUpdateTarget } from "@/hooks/useTargets"
import { Database } from "@/types/database"
import { Loader2 } from "lucide-react"

type Target = Database["public"]["Tables"]["targets"]["Row"]

const COLUMNS: { id: string; title: string }[] = [
    { id: "new", title: "New" },
    { id: "identifying", title: "Identifying" },
    { id: "researching", title: "Researching" },
    { id: "ready_to_pitch", title: "Ready" },
    { id: "pitching", title: "Pitching" },
    { id: "converted", title: "Converted" },
    { id: "discarded", title: "Discarded" },
]

export function TargetBoard() {
    const { data: targets, isLoading } = useTargets()
    const updateTarget = useUpdateTarget()
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const columns = useMemo(() => {
        if (!targets) return {}
        const acc: Record<string, Target[]> = {}
        COLUMNS.forEach((col) => { acc[col.id] = [] })
        targets.forEach((target) => {
            if (acc[target.status]) {
                acc[target.status].push(target)
            }
        })
        return acc
    }, [targets])

    const activeTarget = useMemo(() => {
        return targets?.find((t) => t.id === activeId)
    }, [targets, activeId])

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)
        if (!over) return

        const activeTarget = targets?.find((t) => t.id === active.id)
        if (!activeTarget) return

        let newStatus: string | undefined

        if (COLUMNS.find(c => c.id === over.id)) {
            newStatus = over.id as string
        } else {
            const overTarget = targets?.find((t) => t.id === over.id)
            if (overTarget) newStatus = overTarget.status
        }

        if (newStatus && newStatus !== activeTarget.status) {
            updateTarget.mutate({
                id: activeTarget.id,
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
                    <TargetColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        targets={columns[column.id] || []}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeTarget ? <TargetCard target={activeTarget} /> : null}
            </DragOverlay>
        </DndContext>
    )
}
