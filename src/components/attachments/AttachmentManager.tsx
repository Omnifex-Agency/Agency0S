"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Paperclip, Download, FileIcon, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

interface Attachment {
    id: string
    file_name: string
    created_at: string
    size_bytes: number
    telegram_file_id?: string // For test mode
}

interface AttachmentManagerProps {
    workspaceId: string
    entityId?: string
    entityType: "target" | "client" | "project" | "task" | "research" | "none"
}

export function AttachmentManager({ workspaceId, entityId, entityType }: AttachmentManagerProps) {
    const { toast } = useToast()
    const [uploading, setUploading] = useState(false)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [loading, setLoading] = useState(false)

    const fetchAttachments = async () => {
        if (workspaceId === "TEST-MODE") return

        setLoading(true)
        let query: any = supabase
            .from("attachments")
            .select("id, file_name, created_at, size_bytes, telegram_file_id")
            .eq("workspace_id", workspaceId)

        if (entityType !== "none" && entityId) {
            query = query.eq(`${entityType}_id` as any, entityId)
        } else {
            // Type-safe approach to check multiple nulls without infinite recursion
            const nullFilters = ["target_id", "client_id", "task_id", "project_id", "research_doc_id"]
            nullFilters.forEach(f => {
                query = query.is(f as any, null)
            })
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (!error && data) {
            setAttachments(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (workspaceId && workspaceId !== "TEST-MODE") {
            fetchAttachments()
        }
    }, [workspaceId, entityId, entityType])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        setUploading(true)
        const file = e.target.files[0]

        try {
            // Use Raw Upload Strategy (headers + raw body) to handle videos and large files reliably
            const res = await fetch("/api/telegram/upload", {
                method: "POST",
                headers: {
                    "Content-Type": file.type || "application/octet-stream",
                    "X-File-Name": encodeURIComponent(file.name),
                    "X-Workspace-Id": workspaceId,
                    "X-Entity-Type": entityType,
                    "X-Entity-Id": entityId || "",
                },
                body: file,
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || errData.details || res.statusText)
            }

            const data = await res.json()
            toast({ title: "File uploaded successfully" })

            if (workspaceId === "TEST-MODE") {
                setAttachments(prev => [data, ...prev])
            } else {
                fetchAttachments()
            }
        } catch (error: any) {
            console.error("Upload Error:", error)
            toast({
                title: "Upload failed",
                description: error.message === "Telegram Chat Not Found"
                    ? "Start the bot @myagencyosbot in Telegram first!"
                    : (error.message || "Ensure file storage is enabled."),
                variant: "destructive"
            })
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    const handleDownload = (file: Attachment) => {
        if (workspaceId === "TEST-MODE" && file.telegram_file_id) {
            const nameParam = encodeURIComponent(file.file_name)
            window.open(`/api/telegram/file?tg_id=${file.telegram_file_id}&filename=${nameParam}`, "_blank")
        } else {
            window.open(`/api/telegram/file?id=${file.id}`, "_blank")
        }
    }

    const handleClearTest = () => {
        setAttachments([])
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Attachments</h4>
                <div className="flex items-center gap-2">
                    {workspaceId === "TEST-MODE" && attachments.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearTest} className="text-muted-foreground hover:text-destructive h-8 px-2">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="relative">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <Button variant="outline" size="sm" disabled={uploading}>
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Paperclip className="h-4 w-4 mr-2" />}
                            Upload
                        </Button>
                    </div>
                </div>
            </div>

            <div className="border rounded-md overflow-hidden bg-background">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                            <tr>
                                <th className="p-3">File Name</th>
                                {workspaceId === "TEST-MODE" && <th className="p-3">Telegram File ID</th>}
                                <th className="p-3 w-[80px] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {attachments.length === 0 && (
                                <tr>
                                    <td colSpan={workspaceId === "TEST-MODE" ? 3 : 2} className="p-4 text-center text-muted-foreground">
                                        No attachments.
                                    </td>
                                </tr>
                            )}
                            {attachments.map((file) => (
                                <tr key={file.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <FileIcon className="h-4 w-4 text-blue-500/70" />
                                            <span className="truncate max-w-[200px] font-medium">{file.file_name}</span>
                                        </div>
                                    </td>
                                    {workspaceId === "TEST-MODE" && (
                                        <td className="p-3 font-mono text-xs text-muted-foreground max-w-[200px] truncate" title={file.telegram_file_id}>
                                            <span className="bg-muted px-1 py-0.5 rounded select-all cursor-pointer hover:bg-muted/80">
                                                {file.telegram_file_id || "-"}
                                            </span>
                                        </td>
                                    )}
                                    <td className="p-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            onClick={() => handleDownload(file)}
                                        >
                                            <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
