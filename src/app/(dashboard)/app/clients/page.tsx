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
import { ClientForm } from "@/components/clients/ClientForm"
import { ClientList } from "@/components/clients/ClientList"

export default function ClientsPage() {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                    <p className="text-muted-foreground">
                        Manage your client relationships and intake status.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Client
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Client</DialogTitle>
                                <DialogDescription>
                                    Create a new client profile. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <ClientForm onSuccess={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* ClientList now handles its own filters to avoid prop drilling complex state for now */}
            <ClientList />
        </div>
    )
}
