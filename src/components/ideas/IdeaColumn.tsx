"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { IdeaCard } from "./IdeaCard"
import { Database } from "@/types/database"

type Idea = Database["public"]["Tables"]["ideas"]["Row"]

interface IdeaColumnProps {
    id: string
    title: string
    ideas: Idea[]
}

export function IdeaColumn({ id, title, ideas }: IdeaColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    })

    return (
        <div className="flex h-full w-[280px] min-w-[280px] flex-col rounded-lg bg-muted/50 p-2">
            <div className="mb-3 flex items-center justify-between px-2">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                    {title}
                </h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border">
                    {ideas.length}
                </span>
            </div>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto">
                <SortableContext
                    id={id}
                    items={ideas.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2 min-h-[100px]">
                        {ideas.map((idea) => (
                            <IdeaCard key={idea.id} idea={idea} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}
