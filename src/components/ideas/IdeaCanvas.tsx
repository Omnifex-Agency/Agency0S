"use client"

import { useState } from "react"
import { Idea } from "@/types/idea-storm"
import { useUpdateIdea } from "@/hooks/useIdeaStorm"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function IdeaCanvas({ idea }: { idea: Idea }) {
    const updateIdea = useUpdateIdea()
    const [canvas, setCanvas] = useState(idea.canvas)

    // Auto-save debounce effect could be added here, 
    // but for MVP we'll use a manual save or blur logic.
    // Let's do simple state sync and a save button for explicit action.

    const handleChange = (field: keyof typeof canvas, value: any) => {
        setCanvas(prev => ({ ...prev, [field]: value }))
    }

    const handleArrayChange = (field: 'assumptions' | 'risks' | 'mvp_scope' | 'success_metrics', index: number, value: string) => {
        const newArray = [...canvas[field]]
        newArray[index] = value
        handleChange(field, newArray)
    }

    const addArrayItem = (field: 'assumptions' | 'risks' | 'mvp_scope' | 'success_metrics') => {
        handleChange(field, [...canvas[field], ""])
    }

    const handleSave = () => {
        updateIdea.mutate({ id: idea.id, updates: { canvas } })
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Problem Statement</Label>
                        <p className="text-xs text-muted-foreground">What pain point are we solving?</p>
                        <Textarea
                            rows={4}
                            value={canvas.problem}
                            onChange={e => handleChange('problem', e.target.value)}
                            placeholder="e.g. Users struggle to..."
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Target User</Label>
                        <p className="text-xs text-muted-foreground">Who is desperate for this?</p>
                        <Textarea
                            rows={4}
                            value={canvas.user}
                            onChange={e => handleChange('user', e.target.value)}
                            placeholder="e.g. Remote design teams..."
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Value Proposition</Label>
                        <p className="text-xs text-muted-foreground">Why will they buy it?</p>
                        <Textarea
                            rows={4}
                            value={canvas.value_prop}
                            onChange={e => handleChange('value_prop', e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Differentiation</Label>
                        <p className="text-xs text-muted-foreground">Why us? Why now?</p>
                        <Textarea
                            rows={4}
                            value={canvas.differentiation}
                            onChange={e => handleChange('differentiation', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* List Editors */}
                <ListEditor
                    title="Key Assumptions"
                    items={canvas.assumptions}
                    onChange={(i, v) => handleArrayChange('assumptions', i, v)}
                    onAdd={() => addArrayItem('assumptions')}
                />
                <ListEditor
                    title="Risks"
                    items={canvas.risks}
                    onChange={(i, v) => handleArrayChange('risks', i, v)}
                    onAdd={() => addArrayItem('risks')}
                />
                <ListEditor
                    title="MVP Scope"
                    items={canvas.mvp_scope}
                    onChange={(i, v) => handleArrayChange('mvp_scope', i, v)}
                    onAdd={() => addArrayItem('mvp_scope')}
                />
                <ListEditor
                    title="Success Metrics"
                    items={canvas.success_metrics}
                    onChange={(i, v) => handleArrayChange('success_metrics', i, v)}
                    onAdd={() => addArrayItem('success_metrics')}
                />
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <Button size="lg" onClick={handleSave} disabled={updateIdea.isPending} className="shadow-lg">
                    {updateIdea.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Canvas
                </Button>
            </div>
        </div>
    )
}

function ListEditor({ title, items, onChange, onAdd }: { title: string, items: string[], onChange: (i: number, v: string) => void, onAdd: () => void }) {
    return (
        <div className="space-y-2">
            <Label className="font-semibold">{title}</Label>
            <div className="space-y-2">
                {items.length === 0 && <div className="text-xs text-muted-foreground italic">List is empty.</div>}
                {items.map((item, i) => (
                    <Input
                        key={i}
                        value={item}
                        onChange={e => onChange(i, e.target.value)}
                        placeholder={`Item ${i + 1}...`}
                    />
                ))}
                <Button variant="outline" size="sm" onClick={onAdd} className="w-full text-xs border-dashed text-muted-foreground hover:text-foreground">
                    + Add Item
                </Button>
            </div>
        </div>
    )
}
