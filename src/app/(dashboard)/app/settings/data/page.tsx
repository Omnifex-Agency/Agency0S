"use client"

import { adapter } from "@/lib/storage-adapter"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { AlertCircle, Download, Upload, CheckCircle2, Database } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DUMMY_DATA_BACKUP } from "@/lib/dummy-data"

export default function DataSettingsPage() {
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [statusMsg, setStatusMsg] = useState("")

    const handleExport = async () => {
        try {
            const data = await adapter.exportBackup()
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `agency-os-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (e) {
            console.error(e)
            alert("Export failed")
        }
    }

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const text = await file.text()
            const json = JSON.parse(text)

            // Basic validation
            if (!json.state || !json.events) throw new Error("Invalid backup format")

            await adapter.importBackup(json)
            setImportStatus('success')
            setStatusMsg(`Successfully imported backup from ${json.state.meta.updated_at}`)

            // Reload to reflect changes
            setTimeout(() => window.location.reload(), 1500)
        } catch (err: any) {
            console.error(err)
            setImportStatus('error')
            setStatusMsg(err.message || "Failed to parse backup file")
        }
    }

    const handleLoadDummy = async () => {
        if (!confirm("This will overwrite your existing data with sample data. Continue?")) return
        try {
            await adapter.importBackup(DUMMY_DATA_BACKUP as any)
            setImportStatus('success')
            setStatusMsg("Dummy data loaded successfully")
            setTimeout(() => window.location.reload(), 1000)
        } catch (e: any) {
            setImportStatus('error')
            setStatusMsg(e.message)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data & Storage</h1>
                <p className="text-muted-foreground">Manage your offline data, create backups, and restore history.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" /> Export Data
                        </CardTitle>
                        <CardDescription>
                            Download a full JSON snapshot of your Ideas, Research, and Decisions.
                            Keep this file safe as it contains your entire workspace history.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleExport}>
                            Download Backup (.json)
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-500">
                            <Upload className="h-5 w-5" /> Import Data
                        </CardTitle>
                        <CardDescription className="text-amber-800/80 dark:text-amber-400">
                            Restore from a previous backup file.
                            <strong className="block mt-1">WARNING: This will overwrite your current data completely.</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-amber-100 file:text-amber-700
                                hover:file:bg-amber-200"
                            />

                            {importStatus === 'success' && (
                                <Alert className="bg-green-50 border-green-200 text-green-800">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{statusMsg}</AlertDescription>
                                </Alert>
                            )}

                            {importStatus === 'error' && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{statusMsg}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-500">
                            <Database className="h-5 w-5" /> Load Sample Data
                        </CardTitle>
                        <CardDescription className="text-blue-800/80 dark:text-blue-400">
                            Quickly populate the app with realistic test data (Ideas, Research, Decisions) to explore features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100" onClick={handleLoadDummy}>
                            Load Dummy Data
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Storage Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Storage Engine: <strong>LocalAdapter (localStorage)</strong></p>
                            <p>Status: <span className="text-green-600 font-medium">Online (Offline-Ready)</span></p>
                            <p className="text-xs pt-2">Database Sync is disabled in this version (v1.0.0).</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
