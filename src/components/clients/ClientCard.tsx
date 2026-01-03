import Link from "next/link"
import { Building, MoreHorizontal, User, CheckCircle2, AlertCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

// Loose type for mock
interface ClientCardProps {
    client: any
}

export function ClientCard({ client }: ClientCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'onboarding': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            case 'in_progress': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            case 'lead': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getOnboardingIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case 'submitted': return <Clock className="h-4 w-4 text-blue-500" />
            case 'incomplete': return <AlertCircle className="h-4 w-4 text-amber-500" />
            default: return <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden border-t-4" style={{ borderTopColor: client.stage === 'onboarding' ? '#3b82f6' : 'transparent' }}>
            <Link href={`/app/clients/${client.id}`} className="absolute inset-0 z-10" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold truncate pr-4">
                    {client.company_name}
                </CardTitle>
                <Badge variant="outline" className={`border-0 uppercase text-[10px] tracking-wider font-bold ${getStatusColor(client.stage)}`}>
                    {client.stage.replace('_', ' ')}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4">
                    {getOnboardingIcon(client.onboarding_status)}
                    <span className="text-sm text-muted-foreground capitalize">
                        {client.onboarding_status ? client.onboarding_status.replace('_', ' ') : 'No Status'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5" />
                        <span className="truncate">{client.industry || "General"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate">{client.primary_contact_name || "No Contact"}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 border-t bg-muted/5 flex justify-between items-center text-xs text-muted-foreground h-10">
                <span>Updated {formatDate(client.updated_at)}</span>
                {client.priority === 'high' && <span className="font-bold text-red-500">HIGH PRIORITY</span>}
            </CardFooter>
        </Card>
    )
}
