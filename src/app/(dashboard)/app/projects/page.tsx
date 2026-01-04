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
import { ProjectForm } from "@/components/projects/ProjectForm"
import { ProjectList } from "@/components/projects/ProjectList"
import { Input } from "@/components/ui/input"

export default function ProjectsPage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Manage your ongoing work and client deliverables.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                                <DialogTitle>Create Project</DialogTitle>
                                <DialogDescription>
                                    Define a new project and assign it to a client.
                                </DialogDescription>
                            </DialogHeader>
                            <ProjectForm onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Search Bar - Placeholder */}
            <div className="max-w-sm">
                <Input placeholder="Search projects..." />
            </div>

            <ProjectList />
        </div>
    )
}
