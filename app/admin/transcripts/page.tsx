"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../../components/Logo";
import toast from "react-hot-toast";
import {
    Video, BarChart2, LogOut, MessageCircle, ChevronRight, User as UserIcon, Calendar, Activity, Info
} from "lucide-react";

interface Message {
    _id: string;
    role: "user" | "counselor";
    content: string;
    timestamp: string;
}

interface Transcript {
    _id: string;
    userId: string;
    userEmail: string;
    sessionId: string;
    personaId: string;
    messages: Message[];
    createdAt: string;
}

export default function TranscriptsPage() {
    const router = useRouter();
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");


        if (!userStr || !token) {
            router.push("/signin");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            // console.log('user is:', user)
            if (user.role !== "admin") {
                toast.error("Access denied: Admins only");
                router.push("/dashboard");
                return;
            }
            fetchTranscripts(token);
        } catch (e) {
            router.push("/signin");
        }
    }, [router]);

    const fetchTranscripts = async (token: string) => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/transcripts", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push("/dashboard");
                    return;
                }
                throw new Error("Failed to fetch transcripts");
            }
            const json = await res.json();
            if (json.success) {
                setTranscripts(json.transcripts);
                if (json.transcripts.length > 0) {
                    setSelectedTranscript(json.transcripts[0]);
                }
            } else {
                throw new Error(json.message);
            }
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
                    <p className="text-slate-500 font-medium">Loading transcripts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-red-100">
                    <Activity size={48} className="text-red-400 mx-auto mb-4" />
                    <p className="text-slate-700 font-semibold text-lg mb-4">Failed to load transcripts</p>
                    <p className="text-slate-500 text-sm mb-6">{error}</p>
                    <button onClick={() => {
                        const token = localStorage.getItem("token");
                        if (token) fetchTranscripts(token);
                    }} className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden flex flex-col h-screen">
            {/* Sidebar (Desktop) */}
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
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <BarChart2 size={20} />
                        Admin Analytics
                    </Link>
                    <Link href="/admin/transcripts" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-medium">
                        <MessageCircle size={20} />
                        Transcripts
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

            {/* Main Content Area */}
            <main className="lg:ml-64 flex-1 flex flex-col min-h-0 bg-white">

                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                            <MessageCircle size={22} className="text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Conversation Transcripts</h1>
                            <p className="text-xs text-slate-400">Review user interactions with AI Counselors</p>
                        </div>
                    </div>
                </header>

                {/* 2-Column Split View */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Column: Session List */}
                    <div className="w-full md:w-1/3 lg:w-80 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0 overflow-y-auto">
                        <div className="p-4 border-b border-slate-200 bg-white">
                            <h2 className="text-sm font-semibold text-slate-700">Recent Sessions</h2>
                            <p className="text-xs text-slate-500">{transcripts.length} total sessions</p>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {transcripts.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No transcripts available yet.
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-200">
                                    {transcripts.map((transcript) => (
                                        <li key={transcript._id}>
                                            <button
                                                onClick={() => setSelectedTranscript(transcript)}
                                                className={`w-full text-left p-4 hover:bg-orange-50 transition-colors flex flex-col gap-2 relative ${selectedTranscript?._id === transcript._id ? 'bg-orange-50/80' : 'bg-white'
                                                    }`}
                                            >
                                                {selectedTranscript?._id === transcript._id && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-slate-900 truncate pr-4">
                                                        {transcript.userEmail}
                                                    </span>
                                                    <ChevronRight size={16} className={`text-slate-400 ${selectedTranscript?._id === transcript._id ? 'text-orange-500' : ''}`} />
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(transcript.createdAt)}</span>
                                                    <span>{transcript.messages.length} msgs</span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Detail View */}
                    <div className="hidden md:flex flex-1 flex-col bg-slate-50/50">
                        {selectedTranscript ? (
                            <>
                                {/* Detail Header */}
                                <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
                                    <div>
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <UserIcon size={18} className="text-slate-400" />
                                            {selectedTranscript.userEmail}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                            <span>Session: {selectedTranscript.sessionId}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span>Persona: {selectedTranscript.personaId}</span>
                                        </p>
                                    </div>
                                    <div className="text-sm text-slate-500 flex flex-col items-end">
                                        <span className="font-medium text-slate-700">{formatDate(selectedTranscript.createdAt)}</span>
                                        <span className="text-xs">Duration/End Time</span>
                                    </div>
                                </div>

                                {/* Chat Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {selectedTranscript.messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                                            <Info size={32} />
                                            <p>No messages recorded for this session.</p>
                                        </div>
                                    ) : (
                                        selectedTranscript.messages.map((msg, idx) => (
                                            <div
                                                key={msg._id || idx}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                                    }`}>
                                                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                                        {msg.content}
                                                    </div>
                                                    <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {formatDate(msg.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <MessageCircle size={48} className="text-slate-200 mb-4" />
                                <p className="text-lg font-medium text-slate-500">Select a transcript to view</p>
                                <p className="text-sm">Choose from the list on the left.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>

        </div>
    );
}
