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
            <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-6 md:p-8 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </WorkspaceProvider>
    )
}
