"use client"

import { useEffect } from "react"
import { useTasks } from "@/hooks/useTasks"
import { TaskCard } from "@/components/tasks/TaskCard"
import { QuickAddTask } from "@/components/tasks/QuickAddTask"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare } from "lucide-react"

export function TaskList() {
    const { data: tasks, isLoading, isError } = useTasks()

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
            // ContentEditable checks too?
            if ((e.target as HTMLElement).isContentEditable) return

            if (e.key.toLowerCase() === 'n') {
                e.preventDefault()
                document.getElementById("quick-add-task-input")?.focus()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])


    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full mb-4" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[100px] w-full" />
                ))}
            </div>
        )
    }

    if (!tasks?.length) {
        return (
            <div className="space-y-4">
                <QuickAddTask />
                <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <CheckSquare className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                        You have no tasks. Create one to get started.
                    </p>
                </div>
            </div>
        )
    }

    const pendingTasks = tasks.filter(t => t.status !== "done" && t.status !== "cancelled")
    const completedTasks = tasks.filter(t => t.status === "done" || t.status === "cancelled")

    return (
        <div className="space-y-4">
            <QuickAddTask />
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="space-y-4">
                    {pendingTasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No pending tasks. Great job!</div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {pendingTasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {completedTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
