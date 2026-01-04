"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useResearchDoc, useUpdateResearchDoc } from "@/hooks/useResearch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save, Loader2, MoreVertical, Trash2 } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttachmentManager } from "@/components/attachments/AttachmentManager"

export default function ResearchDetailPage() {
    const params = useParams()
    const id = params.id as string
    const router = useRouter()

    const { data: doc, isLoading, error } = useResearchDoc(id)
    const updateDoc = useUpdateResearchDoc()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isDirty, setIsDirty] = useState(false)

    // Sync state when doc loads
    useEffect(() => {
        if (doc) {
            setTitle(doc.title)
            setContent(doc.content || "")
        }
    }, [doc])

    // Handle Save
    const handleSave = async () => {
        if (!doc) return
        try {
            await updateDoc.mutateAsync({
                id,
                updates: { title, content }
            })
            setIsDirty(false)
        } catch (e) {
            // error handled in hook
        }
    }

    // Keyboard shortcut for save
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSave()
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [title, content, doc])

    if (isLoading) return <div className="p-8 space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-[500px] w-full" /></div>
    if (error || !doc) return <div className="p-8 text-destructive">Error loading document.</div>

    return (
        <div className="flex flex-col h-[calc(100vh-60px)]">
            {/* Header */}
            <div className="border-b bg-background px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1">
                    <Link href="/app/research">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1 max-w-2xl">
                        <Input
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                            className="bg-transparent border-0 text-lg font-semibold h-auto p-1 focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all"
                            placeholder="Untitled Document"
                        />
                        <p className="text-xs text-muted-foreground mt-1 ml-1">
                            {doc.type.replace('_', ' ').toUpperCase()} • {isDirty ? "Unsaved changes" : "Saved"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={!isDirty && !updateDoc.isPending}>
                        {updateDoc.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <Tabs defaultValue="document" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b bg-muted/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <TabsList className="bg-transparent rounded-none h-12 p-0 w-full justify-start gap-6">
                        <TabsTrigger
                            value="document"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 h-12"
                        >
                            Document
                        </TabsTrigger>
                        <TabsTrigger
                            value="files"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 h-12"
                        >
                            Attachments
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="document" className="flex-1 overflow-auto p-0 m-0 border-0 h-full outline-none data-[state=inactive]:hidden">
                    <div className="max-w-4xl mx-auto h-full w-full p-6 flex flex-col">
                        <Textarea
                            value={content}
                            onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
                            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0 text-base leading-relaxed bg-transparent shadow-none"
                            placeholder="Start typing your research here..."
                        />
                    </div>
                </TabsContent>

                <TabsContent value="files" className="flex-1 overflow-auto p-0 m-0 border-0 h-full outline-none data-[state=inactive]:hidden">
                    <div className="max-w-4xl mx-auto p-6 w-full">
                        <div className="bg-background border rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-4">Files & Assets</h3>
                            <AttachmentManager
                                workspaceId={doc.workspace_id}
                                entityId={id}
                                entityType="research"
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
