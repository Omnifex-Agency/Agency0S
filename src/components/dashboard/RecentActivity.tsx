"use client"

import { useState } from "react"
import { useActivityLog } from "@/hooks/useActivityLog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export function RecentActivity() {
    const [limit, setLimit] = useState(20)
    const { data: activities, isLoading, isFetching } = useActivityLog({ limit })

    if (isLoading && limit === 20) {
        return (
            <div className="space-y-8">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="ml-4 space-y-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-3 w-[100px]" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!activities?.length) {
        return <p className="text-sm text-muted-foreground">No recent activity.</p>
    }

    return (
        <div className="space-y-4">
            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2">
                {activities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>{activity.user_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {activity.user_name || "User"} <span className="text-muted-foreground">{activity.action}</span> {activity.entity_type} {activity.entity_name ? <span className="font-semibold">{activity.entity_name}</span> : ""}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {activities.length >= limit && (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setLimit(prev => prev + 20)}
                    disabled={isFetching}
                >
                    {isFetching ? "Loading..." : "Load older events"}
                </Button>
            )}
        </div>
    )
}
