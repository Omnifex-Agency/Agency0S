"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TaskForm } from "@/components/tasks/TaskForm"
import { TaskList } from "@/components/tasks/TaskList"
import { Input } from "@/components/ui/input"

export default function TasksPage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">
                        Manage your daily tasks and priorities.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle>Add New Task</DialogTitle>
                                <DialogDescription>
                                    Create a task and assign it to a client or project.
                                </DialogDescription>
                            </DialogHeader>
                            <TaskForm onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search Bar - Placeholder functionality for now */}
            <div className="max-w-sm">
                <Input placeholder="Search tasks..." />
            </div>

            <TaskList />
        </div>
    )
}
