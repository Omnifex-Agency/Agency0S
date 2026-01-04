"use client"

import { use, useState, useEffect } from "react"
import { useSession, useSessionNotes, useAddNote, useUpdateNote, useDeleteNote } from "@/hooks/useIdeaStorm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Clock, Plus, Trash2, MoreVertical, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { BrainstormNote } from "@/types/idea-storm"
import { cn } from "@/lib/utils"

export default function SessionRoom({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const { data: session, isLoading } = useSession(resolvedParams.id)
    const { data: notes } = useSessionNotes(resolvedParams.id)

    // Timer Logic (Client-side simulation for offline MVP)
    const [timeLeft, setTimeLeft] = useState(session?.config.timer_minutes ? session.config.timer_minutes * 60 : 0)
    const [timerActive, setTimerActive] = useState(false)

    useEffect(() => {
        if (session) setTimeLeft(session.config.timer_minutes * 60)
    }, [session])

    useEffect(() => {
        let interval: any;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        } else if (timeLeft === 0) {
            setTimerActive(false)
        }
        return () => clearInterval(interval)
    }, [timerActive, timeLeft])

    if (isLoading) return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>
    if (!session) return <div className="p-8">Session not found</div>

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950/50">
            {/* Header / Toolbar */}
            <div className="border-b bg-background px-6 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/app/storm">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                            {session.topic}
                            <span className="text-xs font-normal text-muted-foreground uppercase px-2 py-0.5 border rounded-full">{session.method}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={cn("flex items-center gap-2 font-mono text-xl font-medium px-3 py-1 rounded bg-muted", timeLeft === 0 && "text-red-500")}>
                        <Clock className="h-4 w-4" />
                        {formatTime(timeLeft)}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTimerActive(!timerActive)}
                    >
                        {timerActive ? "Pause" : "Start"}
                    </Button>
                </div>
            </div>

            {/* Board Area */}
            <div className="flex-1 overflow-auto p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* Add Note Card */}
                    <AddNoteCard sessionId={session.id} />

                    {notes?.map(note => (
                        <StickyNote key={note.id} note={note} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function AddNoteCard({ sessionId }: { sessionId: string }) {
    const addNote = useAddNote()
    const [content, setContent] = useState("")

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        if (!content.trim()) return
        addNote.mutate({ sessionId, content, color: 'yellow' }) // default color
        setContent("")
    }

    return (
        <Card className="h-48 border-dashed border-2 flex flex-col p-4 bg-muted/20 hover:bg-muted/40 transition-colors">
            <textarea
                className="flex-1 bg-transparent resize-none outline-none placeholder:text-muted-foreground/50 text-sm"
                placeholder="Type an idea..."
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
            />
            <div className="flex justify-end mt-2">
                <Button size="sm" variant="ghost" onClick={handleSubmit} disabled={!content.trim()}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    )
}

function StickyNote({ note }: { note: BrainstormNote }) {
    const updateNote = useUpdateNote()
    const deleteNote = useDeleteNote()

    const handleVote = () => {
        updateNote.mutate({ id: note.id, updates: { votes: (note.votes || 0) + 1 } })
    }

    return (
        <Card className="h-48 flex flex-col p-4 bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-900 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex-1 text-sm font-medium leading-relaxed font-handwriting text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                {note.content}
            </div>

            <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs hover:bg-yellow-200 dark:hover:bg-yellow-900"
                    onClick={() => deleteNote.mutate(note.id)}
                >
                    <Trash2 className="h-3 w-3 text-red-400" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs hover:bg-yellow-200 dark:hover:bg-yellow-900 gap-1"
                    onClick={handleVote}
                >
                    <ThumbsUp className="h-3 w-3" />
                    {note.votes > 0 && <span>{note.votes}</span>}
                </Button>
            </div>

            {note.votes > 0 && (
                <div className="absolute top-2 right-2 bg-white/50 dark:bg-black/20 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    +{note.votes}
                </div>
            )}
        </Card>
    )
}
