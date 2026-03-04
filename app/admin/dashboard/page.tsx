"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../../components/Logo";
import toast from "react-hot-toast";
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
    Users, Video, Eye, UserPlus, BarChart2, TrendingUp,
    LogOut, Activity, Clock, Zap
} from "lucide-react";

interface Summary {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    totalSignups: number;
}

interface AnalyticsData {
    summary: Summary;
    recentEvents: Array<{
        _id: string;
        event: string;
        userEmail: string | null;
        metadata: Record<string, unknown>;
        createdAt: string;
    }>;
    eventsByDay: Array<{ date: string; count: number }>;
    sessionsByCounselor: Array<{ name: string; sessions: number }>;
    topEvents: Array<{ event: string; count: number }>;
}

const EVENT_COLORS: Record<string, string> = {
    page_view: "#94a3b8",
    session_start: "#f97316",
    session_end: "#fb923c",
    counselor_selected: "#f59e0b",
    signup: "#22c55e",
    signin: "#3b82f6",
};

function eventColor(event: string) {
    return EVENT_COLORS[event] || "#a78bfa";
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={26} className="text-white" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-0.5">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{typeof value === "number" ? value.toLocaleString() : value}</p>
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
            router.push("/signin");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== "admin") {
                toast.error("Access denied: Admins only");
                router.push("/dashboard");
                return;
            }
            fetchAnalytics(token);
        } catch (e) {
            router.push("/signin");
        }
    }, [router]);

    const fetchAnalytics = async (token: string) => {
        try {
            setLoading(true);
            const res = await fetch("/api/analytics/summary", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push("/dashboard");
                    return;
                }
                throw new Error("Failed to fetch analytics");
            }
            const json = await res.json();
            setData(json);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/signin");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                    <p className="text-slate-500 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-red-100">
                    <Activity size={48} className="text-red-400 mx-auto mb-4" />
                    <p className="text-slate-700 font-semibold text-lg mb-4">Failed to load analytics</p>
                    <p className="text-slate-500 text-sm mb-6">{error}</p>
                    <button onClick={() => {
                        const token = localStorage.getItem("token");
                        if (token) fetchAnalytics(token);
                    }} className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { summary, recentEvents, eventsByDay, sessionsByCounselor, topEvents } = data!;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-20 hidden lg:flex flex-col">
                <div className="p-6">
                    <Link href="/">
                        <div className="text-primary">
                            <Logo className="w-32" />
                        </div>
                    </Link>
                </div>

                <nav className="px-4 space-y-2 mt-2 flex-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <Video size={20} />
                        User Dashboard
                    </Link>
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-medium">
                        <BarChart2 size={20} />
                        Admin Analytics
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                            <BarChart2 size={22} className="text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
                            <p className="text-xs text-slate-400">Real-time user activity</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const token = localStorage.getItem("token");
                            if (token) fetchAnalytics(token);
                        }}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 px-4 py-2 rounded-xl transition-all"
                    >
                        <Zap size={15} />
                        Refresh
                    </button>
                </header>

                <div className="p-4 md:p-8 space-y-8">
                    {/* Summary Cards */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                            <StatCard icon={Users} label="Total Users" value={summary.totalUsers} color="bg-blue-500" />
                            <StatCard icon={Video} label="Counseling Sessions" value={summary.totalSessions} color="bg-orange-500" />
                            <StatCard icon={Eye} label="Page Views" value={summary.totalPageViews} color="bg-purple-500" />
                            <StatCard icon={UserPlus} label="Signups" value={summary.totalSignups} color="bg-green-500" />
                        </div>
                    </section>

                    {/* Charts Row */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Events Over Time */}
                        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Activity Over Time</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Total events per day — last 30 days</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                                    <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                                        <TrendingUp size={12} /> Live
                                    </span>
                                </div>
                            </div>
                            {eventsByDay.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={eventsByDay} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                                            tickFormatter={(v) => v.slice(5)}
                                            dy={8}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontSize: 12 }}
                                            cursor={{ stroke: "#fed7aa", strokeWidth: 2 }}
                                            labelFormatter={(l) => `Date: ${l}`}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            name="Events"
                                            stroke="#f97316"
                                            strokeWidth={3}
                                            dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-56 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl">
                                    No data yet — events will appear here once users interact with the app.
                                </div>
                            )}
                        </div>

                        {/* Sessions by Counselor */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="mb-6">
                                <h3 className="text-base font-bold text-slate-900">Sessions by Counselor</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Which AI guides are most popular</p>
                            </div>
                            {sessionsByCounselor.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={sessionsByCounselor} margin={{ top: 5, right: 5, bottom: 5, left: -25 }} barSize={28}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                                            dy={8}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontSize: 12 }}
                                            cursor={{ fill: "#fff7ed" }}
                                        />
                                        <Bar dataKey="sessions" name="Sessions" fill="#f97316" radius={[6, 6, 6, 6]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-56 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl">
                                    No sessions started yet.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Bottom Row */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Top Event Types */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <h3 className="text-base font-bold text-slate-900 mb-5">Top Event Types</h3>
                            {topEvents.length > 0 ? (
                                <div className="space-y-3">
                                    {topEvents.map((e: { event: string; count: number }, i: number) => {
                                        const max = topEvents[0]?.count || 1;
                                        const pct = Math.round((e.count / max) * 100);
                                        return (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-slate-700 font-mono text-xs">{e.event}</span>
                                                    <span className="text-slate-500 font-bold">{e.count.toLocaleString()}</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${pct}%`, backgroundColor: eventColor(e.event) }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-40 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl">
                                    No events recorded yet.
                                </div>
                            )}
                        </div>

                        {/* Recent Events Feed */}
                        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold text-slate-900">Recent Events</h3>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={12} /> Latest 20
                                </span>
                            </div>
                            {recentEvents.length > 0 ? (
                                <div className="overflow-x-auto -mx-2">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                                <th className="text-left pb-3 pl-2">Event</th>
                                                <th className="text-left pb-3">User</th>
                                                <th className="text-left pb-3">Details</th>
                                                <th className="text-right pb-3 pr-2">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {recentEvents.map((ev: any) => (
                                                <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-2.5 pl-2">
                                                        <span
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: eventColor(ev.event) + "22",
                                                                color: eventColor(ev.event),
                                                            }}
                                                        >
                                                            {ev.event}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 text-slate-600 text-xs max-w-[120px] truncate">
                                                        {ev.userEmail || <span className="text-slate-300">anonymous</span>}
                                                    </td>
                                                    <td className="py-2.5 text-slate-400 text-xs max-w-[160px] truncate font-mono">
                                                        {ev.metadata && Object.keys(ev.metadata).length > 0
                                                            ? Object.entries(ev.metadata)
                                                                .map(([k, v]) => `${k}: ${v}`)
                                                                .join(", ")
                                                            : "—"}
                                                    </td>
                                                    <td className="py-2.5 pr-2 text-right text-xs text-slate-400 whitespace-nowrap">
                                                        {new Date(ev.createdAt).toLocaleString([], {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="h-40 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl">
                                    No events recorded yet. Use the app to start tracking!
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
