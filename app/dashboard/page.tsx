"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../components/Logo";
import toast from "react-hot-toast";
import { LogOut, User, Video, Settings, History, Notebook, BarChart2, Mic, MicOff, Calendar, MessageCircle, ChevronRight } from "lucide-react";
import AnamVideoCallInterface from "../components/AnamVideoCallInterface";
import NotesSidebar from "../components/NotesSidebar";
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useAnalytics } from "@/lib/useAnalytics";

export default function Dashboard() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [callActive, setCallActive] = useState(false);
    const [activeView, setActiveView] = useState<"counseling" | "history">("counseling");
    const [showNotes, setShowNotes] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<any>(null);
    const [transcripts, setTranscripts] = useState<any[]>([]);
    const [selectedTranscript, setSelectedTranscript] = useState<any | null>(null);
    const [transcriptsLoading, setTranscriptsLoading] = useState(false);
    const [transcriptsError, setTranscriptsError] = useState("");
    const [micTesting, setMicTesting] = useState(false);
    const [micMuted, setMicMuted] = useState(false);
    const [micLevel, setMicLevel] = useState(0);
    const [micError, setMicError] = useState("");
    const micStreamRef = useRef<MediaStream | null>(null);
    const micAudioContextRef = useRef<AudioContext | null>(null);
    const micAnimationRef = useRef<number | null>(null);

    const PERSONAS = [
        {
            id: 'emily',
            name: 'Emily',
            role: 'Career Counselor',
            image: '/emily.png',
            avatarId: "bdaaedfa-00f2-417a-8239-8bb89adec682",
            voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
            systemPrompt: "You are Emily, a friendly and empathetic AI career counselor. Your goal is to help students discover their potential and guide them towards suitable career paths. Be encouraging, patient, and ask thoughtful questions to understand their interests and strengths.",
            enabled: true,
            description: "Your personal guide to finding the perfect career path."
        },
        {
            id: 'zola',
            name: 'Zola',
            role: 'Psychological Wellness Guide',
            image: 'https://cdn.prod.website-files.com/65e89895c5a4b8d764c0d70e/689f38ab7db4f5e12a64c5ae_Zola-2.jpg',
            enabled: false,
            description: "Stress support, emotional awareness, coping strategies, and confidence during difficult moments. (Coming Soon)"
        },
        {
            id: 'jordan',
            name: 'Jordan',
            role: 'Academic Coach',
            image: '/jordan-counselor.png',
            enabled: false,
            description: "Study habits, academic confidence, and career goal support. (Coming Soon)"
        },
        {
            id: 'milo',
            name: 'Milo',
            role: 'Music Mentor',
            image: '/music-mentor.png',
            enabled: false,
            description: "Creativity, music careers, and artistic discipline. (Coming Soon)"
        }
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        // Ensure language is set from local storage if available
        const storedLang = localStorage.getItem("i18nextLng");
        if (storedLang && i18n.language !== storedLang) {
            i18n.changeLanguage(storedLang);
        }

        if (!token || !userData) {
            router.push("/signin");
            return;
        }

        setUser(JSON.parse(userData));
        setLoading(false);
        // Set default persona
        setSelectedPersona(PERSONAS[0]);
    }, [router]);

    const stopMicTest = () => {
        if (micAnimationRef.current) {
            cancelAnimationFrame(micAnimationRef.current);
            micAnimationRef.current = null;
        }

        micStreamRef.current?.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;

        if (micAudioContextRef.current && micAudioContextRef.current.state !== "closed") {
            micAudioContextRef.current.close().catch(() => undefined);
        }
        micAudioContextRef.current = null;

        setMicTesting(false);
        setMicMuted(false);
        setMicLevel(0);
    };

    useEffect(() => stopMicTest, []);

    const startMicTest = async () => {
        try {
            setMicError("");

            if (!navigator.mediaDevices?.getUserMedia) {
                setMicError("Microphone test is not supported in this browser.");
                return;
            }

            stopMicTest();
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            micStreamRef.current = stream;
            setMicTesting(true);
            setMicMuted(false);

            const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextClass) {
                setMicLevel(100);
                return;
            }

            const audioContext = new AudioContextClass();
            micAudioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
                setMicLevel(Math.min(100, Math.round((average / 128) * 100)));
                micAnimationRef.current = requestAnimationFrame(updateLevel);
            };

            updateLevel();
        } catch (error) {
            console.error("Microphone test failed:", error);
            setMicError("Microphone is blocked or unavailable. Allow microphone access in your browser and try again.");
            stopMicTest();
        }
    };

    const toggleMicTestMute = () => {
        const nextMuted = !micMuted;
        micStreamRef.current?.getAudioTracks().forEach((track) => {
            track.enabled = !nextMuted;
        });
        setMicMuted(nextMuted);
        setMicLevel(0);
    };

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
            localStorage.removeItem("languageSelected"); // Reset language selection on logout
            router.push("/signin");
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("languageSelected"); // Reset language selection on logout
            router.push("/signin");
        }
    };

    const startCall = (persona?: any) => {
        stopMicTest();
        const activePersona = persona || selectedPersona;
        if (persona) {
            setSelectedPersona(persona);
            trackEvent('counselor_selected', { counselor: persona.name, personaId: persona.id });
        }
        trackEvent('session_start', { counselor: activePersona?.name || 'Unknown' });
        setCallActive(true);
    };

    const endCall = () => {
        trackEvent('session_end', { counselor: selectedPersona?.name || 'Unknown' });
        setCallActive(false);
    };

    const fetchTranscripts = async () => {
        try {
            setTranscriptsLoading(true);
            setTranscriptsError("");
            const res = await fetch("/api/anam/transcript", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to load session history");
            }

            const json = await res.json();
            const nextTranscripts = json.transcripts || [];
            setTranscripts(nextTranscripts);
            setSelectedTranscript(nextTranscripts[0] || null);
        } catch (error) {
            console.error("Failed to fetch transcripts:", error);
            setTranscriptsError("Could not load session history.");
        } finally {
            setTranscriptsLoading(false);
        }
    };

    const openHistory = () => {
        setActiveView("history");
        fetchTranscripts();
    };

    const clearTranscripts = async () => {
        if (!window.confirm("Clear all saved session history for this account?")) return;

        try {
            setTranscriptsLoading(true);
            setTranscriptsError("");
            const res = await fetch("/api/anam/transcript", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                }
            });

            if (!res.ok) {
                throw new Error("Failed to clear session history");
            }

            setTranscripts([]);
            setSelectedTranscript(null);
            toast.success("Session history cleared");
        } catch (error) {
            console.error("Failed to clear transcripts:", error);
            setTranscriptsError("Could not clear session history.");
            toast.error("Could not clear session history");
        } finally {
            setTranscriptsLoading(false);
        }
    };

    const formatTranscriptDate = (dateString: string) => {
        return new Date(dateString).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (callActive) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-950">
                <AnamVideoCallInterface
                    onEndCall={endCall}
                    personaConfig={selectedPersona ? {
                        personaId: selectedPersona.personaId,
                        avatarId: selectedPersona.avatarId,
                        voiceId: selectedPersona.voiceId,
                        systemPrompt: selectedPersona.systemPrompt
                    } : undefined}
                    language={i18n.language || 'en'}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-20 hidden lg:block">
                <div className="p-6">
                    <Link href="/">
                        <div className="text-primary">
                            <Logo className="w-32" />
                        </div>
                    </Link>
                </div>

                <nav className="px-4 space-y-2 mt-4">
                    <button
                        type="button"
                        onClick={() => setActiveView("counseling")}
                        className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === "counseling" ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                        <Video size={20} />
                        {t('dashboard.sidebar.counseling')}
                    </button>
                    <button
                        type="button"
                        onClick={openHistory}
                        className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeView === "history" ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                        <History size={20} />
                        {t('dashboard.sidebar.history')}
                    </button>
                    {user?.role === 'admin' && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl font-medium transition-colors">
                            <BarChart2 size={20} />
                            Admin Dashboard
                        </Link>
                    )}
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <Settings size={20} />
                        {t('dashboard.sidebar.settings')}
                    </a>
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full"
                    >
                        <LogOut size={20} />
                        {t('dashboard.sidebar.sign_out')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800">{t('dashboard.header.title')}</h1>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {user?.name?.[0] || "U"}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-bold text-slate-700">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Sign out"
                            title="Sign out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-4 md:p-8">
                    {activeView === "counseling" ? (
                        // Pre-call state
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    {t('dashboard.welcome', { name: user?.name || 'User' })}
                                </h2>
                                <p className="text-slate-600 text-lg">
                                    {t('dashboard.subtitle')}
                                </p>
                            </div>

                            {/* Choose Counselor Section */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <User size={24} className="text-orange-500" />
                                    {t('dashboard.choose_counselor')}
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {PERSONAS.map((persona) => (
                                        <button
                                            key={persona.id}
                                            disabled={!persona.enabled}
                                            onClick={() => startCall(persona)}
                                            className={`group relative rounded-2xl overflow-hidden transition-all duration-300 text-left ${persona.enabled
                                                ? "hover:shadow-xl hover:-translate-y-1 ring-2 ring-transparent hover:ring-orange-500 cursor-pointer"
                                                : "opacity-60 cursor-not-allowed grayscale"
                                                } bg-white shadow-sm border border-slate-100`}
                                        >
                                            <div className="aspect-square relative overflow-hidden bg-slate-100">
                                                <img
                                                    src={persona.image}
                                                    alt={persona.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                {!persona.enabled && (
                                                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                                        <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                                            {t('dashboard.coming_soon')}
                                                        </span>
                                                    </div>
                                                )}
                                                {persona.enabled && (
                                                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <span className="bg-orange-600 text-white px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                            {t('dashboard.start_session')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-slate-900 mb-1">{persona.name}</h4>
                                                <p className="text-xs text-orange-600 font-semibold mb-2 uppercase tracking-wider">{persona.role}</p>
                                                <p className="text-xs text-slate-500 line-clamp-2">{persona.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 md:col-span-3">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${micTesting ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                                                {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 mb-1">Microphone Check</h3>
                                                <p className="text-slate-600 text-sm">
                                                    {micTesting ? "Your microphone is connected. Speak to test the input level before starting." : "Test your microphone before starting a live avatar session."}
                                                </p>
                                                {micError && <p className="mt-2 text-sm font-medium text-red-600">{micError}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {!micTesting ? (
                                                <button
                                                    onClick={startMicTest}
                                                    className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-700"
                                                >
                                                    Test Microphone
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={toggleMicTestMute}
                                                        className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors ${micMuted ? "bg-green-600 hover:bg-green-700" : "bg-slate-800 hover:bg-slate-900"}`}
                                                    >
                                                        {micMuted ? "Turn Audio On" : "Turn Audio Off"}
                                                    </button>
                                                    <button
                                                        onClick={stopMicTest}
                                                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                                                    >
                                                        Stop Test
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full transition-all duration-100 ${micMuted ? "bg-slate-300" : "bg-gradient-to-r from-green-500 to-orange-500"}`}
                                            style={{ width: `${micMuted ? 0 : micLevel}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{t('dashboard.available')}</h3>
                                        <p className="text-slate-600 text-xs text-balance">{t('dashboard.available_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{t('dashboard.private')}</h3>
                                        <p className="text-slate-600 text-xs text-balance">{t('dashboard.private_desc')}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{t('dashboard.personalized')}</h3>
                                        <p className="text-slate-600 text-xs text-balance">{t('dashboard.personalized_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">Session History</h2>
                                    <p className="mt-2 text-slate-600">Saved transcripts from your AI counselor sessions.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={fetchTranscripts}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Refresh
                                    </button>
                                    <button
                                        onClick={clearTranscripts}
                                        disabled={transcripts.length === 0 || transcriptsLoading}
                                        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Clear History
                                    </button>
                                </div>
                            </div>

                            {transcriptsLoading ? (
                                <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                                    <p className="font-medium text-slate-500">Loading session history...</p>
                                </div>
                            ) : transcriptsError ? (
                                <div className="rounded-2xl border border-red-100 bg-white p-8 text-center text-red-600 shadow-sm">
                                    {transcriptsError}
                                </div>
                            ) : transcripts.length === 0 ? (
                                <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                                    <MessageCircle className="mx-auto mb-4 h-10 w-10 text-slate-300" />
                                    <p className="font-semibold text-slate-700">No saved sessions yet.</p>
                                    <p className="mt-2 text-sm text-slate-500">Start and end a counselor session to save its transcript here.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                                        <div className="border-b border-slate-100 p-4">
                                            <p className="font-bold text-slate-900">{transcripts.length} saved sessions</p>
                                        </div>
                                        <div className="max-h-[620px] overflow-y-auto">
                                            {transcripts.map((transcript) => (
                                                <button
                                                    key={transcript._id}
                                                    onClick={() => setSelectedTranscript(transcript)}
                                                    className={`flex w-full items-start justify-between gap-3 border-b border-slate-100 p-4 text-left transition-colors hover:bg-orange-50 ${selectedTranscript?._id === transcript._id ? "bg-orange-50" : "bg-white"}`}
                                                >
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{transcript.personaId || "Counselor session"}</p>
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                            <Calendar size={12} />
                                                            {formatTranscriptDate(transcript.createdAt)}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">{transcript.messages?.length || 0} messages</p>
                                                    </div>
                                                    <ChevronRight className="mt-1 h-4 w-4 text-slate-400" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="min-h-[620px] rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                        {selectedTranscript ? (
                                            <>
                                                <div className="mb-6 border-b border-slate-100 pb-4">
                                                    <h3 className="text-xl font-bold text-slate-900">{selectedTranscript.personaId || "Counselor session"}</h3>
                                                    <p className="mt-1 text-sm text-slate-500">{formatTranscriptDate(selectedTranscript.createdAt)}</p>
                                                </div>
                                                <div className="space-y-4">
                                                    {selectedTranscript.messages?.map((message: any, index: number) => (
                                                        <div
                                                            key={`${message.timestamp}-${index}`}
                                                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                                        >
                                                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-900"}`}>
                                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                                <p className={`mt-2 text-xs ${message.role === "user" ? "text-orange-100" : "text-slate-500"}`}>
                                                                    {formatTranscriptDate(message.timestamp)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-slate-500">Select a session to view its transcript.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <NotesSidebar show={showNotes} onClose={() => setShowNotes(false)} />
                <button
                    onClick={() => setShowNotes(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-orange-600 text-white rounded-full shadow-xl hover:bg-orange-700 hover:scale-110 transition-all z-40 flex items-center justify-center font-bold"
                    title="Open Notes"
                >
                    <Notebook size={24} />
                </button>
            </main>

        </div>
    );
}
