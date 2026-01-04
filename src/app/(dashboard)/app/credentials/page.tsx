"use client"

import { useState } from "react"
import { useCredentials, useCreateCredential, useDeleteCredential, useUpdateCredential, Credential, CredentialFormValues } from "@/hooks/useCredentials"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, Copy, Trash2, Edit, Plus, Key, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function CredentialsPage() {
    const { data: credentials, isLoading } = useCredentials()
    const { toast } = useToast()
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCredentials = credentials?.filter(cred =>
        cred.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cred.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Credentials</h2>
                    <p className="text-muted-foreground">
                        Securely store and manage shared logins and secrets.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Credential
                    </Button>
                </div>
            </div>

            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                    placeholder="Search credentials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                />
            </div>

            {isLoading ? (
                <div className="flex h-[200px] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCredentials?.map((cred) => (
                        <CredentialCard key={cred.id} credential={cred} />
                    ))}
                    {filteredCredentials?.length === 0 && (
                        <div className="col-span-full flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed text-muted-foreground">
                            <Key className="mb-4 h-10 w-10 opacity-50" />
                            <p>{searchQuery ? "No matching credentials found." : "No credentials stored yet."}</p>
                            {!searchQuery && <Button variant="link" onClick={() => setIsAddOpen(true)}>Add your first credential</Button>}
                        </div>
                    )}
                </div>
            )}

            <CredentialDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
            />
        </div>
    )
}

function CredentialCard({ credential }: { credential: Credential }) {
    const [showPassword, setShowPassword] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const { toast } = useToast()
    const deleteCred = useDeleteCredential()

    const copyToClipboard = (text: string | undefined, label: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied!",
            description: `${label} copied to clipboard.`,
        })
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this credential?")) {
            deleteCred.mutate(credential.id)
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {credential.title}
                    </CardTitle>
                    <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        {credential.url && (
                            <div className="flex items-center justify-between text-sm">
                                <a
                                    href={credential.url.startsWith('http') ? credential.url : `https://${credential.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                                >
                                    {credential.url} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <span className="text-sm font-mono truncate max-w-[180px]" title={credential.username || "No username"}>
                                {credential.username || "No username"}
                            </span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(credential.username, "Username")}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                            <span className="text-sm font-mono truncate max-w-[180px]">
                                {showPassword ? credential.password : "••••••••••••"}
                            </span>
                            <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(credential.password, "Password")}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            <CredentialDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                credential={credential}
            />
        </>
    )
}

function CredentialDialog({ open, onOpenChange, credential }: { open: boolean, onOpenChange: (open: boolean) => void, credential?: Credential }) {
    const create = useCreateCredential()
    const update = useUpdateCredential()
    const { toast } = useToast()

    const [formData, setFormData] = useState<CredentialFormValues>({
        title: credential?.title || "",
        username: credential?.username || "",
        password: credential?.password || "",
        url: credential?.url || ""
    })

    const isEditing = !!credential
    const isLoading = create.isPending || update.isPending

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (isEditing && credential) {
                await update.mutateAsync({ id: credential.id, values: formData })
                toast({ title: "Updated", description: "Credential updated successfully." })
            } else {
                await create.mutateAsync(formData)
                toast({ title: "Created", description: "Credential saved successfully." })
            }
            onOpenChange(false)
            if (!isEditing) setFormData({ title: "", username: "", password: "", url: "" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to save credential.", variant: "destructive" })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Credential" : "Add Credential"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. AWS Production"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="url">URL (Optional)</Label>
                        <Input
                            id="url"
                            placeholder="https://..."
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="user@example.com"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="text" // Show as text for editing to prevent browser auto-fill messing up
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Save Changes" : "Save Credential"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
