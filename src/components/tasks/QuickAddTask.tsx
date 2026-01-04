"use client"

import { useState } from "react"
import { useCreateTask } from "@/hooks/useTasks"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

export function QuickAddTask() {
    const createTask = useCreateTask()
    const [title, setTitle] = useState("")

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && title.trim()) {
            createTask.mutate({
                title: title.trim(),
                status: "todo",
                priority: "medium",
            })
            setTitle("")
        }
    }

    return (
        <div className="relative">
            <Plus className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                id="quick-add-task-input"
                placeholder="Add a task... (Press 'N')"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
                disabled={createTask.isPending}
            />
        </div>
    )
}
