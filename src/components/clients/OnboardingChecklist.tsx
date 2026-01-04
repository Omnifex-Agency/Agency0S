"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistProps {
    sections: any[]
    currentSection: string
    onSelect: (key: string) => void
}

export function OnboardingChecklist({ sections, currentSection, onSelect }: ChecklistProps) {
    const statusIcon = (status: string) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
            case 'waiting': return <Clock className="h-4 w-4 text-amber-500" />
            case 'changes_requested': return <AlertCircle className="h-4 w-4 text-red-500" />
            default: return <Circle className="h-4 w-4 text-muted-foreground/40" />
        }
    }

    const sectionLabels: Record<string, string> = {
        'basic_info': 'Basic Info',
        'requirements': 'Requirements',
        'assets': 'Assets',
        'access': 'Access',
        'billing': 'Billing'
    }

    // Calculate progress for sidebar header
    const doneCount = sections.filter(s => s.status === 'done').length
    const totalCount = sections.length
    const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-5 py-6 border-b">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-1">Checklist</h3>
                <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold tracking-tight">{pct}%</span>
                    <span className="text-xs text-muted-foreground mb-1">{doneCount} of {totalCount} done</span>
                </div>
                <div className="w-full bg-secondary h-1.5 mt-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {sections?.map((s) => (
                        <button
                            key={s.section_key}
                            onClick={() => onSelect(s.section_key)}
                            className={cn(
                                "group w-full flex items-center justify-between p-3 rounded-md text-sm transition-all border border-transparent text-left",
                                currentSection === s.section_key
                                    ? "bg-primary/5 border-primary/10 text-primary font-medium shadow-sm"
                                    : "hover:bg-muted/60 text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {statusIcon(s.status)}
                                <span className={cn(s.status === 'done' && currentSection !== s.section_key && "text-muted-foreground line-through decoration-muted-foreground/50")}>
                                    {sectionLabels[s.section_key] || s.section_key}
                                </span>
                            </div>
                            {currentSection === s.section_key && <ChevronRight className="h-3.5 w-3.5 text-primary/50 animate-in fade-in slide-in-from-left-1" />}
                        </button>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-muted/5">
                <div className="text-[10px] text-muted-foreground text-center">
                    Client Intake v1.0
                </div>
            </div>
        </div>
    )
}
