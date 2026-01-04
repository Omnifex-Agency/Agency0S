import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StickyNote } from "lucide-react"

export default function NotesPage() {
    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
                    <p className="text-muted-foreground">
                        Capture thoughts, meeting minutes, and ideas.
                    </p>
                </div>
            </div>

            <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <StickyNote className="h-10 w-10 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-semibold">No notes created</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        You have not created any notes yet. Start by adding one.
                    </p>
                </div>
            </div>
        </div>
    )
}
