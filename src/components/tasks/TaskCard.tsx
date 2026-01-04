"use client"

import { useState, useEffect } from "react"
import { Database } from "@/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/lib/utils"
import { useUpdateTask } from "@/hooks/useTasks"
import { Calendar } from "lucide-react"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

interface TaskCardProps {
    task: Task
}

// Helper for priority color
const priorityColor = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function TaskCard({ task }: TaskCardProps) {
    const updateTask = useUpdateTask()
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(task.title)

    // Sync local state with remote in case of external update (optimistic rollback safe)
    useEffect(() => {
        setTitle(task.title)
    }, [task.title])

    const [isOverdue, setIsOverdue] = useState(false)

    useEffect(() => {
        setIsOverdue(!!(task.due_date && new Date(task.due_date) < new Date() && task.status !== "done"))
    }, [task.due_date, task.status])

    const handleToggle = (checked: boolean) => {
        updateTask.mutate({
            id: task.id,
            values: { status: checked ? "done" : "todo" }
        })
    }

    const handleBlur = () => {
        setIsEditing(false)
        if (title.trim() !== task.title) {
            updateTask.mutate({ id: task.id, values: { title: title.trim() } })
        } else {
            setTitle(task.title) // Reset if empty or same
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur()
        }
    }

    return (
        <Card className={isOverdue ? "border-red-200" : ""}>
            <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0 gap-3">
                <Checkbox
                    checked={task.status === "done"}
                    onCheckedChange={handleToggle}
                    className="mt-1"
                />
                <div className="space-y-1 flex-1">
                    {isEditing ? (
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="text-sm font-medium leading-none bg-transparent border-none p-0 focus:ring-0 w-full outline-none"
                        />
                    ) : (
                        <h4
                            onClick={() => setIsEditing(true)}
                            className={`text-sm font-medium leading-none cursor-text ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}
                        >
                            {task.title}
                        </h4>
                    )}

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`${priorityColor[task.priority as keyof typeof priorityColor] || ""} text-[10px] px-1.5 py-0 h-5`}>
                            {task.priority || "normal"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                    </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {task.due_date && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.due_date)}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
