<<<<<<< HEAD
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, CreditCard, Activity, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
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
=======
import { StatusCard } from "@/components/client/StatusCard"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { Users, FolderKanban, TrendingUp, CheckCircle2, DollarSign, Activity, Target } from "lucide-react"
>>>>>>> cbd75e5 (feat: enhance auth UI with light theme, role-based setup, and UI component fixes)

export default function AdminDashboardPage() {
    return (
<<<<<<< HEAD
        <motion.div
            className="flex flex-col gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <div className="text-sm text-slate-400">
                    Welcome back, <span className="text-indigo-400">Agency Admin</span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Revenue", icon: DollarSign, value: "$45,231.89", sub: "+20.1% from last month", color: "text-indigo-400" },
                    { title: "Active Clients", icon: Users, value: "+2350", sub: "+180.1% from last month", color: "text-teal-400" },
                    { title: "Project Sales", icon: CreditCard, value: "+12,234", sub: "+19% from last month", color: "text-indigo-400" },
                    { title: "Active Tasks", icon: Activity, value: "+573", sub: "+201 since last hour", color: "text-teal-400" }
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className="glass-panel border-0 text-slate-100">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                                    {stat.sub}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Bento Grid - Main Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
                {/* Main Chart - Spans 4 columns */}
                <motion.div variants={itemVariants} className="col-span-4 h-full">
                    <Card className="glass-panel border-0 h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Revenue Overview</CardTitle>
                            <CardDescription className="text-slate-400">
                                Monthly revenue performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-0 flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#475569"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#475569"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.4} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity - Spans 3 columns */}
                <motion.div variants={itemVariants} className="col-span-3">
                    <Card className="glass-panel border-0 text-slate-100 h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription className="text-slate-400">
                                Latest actions in this workspace.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity />
                        </CardContent>
                    </Card>
                </motion.div>
=======
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Management Overview</h1>
                <p className="text-sm text-slate-500">Global workspace health and agency operations</p>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    icon={Target}
                    label="Total Targets"
                    value="24"
                    status="in-progress"
                    subtitle="8 ready to pitch"
                />
                <StatusCard
                    icon={FolderKanban}
                    label="Active Projects"
                    value="12"
                    status="on-track"
                    subtitle="All systems healthy"
                />
                <StatusCard
                    icon={Users}
                    label="Client Entities"
                    value="8"
                    status="completed"
                    subtitle="2 recently onboarded"
                />
                <StatusCard
                    icon={DollarSign}
                    label="Monthly Revenue"
                    value="$42.5k"
                    status="on-track"
                    subtitle="+12% from last month"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Momentum Chart View */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Agency Momentum</h2>
                            <p className="text-sm text-slate-500 mt-1">Operational throughput across all active workspaces</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 italic text-xs text-slate-500">
                                <Activity className="w-3 h-3" />
                                Live tracking
                            </div>
                        </div>
                    </div>

                    <div className="h-[320px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <TrendingUp className="w-12 h-12 opacity-20" />
                        <div className="text-center">
                            <p className="font-medium">Performance Visualization</p>
                            <p className="text-sm opacity-60">Revenue and project momentum tracking coming soon</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Mini-Feed */}
                <div className="bg-white rounded-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Workspace Activity</h2>
                        <p className="text-sm text-slate-500 mt-1">Latest significant system events</p>
                    </div>

                    <RecentActivity />
                </div>
            </div>

            {/* System Status Indicators */}
            <div className="bg-slate-900 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-2">Internal Agency Operations</h3>
                    <p className="text-slate-400 max-w-md">The management dashboard provides deep visibility into targets, pipeline, and strategic outcomes.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">System Health</p>
                            <p className="text-sm font-medium">Stable</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/10 flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Active Users</p>
                            <p className="text-sm font-medium">12 Online</p>
                        </div>
                    </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
>>>>>>> cbd75e5 (feat: enhance auth UI with light theme, role-based setup, and UI component fixes)
            </div>
        </motion.div>
    )
}
