import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { WorkspaceProvider } from "@/components/providers/WorkspaceProvider"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <WorkspaceProvider>
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
                <Sidebar />
                <div className="flex flex-col">
                    <Topbar />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-muted/20">
                        {children}
                    </main>
                </div>
            </div>
        </WorkspaceProvider>
    )
}
