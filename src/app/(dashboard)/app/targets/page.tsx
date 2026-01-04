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
import { TargetForm } from "@/components/targets/TargetForm"
import { TargetBoard } from "@/components/targets/TargetBoard"
import { BulkAddTargetDialog } from "@/components/targets/BulkAddTargetDialog"

export default function TargetsPage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Targets</h2>
                    <p className="text-muted-foreground">
                        Pipeline for prospective clients to approach.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <BulkAddTargetDialog />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Target
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Target</DialogTitle>
                                <DialogDescription>
                                    Enter company details to start researching.
                                </DialogDescription>
                            </DialogHeader>
                            <TargetForm onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <TargetBoard />
            </div>
        </div>
    )
}
