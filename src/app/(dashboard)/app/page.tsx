"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, CreditCard, Activity, DollarSign, TrendingUp, Target, FolderKanban, CheckCircle2 } from "lucide-react"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { StatusCard } from "@/components/client/StatusCard"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { motion } from "framer-motion"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

const chartData = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 19000 },
    { name: 'Mar', revenue: 15000 },
    { name: 'Apr', revenue: 25000 },
    { name: 'May', revenue: 22000 },
    { name: 'Jun', revenue: 30000 },
    { name: 'Jul', revenue: 28000 },
]

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useDashboardStats()

    const formatCurrency = (value: number) => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}k`
        }
        return `$${value}`
    }

    return (
        <motion.div
            className="flex flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Management Overview</h1>
                <p className="text-slate-500">Welcome back, <span className="text-primary font-medium">Agency Admin</span>. Here's your workspace health report.</p>
            </div>

            {/* Stats Row */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={itemVariants}>
                    <StatusCard
                        icon={Target}
                        label="Total Targets"
                        value={isLoading ? "-" : stats?.targets.toString() || "0"}
                        status="in-progress"
                        subtitle="Pipeline prospects"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatusCard
                        icon={FolderKanban}
                        label="Active Projects"
                        value={isLoading ? "-" : stats?.activeProjects.toString() || "0"}
                        status="on-track"
                        subtitle="Currently in progress"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatusCard
                        icon={Users}
                        label="Active Clients"
                        value={isLoading ? "-" : stats?.clients.toString() || "0"}
                        status="completed"
                        subtitle="Revenue generating"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatusCard
                        icon={DollarSign}
                        label="Project Value"
                        value={isLoading ? "-" : formatCurrency(stats?.revenue || 0)}
                        status="on-track"
                        subtitle="Total active budget"
                    />
                </motion.div>
            </div>

            {/* Main Section */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Revenue Overview - Spans 2 columns */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-slate-900">Agency Momentum</CardTitle>
                                    <CardDescription className="text-slate-500">
                                        Operational throughput across active workspaces
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <Activity className="w-3 h-3 text-indigo-500" />
                                    Live tracking
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-10">
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.chartData || chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                            itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Workspace Activity */}
                <motion.div variants={itemVariants}>
                    <Card className="border-slate-200 shadow-sm h-full bg-white">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-slate-900">Workspace Activity</CardTitle>
                            <CardDescription className="text-slate-500">
                                Latest significant system events
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <RecentActivity />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* System Status Footer */}
            <motion.div variants={itemVariants}>
                <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-lg">
                    <div className="relative z-10">
                        <h3 className="text-xl font-semibold mb-2">Internal Agency Operations</h3>
                        <p className="text-slate-400 max-w-md">Deep visibility into targets, pipeline, and strategic outcomes for your management team.</p>
                    </div>
                    <div className="flex gap-4 relative z-10 w-full md:w-auto">
                        <div className="flex-1 md:flex-none px-5 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">System Health</p>
                                <p className="text-sm font-medium">Stable</p>
                            </div>
                        </div>
                        <div className="flex-1 md:flex-none px-5 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                            <Users className="w-5 h-5 text-sky-400" />
                            <div>
                                <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Active Users</p>
                                <p className="text-sm font-medium">12 Online</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>
            </motion.div>
        </motion.div>
    )
}
