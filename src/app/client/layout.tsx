import { ClientSidebar } from "@/components/client/ClientSidebar";
import { UserMenu } from "@/components/layout/UserMenu";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <ClientSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 italic">Connected Workspace</span>
                    </div>
                    <UserMenu />
                </header>
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
