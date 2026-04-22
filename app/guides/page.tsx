"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Logo } from "../components/Logo";
import { ArrowLeft, Phone, Video, Mic } from "lucide-react";

const AVATARS = [

    {
        id: 3,
        name: "Matthew McConaughey",
        role: "The Visionary Philanthropist",
        image: "/p1.jpeg",
        desc: "Focuses on global impact, strategic thinking, and finding solutions to complex world problems.",
        color: "bg-orange-500"
    },
    {
        id: 4,
        name: "Emily",
        role: "The Empathetic Guide",
        image: "/emily.png",
        desc: "Your personal career counselor, ready to help you discover your path.",
        color: "bg-blue-500"
    },
    {
        id: 5,
        name: "Mia",
        role: "The Support Specialist",
        image: "/mia.png",
        desc: "Focuses on providing exceptional support and ensuring your satisfaction every step of the way.",
        color: "bg-orange-500"
    },
    {
        id: 6,
        name: "Alex",
        role: "The Career Navigator",
        image: "/counselor-avatar.jpg",
        desc: "Focuses on long-term career planning, goal setting, and helping you find the right professional path.",
        color: "bg-orange-600"
    },
    {
        id: 7,
        name: "Naruto Uzumaki",
        role: "The Resilience Mentor",
        image: "/naruto_uzumaki.jpeg",
        desc: "Focuses on perseverance, never giving up on your dreams, and the power of friendship and hard work.",
        color: "bg-orange-400"
    },
    {
        id: 8,
        name: "Monkey D. Luffy",
        role: "The Freedom Seeker",
        image: "/straw_hat_luffy.jpeg",
        desc: "Focuses on pure ambition, the value of freedom, and protecting one's crew and dreams at all costs.",
        color: "bg-red-500"
    },
    {
        id: 9,
        name: "Son Goku",
        role: "The Limit Breaker",
        image: "/sonuGoku.jpeg",
        desc: "Focuses on continuous self-improvement, facing challenges with a smile, and protecting the innocent.",
        color: "bg-yellow-600"
    },
    {
        id: 10,
        name: "Kakashi Hatake",
        role: "The Tactical Strategist",
        image: "/kakashi_hakate.jpeg",
        desc: "Focuses on teamwork, calmness under pressure, and learning from past experiences to build a better future.",
        color: "bg-blue-400"
    },
    {
        id: 11,
        name: "Yami Yugi",
        role: "The Mental Fortitude Expert",
        image: "/yami_hugi.jpeg",
        desc: "Focuses on strategic brilliance, the heart of the cards (confidence), and overcoming inner shadows.",
        color: "bg-purple-600"
    }
];

export default function GuidesPage() {
    const router = useRouter();
    const [activeAvatar, setActiveAvatar] = useState(AVATARS[0]);

    const navigateTo = (path: string) => {
        if (path === 'home') {
            router.push('/');
        } else if (path.startsWith('#')) {
            router.push(`/${path}`);
        } else {
            router.push(`/${path}`);
        }
    };

    const openAuth = (type: 'student' | 'school', mode: 'login' | 'signup' = 'login') => {
        if (mode === 'signup') {
            router.push(`/signup?type=${type}`);
        } else {
            router.push(`/signin?type=${type}`);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">
            <Navbar onNavigate={navigateTo} onAuth={openAuth} />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-12">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 hover:bg-orange-50 rounded-full transition-colors text-slate-600 hover:text-primary"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">Pathlight Counselors</h1>
                            <p className="text-slate-600">Choose the Pathlight Counselor best suited to your academic and career path.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Guides List */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {AVATARS.map((avatar) => (
                                <div
                                    key={avatar.id}
                                    className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 ${activeAvatar.id === avatar.id ? 'ring-4 ring-primary ring-offset-4' : 'bg-slate-100'}`}
                                    onClick={() => setActiveAvatar(avatar)}
                                >
                                    <div className="aspect-[3/4] overflow-hidden">
                                        <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                        <h3 className="text-white font-bold text-xl">{avatar.name}</h3>
                                        <p className="text-white/80 text-sm font-medium mb-2">{avatar.role}</p>
                                        <p className="text-white/60 text-xs line-clamp-2 mb-4">{avatar.desc}</p>
                                        <div className={`rounded-lg p-2 flex items-center justify-center text-white text-xs font-bold transition-colors ${activeAvatar.id === avatar.id ? 'bg-primary' : 'bg-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-primary'}`}>
                                            {activeAvatar.id === avatar.id ? 'Selected' : 'View Profile'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <div className="relative w-full aspect-[9/16] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-900 ring-1 ring-slate-900/10">
                                    <div className="absolute inset-0">
                                        <img
                                            key={activeAvatar.id}
                                            src={activeAvatar.image}
                                            alt="Active Avatar"
                                            className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
                                    </div>

                                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-stretch rounded-lg overflow-hidden shadow-lg border border-white/10">
                                                <div className="w-10 flex items-center justify-center bg-slate-800 relative">
                                                    <Mic size={16} className="text-white z-10" />
                                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary"></div>
                                                </div>
                                                <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-md flex items-center border-l border-white/5">
                                                    <span className="text-sm font-bold text-white tracking-wide">AI ICON</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-6">
                                            <div className="space-y-1">
                                                <h3 className="text-white text-2xl font-bold">{activeAvatar.name}</h3>
                                                <p className="text-white/70 text-sm">{activeAvatar.role}</p>
                                            </div>

                                            <div className="flex items-center justify-center gap-6">
                                                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                                    <Mic size={20} />
                                                </button>
                                                <button
                                                    onClick={() => openAuth('student', 'signup')}
                                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 hover:from-orange-500 hover:to-primary text-white flex items-center justify-center shadow-xl shadow-orange-500/40 transform hover:scale-110 transition-all animate-pulse"
                                                >
                                                    <Phone size={32} className="fill-current" />
                                                </button>
                                                <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                                    <Video size={20} />
                                                </button>
                                            </div>
                                            <p className="text-white/50 text-xs">Tap call button to start chat</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-orange-50 rounded-3xl border border-orange-100">
                                    <h4 className="font-bold text-slate-900 mb-2">Pathlight Counselors</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Choose the Pathlight Counselor best suited to your academic and career path.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer onNavigate={navigateTo} />
        </div>
    );
}
