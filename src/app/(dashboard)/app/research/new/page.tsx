"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateResearchDoc } from "@/hooks/useResearch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Changed from RadioGroup
import { ArrowLeft, Loader2, FileText, Search, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

const TEMPLATES = [
    {
        id: "general",
        name: "General Note",
        description: "A blank canvas for your research.",
    },
    {
        id: "competitor_analysis",
        name: "Competitor Analysis",
        description: "Analyze competitor strengths and weaknesses.",
    },
    {
        id: "market_trend",
        name: "Market Trend Report",
        description: "Deep dive into a specific market sector.",
    },
    {
        id: "swot",
        name: "SWOT Analysis",
        description: "Strengths, Weaknesses, Opportunities, Threats.",
    }
]

export default function NewResearchPage() {
    const router = useRouter()
    const createDoc = useCreateResearchDoc()

    const [title, setTitle] = useState("")
    const [type, setType] = useState("general")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            const newDoc = await createDoc.mutateAsync({
                title,
                type,
                content: ""
            } as any) // Cast to any to avoid type errors if NewResearchDoc definition mismatch

            // Assume return type has id
            const docId = (newDoc as any).id
            if (docId) {
                router.push(`/app/research/${docId}`)
            }
        } catch (error) {
            // Error handled in hook
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-8">
            <div>
                <Link href="/app/research" className="text-muted-foreground flex items-center mb-4 hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Hub
                </Link>
                <h1 className="text-3xl font-bold">Create Research Document</h1>
                <p className="text-muted-foreground">Select a template to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 border p-6 rounded-lg bg-card">
                <div className="space-y-4">
                    <Label htmlFor="title" className="text-base">Document Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Q1 Market Analysis"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg"
                        autoFocus
                        required
                    />
                </div>

                <div className="space-y-4">
                    <Label className="text-base">Template</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                            {TEMPLATES.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                    <div className="flex flex-col items-start py-1">
                                        <span className="font-medium">{t.name}</span>
                                        <span className="text-xs text-muted-foreground">{t.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={createDoc.isPending}>
                        {createDoc.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Document
                    </Button>
                </div>
            </form>
        </div>
    )
}
