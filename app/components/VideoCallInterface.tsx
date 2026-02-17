"use client";

import { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Loader2, Notebook, Send, Sparkles, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import NotesSidebar from "./NotesSidebar";

interface VideoCallInterfaceProps {
    onEndCall: () => void;
    personaConfig?: {
        replicaId: string;
        personaId: string;
    };
}

interface Message {
    role: "user" | "counselor";
    content: string;
    timestamp: Date;
}

export default function VideoCallInterface({ onEndCall, personaConfig }: VideoCallInterfaceProps) {
    const [connecting, setConnecting] = useState(true);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationUrl, setConversationUrl] = useState<string>("");
    const [sessionId, setSessionId] = useState<string>("");
    const [muted, setMuted] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false); // Mobile chat state
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Notes State
    const [showNotes, setShowNotes] = useState(false);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        startCall();
    }, []);

    const startCall = async () => {
        debugger
        try {
            setConnecting(true);
            setError(null);

            // Get user info
            const userData = localStorage.getItem("user");
            const user = userData ? JSON.parse(userData) : {};

            // Initialize Tavus conversation
            const response = await fetch("/api/ai/career-counselor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "initialize",
                    userInfo: {
                        name: user.name || "Student",
                        email: user.email || "",
                        careerGoals: "Exploring career options",
                        experienceLevel: "student"
                    },
                    personaConfig
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create session");
            }

            const data = await response.json();

            if (data.conversationUrl) {
                setConversationUrl(data.conversationUrl);
            }

            setSessionId(data.conversationId);
            setConnected(true);
            setConnecting(false);

            // Add initial greeting
            const greeting: Message = {
                role: "counselor",
                content: `🎉 Hey ${user.name || 'there'}! I'm your AI Career Counselor, and I'm absolutely thrilled to help you explore your career path today! I can see you and I'm here to guide you with energy, enthusiasm, and personalized insights through both video and chat! So tell me - what's on your mind? What career dreams are you thinking about? Let's dive in and make some exciting discoveries together!`,
                timestamp: new Date()
            };
            setMessages([greeting]);

            toast.success("Connected! Video session started 🎥");
        } catch (err: any) {
            console.error("Failed to start call:", err);
            setError(err.message || "Failed to connect");
            setConnecting(false);
            toast.error("Failed to connect to counselor");
        }
    };

    const toggleMute = () => {
        setMuted(!muted);
        toast.success(muted ? "Microphone unmuted" : "Microphone muted");
    };

    const toggleVideo = () => {
        setVideoEnabled(!videoEnabled);
        toast.success(videoEnabled ? "Camera off" : "Camera on");
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || loading) return;

        // Add user message
        const userMessage: Message = {
            role: "user",
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);

        try {
            const response = await fetch("/api/ai/career-counselor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "get-response",
                    userInfo: {
                        sessionId,
                        userMessage: inputValue
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                const counselorMessage: Message = {
                    role: "counselor",
                    content: data.response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, counselorMessage]);
            }
        } catch (error) {
            toast.error("Failed to get response");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEndCall = () => {
        toast.success("Session ended - great work today!");
        onEndCall();
    };

    return (
        <div className="relative w-full h-full flex flex-col lg:flex-row gap-2 lg:gap-4 bg-slate-50 rounded-2xl overflow-hidden">
            {/* Video Section */}
            <div className="w-full h-full lg:w-2/3 lg:h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden relative shrink-0">
                {/* Connecting Overlay */}
                {connecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/95 z-20">
                        <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                        <p className="text-white text-xl font-bold">Connecting to your AI Counselor...</p>
                        <p className="text-slate-300 text-sm">Setting up video session</p>
                    </div>
                )}

                {/* Error State */}
                {error && !connecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/95 z-20">
                        <VideoOff className="w-16 h-16 text-red-500" />
                        <p className="text-white text-xl font-bold">Connection Failed</p>
                        <p className="text-slate-300 text-sm">{error}</p>
                        <button
                            onClick={startCall}
                            className="mt-4 px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Video Display */}
                {connected && !error && (
                    <>
                        {conversationUrl ? (
                            /* Tavus Video iframe */
                            <iframe
                                ref={iframeRef}
                                src={conversationUrl}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                className="w-full h-full"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            /* Fallback AI Counselor Display */
                            <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-orange-500 shadow-2xl">
                                        <img
                                            src="/emily.png"
                                            alt="AI Career Counselor"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">AI Career Counselor</h3>
                                    <p className="text-orange-200 text-sm">Live Session Active</p>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-green-300 text-sm font-medium">Listening & Watching</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 w-full justify-center px-4 overflow-x-auto">

                            {/* Mute Button */}
                            <button
                                onClick={toggleMute}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg flex-shrink-0 ${muted
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-slate-700/90 hover:bg-slate-600 backdrop-blur-md"
                                    }`}
                                title={muted ? "Unmute" : "Mute"}
                            >
                                {muted ? (
                                    <MicOff className="w-6 h-6 text-white" />
                                ) : (
                                    <Mic className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* Video Toggle Button */}
                            <button
                                onClick={toggleVideo}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg flex-shrink-0 ${!videoEnabled
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-slate-700/90 hover:bg-slate-600 backdrop-blur-md"
                                    }`}
                                title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                            >
                                {videoEnabled ? (
                                    <Video className="w-6 h-6 text-white" />
                                ) : (
                                    <VideoOff className="w-6 h-6 text-white" />
                                )}
                            </button>

                            {/* End Call Button */}
                            <button
                                onClick={handleEndCall}
                                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg flex-shrink-0"
                                title="End Session"
                            >
                                <PhoneOff className="w-6 h-6 text-white" />
                            </button>

                            {/* Notes Button */}
                            <button
                                onClick={() => setShowNotes(true)}
                                className="w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center transition-all shadow-lg hidden sm:flex flex-shrink-0"
                                title="Open Notes"
                            >
                                <Notebook className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-sm font-medium">Live Session</span>
                        </div>
                    </>
                )}
            </div>

            {/* Chat Section - Overlay on Mobile, Side-by-side on Desktop */}
            <div className={`
                fixed inset-x-0 bottom-0 h-[70vh] z-40 lg:static lg:h-full lg:w-1/3 lg:z-auto
                transition-transform duration-300 ease-in-out
                ${isChatOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
                flex flex-col bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl lg:shadow-xl overflow-hidden border-t-2 lg:border-2 border-orange-100
            `}>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6" />
                        <div>
                            <h3 className="font-bold text-lg">Live Chat</h3>
                            <p className="text-orange-100 text-xs">Ask questions anytime</p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsChatOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <div className="w-6 h-1 bg-white/50 rounded-full"></div>
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/30 to-white">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl ${message.role === "user"
                                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-none shadow-md"
                                    : "bg-white text-gray-900 rounded-bl-none border-2 border-orange-200 shadow-sm"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                <span className={`text-xs mt-2 block ${message.role === "user" ? "opacity-80" : "opacity-60"}`}>
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border-2 border-orange-200 shadow-sm">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t-2 border-orange-100 p-3 bg-white shrink-0 pb-safe">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2.5 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors text-slate-800 text-sm"
                            disabled={loading || !connected}
                        // autoFocus - Remove autofocus to prevent keyboard from popping up on chat open on mobile
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim() || !connected}
                            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 font-medium"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-2 text-center lg:hidden">
                        Swipe down to close chat
                    </p>
                    <p className="text-xs text-slate-500 mt-2 text-center hidden lg:block">
                        💡 Chat while watching - I can see and hear you!
                    </p>
                </div>
            </div>

            {/* Mobile Backdrop for Chat */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsChatOpen(false)}
                />
            )}

            {/* Mobile Chat FAB - Stacked above Notes FAB */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-28 right-8 w-14 h-14 bg-orange-600 text-white rounded-full shadow-xl hover:bg-orange-700 hover:scale-110 transition-all z-30 lg:hidden flex items-center justify-center animate-in fade-in zoom-in duration-300"
                    title="Open Chat"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Notes Sidebar */}
            <NotesSidebar show={showNotes} onClose={() => setShowNotes(false)} />
        </div>
    );
}
