"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "../components/Logo";
import toast from "react-hot-toast";
import { LogOut, User, Video, Settings, History } from "lucide-react";
import VideoCallInterface from "../components/VideoCallInterface";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [callActive, setCallActive] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/signin");
            return;
        }

        setUser(JSON.parse(userData));
        setLoading(false);
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            toast.success("Logged out successfully");
            router.push("/signin");
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/signin");
        }
    };

    const startCall = () => {
        setCallActive(true);
    };

    const endCall = () => {
        setCallActive(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-20 hidden lg:block">
                <div className="p-6">
                    <Logo className="w-32" />
                </div>

                <nav className="px-4 space-y-2 mt-4">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-medium">
                        <Video size={20} />
                        Counseling
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <History size={20} />
                        Session History
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <Settings size={20} />
                        Settings
                    </a>
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800">AI Counseling Session</h1>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {user?.name?.[0] || "U"}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-bold text-slate-700">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">
                    {!callActive ? (
                        // Pre-call state
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    Welcome, {user?.name}! 👋
                                </h2>
                                <p className="text-slate-600 text-lg">
                                    Your AI counselor is ready to support you. Start a session whenever you need to talk.
                                </p>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                        <Video size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">24/7 Available</h3>
                                    <p className="text-slate-600 text-sm">Connect with your AI counselor anytime, day or night</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                        <User size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">100% Private</h3>
                                    <p className="text-slate-600 text-sm">Your conversations are completely confidential</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                        <Settings size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized</h3>
                                    <p className="text-slate-600 text-sm">Tailored support based on your unique needs</p>
                                </div>
                            </div>

                            {/* Start Call Button */}
                            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-12 text-center text-white shadow-xl">
                                <h3 className="text-2xl font-bold mb-4">Ready to talk?</h3>
                                <p className="text-white/90 mb-8 max-w-md mx-auto">
                                    Click the button below to start a video session with your AI counselor.
                                    Make sure your microphone is enabled.
                                </p>
                                <button
                                    onClick={startCall}
                                    className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl active:scale-95 inline-flex items-center gap-3"
                                >
                                    <Video size={24} />
                                    Start Session
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Active call state
                        <div className="h-[calc(100vh-180px)]">
                            <VideoCallInterface onEndCall={endCall} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
