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

export default function DashboardPage() {
    return (
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
            </div>
        </motion.div>
    )
}
