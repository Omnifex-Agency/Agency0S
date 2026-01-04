"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notify } from "@/app/(app)/notify/actions"
import { useToast } from "@/hooks/use-toast"
import { useWorkspace } from "@/hooks/useWorkspace"
import { AttachmentManager } from "@/components/attachments/AttachmentManager"
import { Download, Loader2 } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function NotificationsSettingsPage() {
    const { toast } = useToast()
    const { workspace } = useWorkspace()
    const [loading, setLoading] = useState(false)
    const [manualFileId, setManualFileId] = useState("")

    const handleTest = async () => {
        setLoading(true)
        try {
            const res = await notify("✅ Test message from Agency OS")
            if (res.success) {
                toast({
                    title: "Notification Sent",
                    description: "Check your Telegram chat.",
                })
            } else {
                toast({
                    title: "Failed",
                    description: "Could not send notification. Check server logs.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleManualDownload = () => {
        if (!manualFileId) return
        // Open the secure proxy route with the manual Telegram ID
        window.open(`/api/telegram/file?tg_id=${manualFileId.trim()}`, "_blank")
    }

    const testModeId = workspace?.id || "TEST-MODE"

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">Notifications & Storage</h3>
                <p className="text-sm text-muted-foreground">
                    Manage alerts and test storage integrations.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Telegram Bot</CardTitle>
                        <CardDescription>
                            Test your message delivery.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            Bot Status: {process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ? "Configured" : "Configured on Server"}
                        </div>
                        <Button onClick={handleTest} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? "Sending..." : "Send Test Notification"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Manual Data Retrieval</CardTitle>
                        <CardDescription>
                            Retrieve any file from the bot by its Telegram File ID.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Input
                            placeholder="Paste Telegram File ID here..."
                            value={manualFileId}
                            onChange={(e) => setManualFileId(e.target.value)}
                        />
                        <Button onClick={handleManualDownload} disabled={!manualFileId}>
                            <Download className="h-4 w-4 mr-2" />
                            Retrieve
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle>Temporary Storage Test</CardTitle>
                        <CardDescription>
                            Test uploading images/docs to Telegram.
                            {!workspace && <span className="block text-amber-600 text-xs mt-1">Running in Transient Mode (No Workspace). Files will disappear on refresh.</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AttachmentManager
                            workspaceId={testModeId}
                            entityType="none"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
