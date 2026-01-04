"use client"

import { useState } from "react"
import { useClients } from "@/hooks/useClients"
import { ClientCard } from "@/components/clients/ClientCard"
import { ClientTable } from "@/components/clients/ClientTable"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, LayoutGrid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function ClientList() {
    const { data: clients, isLoading, isError } = useClients()
    const [viewMode, setViewMode] = useState<"grid" | "table">("table") // Default to table as per spec "Tracker"

    // Filters
    const [search, setSearch] = useState("")
    const [stageFilter, setStageFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Filter Logic
    const filteredClients = clients?.filter((client: any) => {
        const matchesSearch = client.company_name.toLowerCase().includes(search.toLowerCase()) ||
            client.primary_contact_email?.toLowerCase().includes(search.toLowerCase())

        const matchesStage = stageFilter === "all" || client.stage === stageFilter
        const matchesStatus = statusFilter === "all" || client.onboarding_status === statusFilter

        return matchesSearch && matchesStage && matchesStatus
    })

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-[250px]" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Skeleton key={i} className="h-[150px] w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) return <div>Error loading clients</div>

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Search clients..."
                        className="h-9 w-[150px] lg:w-[250px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select value={stageFilter} onValueChange={setStageFilter}>
                        <SelectTrigger className="h-9 w-[130px]">
                            <SelectValue placeholder="Stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-9 w-[140px]">
                            <SelectValue placeholder="Onboarding" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="not_started">Not Started</SelectItem>
                            <SelectItem value="incomplete">Incomplete</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center border rounded-md p-1 bg-muted/20">
                    <Button
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode('table')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            {!filteredClients?.length ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <h3 className="text-lg font-semibold">No clients found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <ClientTable clients={filteredClients} />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredClients.map((client: any) => (
                                <ClientCard key={client.id} client={client} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
