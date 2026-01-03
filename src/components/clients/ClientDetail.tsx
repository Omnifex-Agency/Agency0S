"use client"

import { useClient } from "@/hooks/useClients"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Globe, Mail, Phone, MapPin, Edit } from "lucide-react"

interface ClientDetailProps {
    clientId: string
}

export function ClientDetail({ clientId }: ClientDetailProps) {
    const { data: client, isLoading, isError } = useClient(clientId)

    if (isLoading) {
        return <Skeleton className="h-[600px] w-full" />
    }

    if (isError || !client) {
        return <div>Error loading client details.</div>
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{client.company_name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mt-2">
                        <div className="flex items-center gap-1 text-sm">
                            <Building className="h-4 w-4" />
                            {client.industry || "No Industry"}
                        </div>
                        {client.website && (
                            <div className="flex items-center gap-1 text-sm">
                                <Globe className="h-4 w-4" />
                                <a href={client.website} target="_blank" rel="noreferrer" className="hover:underline">
                                    {client.website.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                    <Button>Add Project</Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{client.health_score ?? "N/A"}/100</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$0.00</div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contacts</CardTitle>
                            <CardDescription>Key people at this company.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">No contacts added yet.</p>
                            {/* Contact List would go here */}
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Placeholder contents for other tabs */}
                <TabsContent value="pipeline">
                    <Card>
                        <CardHeader><CardTitle>Leads & Opportunities</CardTitle></CardHeader>
                        <CardContent><p>Pipeline view coming soon.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="research">
                    <Card>
                        <CardHeader><CardTitle>Research & Documents</CardTitle></CardHeader>
                        <CardContent><p>Research view coming soon.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="projects">
                    <Card>
                        <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
                        <CardContent><p>Projects view coming soon.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="tasks">
                    <Card>
                        <CardHeader><CardTitle>Tasks</CardTitle></CardHeader>
                        <CardContent><p>Tasks view coming soon.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notes">
                    <Card>
                        <CardHeader><CardTitle>Notes & Meetings</CardTitle></CardHeader>
                        <CardContent><p>Notes view coming soon.</p></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
