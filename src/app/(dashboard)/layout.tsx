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
            <div className="flex min-h-screen w-full bg-[#0f172a] text-slate-50 font-sans selection:bg-indigo-500/30">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
                        {/* Background Gradients for Premium Feel */}
                        <div className="fixed inset-0 z-0 pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px]" />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </WorkspaceProvider>
    )
}
