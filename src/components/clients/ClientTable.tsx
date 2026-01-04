"use client"

import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface ClientTableProps {
    clients: any[]
}

export function ClientTable({ clients }: ClientTableProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'onboarding': return 'default' // blue-ish usually or black
            case 'in_progress': return 'secondary' // green-ish
            case 'lead': return 'outline'
            default: return 'secondary'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'onboarding': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200'
            case 'in_progress': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200'
            case 'lead': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Onboarding</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Last Follow-up</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell className="font-medium">
                                <Link href={`/app/clients/${client.id}`} className="hover:underline">
                                    {client.company_name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`border-0 uppercase text-[10px] tracking-wider font-bold ${getStatusColor(client.stage)}`}>
                                    {client.stage?.replace('_', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="capitalize text-sm">{client.onboarding_status?.replace('_', ' ')}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {client.priority}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                        {(client.owner_id || 'U').substring(0, 1).toUpperCase()}
                                    </div>
                                    {/* You could map owner_id to name here if mock data had it */}
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                                {client.last_followup_at ? formatDate(client.last_followup_at) : '-'}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            Delete client
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
