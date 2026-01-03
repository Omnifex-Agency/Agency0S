"use client"

import { useState } from "react"
import { useSessions, useCreateSession } from "@/hooks/useIdeaStorm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, Clock, Plus, Zap, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function StormPage() {
    const { data: sessions, isLoading } = useSessions()

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Brainstorming</h1>
                    <p className="text-muted-foreground">Collaborative sessions for divergent thinking.</p>
                </div>
                <CreateSessionButton />
            </div>

            {isLoading ? (
                <div>Loading sessions...</div>
            ) : sessions?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg bg-muted/10 text-center">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <BrainCircuit className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No active storms</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">Start a "Crazy 8s" or "Free Flow" session to generate ideas.</p>
                    <CreateSessionButton />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions?.map(session => (
                        <Link key={session.id} href={`/app/storm/${session.id}`}>
                            <Card className="h-full hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-primary/50">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">
                                            {session.method}
                                        </Badge>
                                        <Badge variant={session.status === 'active' ? 'default' : 'outline'} className="uppercase text-[10px]">
                                            {session.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {session.topic}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>{session.config.timer_minutes}m</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>{session.participants.length}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 border-t text-xs text-muted-foreground flex justify-between">
                                    <span>Started {formatDistanceToNow(new Date(session.created_at))} ago</span>
                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

function CreateSessionButton() {
    const [open, setOpen] = useState(false)
    const createSession = useCreateSession()
    const [topic, setTopic] = useState("")

    const handleCreate = (method: string) => {
        if (!topic.trim()) return
        createSession.mutate({
            topic,
            method,
            config: { timer_minutes: method === 'crazy8s' ? 8 : 10, prompts: [], voting_enabled: true }
        })
        setOpen(false)
        setTopic("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Session
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Start a Brainstorm</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Session Topic</label>
                        <Input
                            placeholder="e.g. Q3 Marketing Stunts"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex flex-col items-start gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-left"
                            onClick={() => handleCreate('free')}
                        >
                            <Zap className="h-5 w-5 text-amber-500" />
                            <div>
                                <div className="font-semibold text-sm">Free Flow</div>
                                <div className="text-xs text-muted-foreground">Unlimited ideas, no constraints. Best for broad exploration.</div>
                            </div>
                        </button>
                        <button
                            className="flex flex-col items-start gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-left"
                            onClick={() => handleCreate('crazy8s')}
                        >
                            <Clock className="h-5 w-5 text-blue-500" />
                            <div>
                                <div className="font-semibold text-sm">Crazy 8s</div>
                                <div className="text-xs text-muted-foreground">8 ideas in 8 minutes. Rapid fire pressure cooker.</div>
                            </div>
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
