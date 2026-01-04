"use client"

import { useClient } from "@/hooks/useClients"
import { useOnboarding } from "@/hooks/useOnboarding"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OnboardingChecklist } from "@/components/clients/OnboardingChecklist"
import { SectionEditor } from "@/components/clients/SectionEditor"
import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Calendar, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatDistance, parseISO } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function ClientIntakePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const id = resolvedParams.id

    const { data: client, isLoading: clientLoading } = useClient(id)
    const { data: onboarding, isLoading: onboardingLoading } = useOnboarding(id)
    const [selectedSection, setSelectedSection] = useState("basic_info")
    const { toast } = useToast()

    // Find active section object
    const activeSection = onboarding?.sections?.find((s: any) => s.section_key === selectedSection)

    if (clientLoading || onboardingLoading) return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>
    if (!client) return <div>Client not found</div>

    const handleCopyFollowUp = () => {
        const pending = onboarding?.sections
            ?.filter((s: any) => s.status !== 'done')
            .map((s: any) => s.section_key)
            .join(", ") || "pending items"

        const text = `Hi ${client.primary_contact_name || 'there'} — quick check-in on onboarding. We are currently waiting on: ${pending}. Once we have those, we can move to the next step. Thanks!`

        navigator.clipboard.writeText(text)
        toast({ title: "Copied", description: "Follow-up template copied to clipboard." })
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
            {/* Header */}
            <header className="border-b bg-background px-6 py-4 shrink-0 flex justify-between items-center z-10">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{client.company_name}</h1>
                    <div className="flex gap-2 text-sm items-center">
                        <Badge variant="outline" className={`border-0 rounded-full uppercase text-[10px] tracking-wider font-bold ${client.stage === 'onboarding' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                client.stage === 'in_progress' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                            {client.stage.replace('_', ' ')}
                        </Badge>
                        {onboarding?.session && (
                            <span className="text-muted-foreground flex items-center gap-1">
                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <span className={onboarding.session.completion_percentage === 100 ? "text-green-600 font-medium" : ""}>
                                    {onboarding.session.completion_percentage}% Complete
                                </span>
                            </span>
                        )}
                    </div>
                </div>
                {/* Optional: Add Global Action like 'Archive Project' or 'Settings' here */}
            </header>

            {/* Main Layout - Grid for desktop to avoid heavy nesting flex issues */}
            <Tabs defaultValue="intake" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b bg-muted/40 backdrop-blur shrink-0">
                    <TabsList className="bg-transparent h-12 w-full justify-start gap-8 p-0 rounded-none">
                        <TabsTrigger value="intake" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 data-[state=active]:shadow-none font-medium">
                            Intake & Onboarding
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 data-[state=active]:shadow-none font-medium text-muted-foreground">
                            Projects
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="intake" className="flex-1 m-0 p-0 overflow-hidden outline-none data-[state=active]:flex">
                    <div className="grid grid-cols-12 h-full w-full">

                        {/* LEFT: Checklist (Sidebar) */}
                        <div className="col-span-3 border-r bg-background overflow-hidden flex flex-col">
                            <OnboardingChecklist
                                sections={onboarding?.sections || []}
                                currentSection={selectedSection}
                                onSelect={setSelectedSection}
                            />
                        </div>

                        {/* CENTER: Editor (Main) */}
                        <div className="col-span-6 bg-background/50 h-full flex flex-col overflow-hidden relative">
                            {/* Section Title Header */}
                            <div className="border-b px-8 py-4 bg-background/80 backdrop-blur sticky top-0 z-20">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-semibold capitalize">{selectedSection.replace('_', ' ')}</h2>
                                    {activeSection?.status === 'done' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100/80">Completed</Badge>}
                                </div>
                            </div>

                            {/* Scrollable Form Area */}
                            <div className="flex-1 overflow-y-auto px-8 py-6 pb-24">
                                {/* Added padding bottom to avoid overlap with fixed save bar if we used one, 
                                   but current SectionEditor puts save inside. 
                                   Let's constrain the width to keep it readable. */}
                                <div className="max-w-2xl mx-auto">
                                    {activeSection ? (
                                        <SectionEditor clientId={id} section={activeSection} />
                                    ) : (
                                        <div className="text-muted-foreground py-10 text-center">Select a section to begin.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Context (Sidebar) */}
                        <div className="col-span-3 border-l bg-muted/10 h-full flex flex-col overflow-y-auto">
                            <div className="p-4 space-y-6">
                                <Card className="shadow-sm border-muted-foreground/10 bg-background/50">
                                    <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</CardTitle></CardHeader>
                                    <CardContent className="px-4 pb-4">
                                        <div className="text-sm font-medium truncate">{client.primary_contact_name || "No Name"}</div>
                                        <div className="text-xs text-muted-foreground truncate">{client.primary_contact_email}</div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm border-muted-foreground/10 bg-background/50">
                                    <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Follow-Up</CardTitle></CardHeader>
                                    <CardContent className="space-y-3 px-4 pb-4">
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{client.last_followup_at ? formatDistance(parseISO(client.last_followup_at), new Date(), { addSuffix: true }) : 'Never'}</span>
                                        </div>
                                        <Button variant="secondary" size="sm" className="w-full justify-start h-8 text-xs" onClick={handleCopyFollowUp}>
                                            <Copy className="mr-2 h-3 w-3" /> Copy Template
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground">
                                            <Check className="mr-2 h-3 w-3" /> Mark Done
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm border-muted-foreground/10 bg-background/50">
                                    <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal Notes</CardTitle></CardHeader>
                                    <CardContent className="px-4 pb-4">
                                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{client.intake_notes || "No notes available."}</p>
                                    </CardContent>
                                </Card>

                                <div className="px-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Activity</h3>
                                    <div className="pl-2 border-l-2 border-muted space-y-4">
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 absolute -left-[13px] top-1.5 ring-4 ring-background" />
                                            <p className="text-xs text-foreground">Status updated to <span className="font-medium">In Progress</span></p>
                                            <p className="text-[10px] text-muted-foreground">2 hours ago</p>
                                        </div>
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-muted-foreground absolute -left-[13px] top-1.5 ring-4 ring-background" />
                                            <p className="text-xs text-foreground">Billing section completed</p>
                                            <p className="text-[10px] text-muted-foreground">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="flex-1 p-8 bg-muted/10 m-0">
                    <div className="max-w-4xl mx-auto text-center py-20">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowRight className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium">Projects Module</h3>
                        <p className="text-muted-foreground">Project management view coming in Phase 14.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
