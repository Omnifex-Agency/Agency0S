"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTargets } from "@/hooks/useTargets"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function BulkAddTargetDialog() {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const createTargets = useCreateTargets()

    const handleImport = async () => {
        if (!text.trim()) return

        const lines = text.split("\n").filter(line => line.trim() !== "")
        const targets = lines.map(line => {
            const parts = line.split("|").map(p => p.trim())
            return {
                company_name: parts[0] || "Unknown",
                website: parts[1] || "",
                industry: parts[2] || "",
                status: "new" as const,
                primary_contact_name: "",
                primary_contact_email: "",
                confidence_score: 50
            }
        })

        if (targets.length === 0) return

        try {
            await createTargets.mutateAsync(targets)
            toast({
                title: "Import Successful",
                description: `Successfully added ${targets.length} targets.`,
            })
            setText("")
            setOpen(false)
            // Force refresh of board? Invalidation handles it.
        } catch (error) {
            toast({
                title: "Import Failed",
                description: "There was an error importing targets.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Bulk Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Bulk Add Targets</DialogTitle>
                    <DialogDescription>
                        Paste targets below (one per line). Format: <br />
                        <code className="bg-muted px-1 rounded">Company Name | Website | Industry</code>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={"Acme Corp | acme.com | SaaS\nGlobex | globex.inc | Manufacturing"}
                        className="h-[200px] font-mono text-sm"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleImport} disabled={createTargets.isPending}>
                        {createTargets.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Import Targets
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
