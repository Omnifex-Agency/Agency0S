"use client"

import { useState } from "react"
import { useUpdateSection } from "@/hooks/useOnboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditorProps {
    clientId: string
    section: any
}

export function SectionEditor({ clientId, section }: EditorProps) {
    const updateSection = useUpdateSection(clientId, section.section_key)

    const [formData, setFormData] = useState(section.data || {})
    const [status, setStatus] = useState(section.status || 'draft')

    // Minimal mock comments
    const [comments, setComments] = useState<string[]>(
        section.data?.mock_comments || []
    )
    const [newComment, setNewComment] = useState("")

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        await updateSection.mutateAsync({
            status,
            data: { ...formData, mock_comments: comments }
        })
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return
        const comment = `Admin: ${newComment}` // Mock user
        const updated = [...comments, comment]
        setComments(updated)
        setNewComment("")
        // Auto save on comment? Or just wait for save? let's wait for save to simulate drafting
        // Actually best to save comments separately usually, but for mock MVP we bundle it.
        // Let's bundle it for now.
    }

    // Render Fields based on Key - (Simplified for readability, keeping logic same)
    const renderFields = () => {
        switch (section.section_key) {
            case 'basic_info':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Contact Name</Label>
                            <Input value={formData.contact_name || ''} onChange={e => handleChange('contact_name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Input value={formData.timezone || ''} onChange={e => handleChange('timezone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                        </div>
                    </div>
                )
            case 'requirements':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project Goal</Label>
                            <Textarea value={formData.project_goal || ''} onChange={e => handleChange('project_goal', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Deliverables (comma separated)</Label>
                            <Input value={formData.deliverables || ''} onChange={e => handleChange('deliverables', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Deadline</Label>
                            <Input type="date" value={formData.deadline || ''} onChange={e => handleChange('deadline', e.target.value)} />
                        </div>
                    </div>
                )
            case 'assets':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Logo Link</Label>
                            <Input value={formData.logo_url || ''} onChange={e => handleChange('logo_url', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Brand Kit Link</Label>
                            <Input value={formData.brand_kit_url || ''} onChange={e => handleChange('brand_kit_url', e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                )
            case 'access':
                return (
                    <div className="space-y-4">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded text-sm text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                            <strong>Security Warning:</strong> Do not paste passwords here. Use a secure vault (1Password, etc) and reference it.
                        </div>
                        <div className="space-y-2">
                            <Label>Access Notes / Vault Reference</Label>
                            <Textarea value={formData.access_notes || ''} onChange={e => handleChange('access_notes', e.target.value)} placeholder="e.g. Shared in 1Password under 'Agency Access'" />
                        </div>
                    </div>
                )
            case 'billing':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Package / Plan</Label>
                            <Select value={formData.package_plan || ''} onValueChange={v => handleChange('package_plan', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Plan" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="growth">Growth</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <Select value={formData.payment_status || 'unpaid'} onValueChange={v => handleChange('payment_status', v)}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                    <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
                                    <SelectItem value="paid">Fully Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )
            default:
                return <div className="text-muted-foreground italic">No fields configured.</div>
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-8 pb-6">
                    {/* FIELDS */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Fields</h3>
                        {renderFields()}
                    </div>

                    {/* COMMENTS */}
                    <div className="space-y-4 border-t pt-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Comments
                        </h3>
                        <div className="space-y-3">
                            {comments.length === 0 && <div className="text-sm text-muted-foreground italic">No comments yet.</div>}
                            {comments.map((c, i) => (
                                <div key={i} className="text-sm bg-muted/40 p-2 rounded border">
                                    {c}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <Button size="sm" variant="secondary" onClick={handleAddComment}>Add</Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="border-t pt-4 mt-2 space-y-4 bg-background">
                <div className="space-y-2">
                    <Label>Section Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft (Internal)</SelectItem>
                            <SelectItem value="waiting">Waiting for Client</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="changes_requested">Changes Requested</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-full" onClick={handleSave} disabled={updateSection.isPending}>
                    {updateSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Section
                </Button>
            </div>
        </div>
    )
}
