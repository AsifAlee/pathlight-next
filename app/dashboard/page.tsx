"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "../components/Logo";
import toast from "react-hot-toast";
import { LogOut, User, Video, Settings, History, Notebook, Phone } from "lucide-react";
import AnamVideoCallInterface from "../components/AnamVideoCallInterface";
import NotesSidebar from "../components/NotesSidebar";
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Dashboard() {
    const { t } = useTranslation();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [callActive, setCallActive] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<any>(null);

    const PERSONAS = [
        {
            id: 'matthew',
            name: 'Matthew McConaughey',
            role: 'Motivational Coach',
            image: '/counselor-avatar.jpg',
            // Default Cara/Matthew
            // Default Cara/Matthew
            // personaId: "30fa96\u2026" - This was acting as avatarId before
            avatarId: "30fa96d0-26c4-4e55-94a0-517025942e18",
            voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
            systemPrompt: "You are a friendly and professional career counselor named Matthew...",
            enabled: true,
            description: "Energetic and enthusiastic guidance to help you find your path!"
        },
        {
            id: 'hilda',
            name: 'Hilda Solis',
            role: 'Public Service & Policy',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Hilda_Solis_official_portrait.jpg/800px-Hilda_Solis_official_portrait.jpg',
            personaId: "ad6e01e0-3b30-47a1-8497-8b31827a355e",
            voiceId: "d79f2051-3a89-4fcc-8c71-cf5d53f9d9e0",
            // The prompt will be sent from here or handled in backend if not provided, but plan says send it.
            systemPrompt: "You are Hilda Solis, a dedicated public servant and former U.S. Secretary of Labor. Your goal is to mentor students interested in public service, community organizing, and government. Draw from your experience as the first Latina in the California State Senate and in the Obama administration. Be encouraging, emphasizing the importance of diverse voices in leadership. Guide them on civic engagement and career paths in policy.",
            enabled: true,
            description: "Expert guidance on public service, labor rights, and community leadership."
        },
        {
            id: 'bill',
            name: 'Bill Gates',
            role: 'Tech & Innovation',
            image: '/bill-gates.jpg',
            enabled: false,
            description: "Expert insights on technology and future trends. (Coming Soon)"
        },
        {
            id: 'jeff',
            name: 'Jeff Bezos',
            role: 'Business Strategy',
            image: '/jeff-bezos.jpg',
            enabled: false,
            description: "Mastering business scale and customer obsession. (Coming Soon)"
        },
        {
            id: 'elon',
            name: 'Elon Musk',
            role: 'Visionary',
            image: '/elon.jpg',
            enabled: false,
            description: "Thinking big and solving hard problems. (Coming Soon)"
        }
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            router.push("/signin");
            return;
        }

        setUser(JSON.parse(userData));
        setLoading(false);
        // Set default persona
        setSelectedPersona(PERSONAS[0]);
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

            toast.success(t('nav.logout') + " successful"); // Simple fallback or add key
            router.push("/signin");
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/signin");
        }
    };

    const startCall = (persona?: any) => {
        if (persona) {
            setSelectedPersona(persona);
        }
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
                    <Link href="/">
                        <div className="text-primary">
                            <Logo className="w-32" />
                        </div>
                    </Link>
                </div>

                <nav className="px-4 space-y-2 mt-4">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-medium">
                        <Video size={20} />
                        {t('dashboard.sidebar.counseling')}
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                        <History size={20} />
                        {t('dashboard.sidebar.history')}
                    </a>
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
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-4 md:p-8">
                    {!callActive ? (
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
                        // Active call state
                        <div className="h-[calc(100vh-180px)]">
                            <AnamVideoCallInterface
                                onEndCall={endCall}
                                personaConfig={selectedPersona ? {
                                    // Explicitly map properties - only once
                                    personaId: selectedPersona.personaId,
                                    avatarId: selectedPersona.avatarId,
                                    voiceId: selectedPersona.voiceId,
                                    systemPrompt: selectedPersona.systemPrompt
                                } : undefined}
                            />
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
