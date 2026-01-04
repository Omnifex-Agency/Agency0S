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
import { LeadForm } from "@/components/pipeline/LeadForm"
import { PipelineBoard } from "@/components/pipeline/PipelineBoard"

export default function PipelinePage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pipeline</h2>
                    <p className="text-muted-foreground">
                        Manage your leads and sales pipeline.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Lead
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Lead</DialogTitle>
                                <DialogDescription>
                                    Create a new lead to track in your pipeline.
                                </DialogDescription>
                            </DialogHeader>
                            <LeadForm onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <PipelineBoard />
            </div>
        </div>
    )
}
