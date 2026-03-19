"use client";

import { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Loader2, Notebook, Send, MessageCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import NotesSidebar from "./NotesSidebar";
import { createClient, AnamClient, AnamEvent } from "@anam-ai/js-sdk";
import { PersonaConfig } from "@anam-ai/js-sdk/dist/module/types";

interface AnamVideoCallInterfaceProps {
    onEndCall: () => void;
    personaConfig?: {
        personaId?: string;
        avatarId?: string;
        voiceId?: string;
        systemPrompt?: string;
        llmId?: string;
    };
    language?: string;
}

interface Message {
    role: "user" | "counselor";
    content: string;
    timestamp: Date;
}

export default function AnamVideoCallInterface({ onEndCall, personaConfig, language = 'en' }: AnamVideoCallInterfaceProps) {
    const [connecting, setConnecting] = useState(true);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [muted, setMuted] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Anam State
    const videoRef = useRef<HTMLVideoElement>(null);
    const anamClientRef = useRef<AnamClient | null>(null);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesRef = useRef<Message[]>([]); // Ref to hold latest messages for unmount/end call
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Notes State
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Keep messagesRef updated so stopCall has latest state
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        const abortController = new AbortController();
        startCall(abortController.signal);

        return () => {
            abortController.abort();
            stopCall();
            // Reset connection state on unmount
            setConnected(false);
        };
    }, []);

    const stopCall = async () => {
        if (anamClientRef.current) {
            try {
                // Save transcript before stopping
                if (messagesRef.current.length > 0) {
                    await fetch("/api/anam/transcript", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                        },
                        body: JSON.stringify({
                            sessionId: (anamClientRef.current as any).sessionId || "unknown",
                            personaId: personaConfig?.personaId || "unknown",
                            messages: messagesRef.current
                        })
                    }).catch(err => console.error("Failed to save transcript:", err));
                }

                await anamClientRef.current.stopStreaming();
            } catch (error) {
                console.error("Error stopping stream:", error);
            }
            anamClientRef.current = null;
        }
        setConnected(false);
    };

    const startCall = async (signalOrEvent?: AbortSignal | React.MouseEvent) => {
        const signal = signalOrEvent instanceof AbortSignal ? signalOrEvent : undefined;

        try {
            setConnecting(true);
            setError(null);

            // 1. Get Session Token
            // Inject language instruction into system prompt
            let updatedSystemPrompt = personaConfig?.systemPrompt || "";
            if (language === 'es') {
                updatedSystemPrompt += " IMPORTANT: You MUST speak in Spanish (Español).";
            } else if (language === 'ja') {
                updatedSystemPrompt += " IMPORTANT: You MUST speak in Japanese (日本語).";
            }

            const activePersonaConfig = {
                ...personaConfig,
                systemPrompt: updatedSystemPrompt
            };

            const tokenResponse = await fetch("/api/anam/session-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify({
                    personaConfig: activePersonaConfig
                }),
                signal
            });

            if (!tokenResponse.ok) {
                throw new Error("Failed to get session token");
            }

            const { sessionToken } = await tokenResponse.json();

            // Check if aborted before continuing (though fetch would normally throw)
            if (signal?.aborted) return;

            // 2. Initialize Anam Client
            const client = createClient(sessionToken, {
                // Options can be added here if needed, e.g. disableInputAudio: false
            });

            anamClientRef.current = client;

            // 3. Start Streaming
            if (videoRef.current) {
                await client.streamToVideoElement("anam-video-element");
            }

            // 4. Attach Event Listeners (if applicable type definitions allow)
            setConnected(true);
            setConnecting(false);

            // Initial greeting
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            let greetingContent = `🎉 Hey ${user.name || 'there'}! I'm your AI Career Counselor. I'm here to help you explore your career path!`;

            if (language === 'es') {
                greetingContent = `🎉 ¡Hola ${user.name || ''}! Soy tu Consejero de Carrera de IA. ¡Estoy aquí para ayudarte a explorar tu camino profesional!`;
            } else if (language === 'ja') {
                greetingContent = `🎉 こんにちは、${user.name || ''}さん！私はあなたのAIキャリアカウンセラーです。あなたのキャリアパスを探るお手伝いをします！`;
            }

            const greeting: Message = {
                role: "counselor",
                content: greetingContent,
                timestamp: new Date()
            };
            setMessages([greeting]);

            // Add event listener for message history
            client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (history: any[]) => {
                // history is array of messages from Anam
                const formattedMessages: Message[] = history.map(msg => ({
                    role: msg.role === 'persona' ? 'counselor' : 'user',
                    content: msg.content,
                    timestamp: new Date()
                }));
                // Prepend our custom greeting to the history
                setMessages([greeting, ...formattedMessages]);
            });

            toast.success("Connected to session! 🎥");

        } catch (err: any) {
            // Ignore abort errors
            if (err.name === 'AbortError') {
                // console.log("Anam call aborted");
                return;
            }

            console.error("Failed to start Anam call:", err);

            // Do not set error if we are already connected (handling race condition where one succeeds)
            if (!connected) {
                setError(err.message || "Failed to connect");
                setConnecting(false);
                toast.error("Failed to connect to counselor");
            }
        }
    };

    const toggleMute = () => {
        if (!anamClientRef.current) return;

        try {
            if (muted) {
                anamClientRef.current.unmuteInputAudio();
                toast.success("Microphone unmuted");
            } else {
                anamClientRef.current.muteInputAudio();
                toast.success("Microphone muted");
            }
            setMuted(!muted);
        } catch (e) {
            console.error("Error toggling mute", e);
        }
    };

    // Anam SDK might not support toggling user video in the same way as simple WebRTC, 
    // usually it controls the *avatar's* video or the user's *input* audio.
    // Assuming videoEnabled controls the user's camera visibility to themself or just UI state for now
    // since Anam is primarily about the avatar. 
    // If Anam SDK has input video (for vision capability), we'd toggle that.
    // For now, we'll keep the UI state.
    const toggleVideo = () => {
        setVideoEnabled(!videoEnabled);
        toast.success(videoEnabled ? "Camera off" : "Camera on");
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || !anamClientRef.current) return;

        const userMessage: Message = {
            role: "user",
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);

        try {
            // Anam SDK likely has a method to send text message to the persona
            // Based on d.ts: talk(content: string) makes the persona speak
            // sendUserMessage(content: string) sends a user text message

            anamClientRef.current.sendUserMessage(userMessage.content);

            // We might need to listen for events to get the response text back if we want to display it
            // For now, we assume the avatar speaking is the response.
            // If we want to display the text response, we'd need an event listener for 'message_received' or similar.

            setLoading(false);
        } catch (error) {
            toast.error("Failed to send message");
            console.error(error);
            setLoading(false);
        }
    };

    // To handle receiving messages (transcript), we would ideally attach a listener
    // useEffect(() => {
    //    if (anamClientRef.current) {
    //        anamClientRef.current.addListener(AnamEvent.MESSAGE_RECEIVED, (event) => {
    //             // handle incoming message
    //        });
    //    }
    // }, [anamClientRef.current]);


    const handleEndCall = () => {
        stopCall();
        toast.success("Session ended");
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
                        <p className="text-white text-xl font-bold">Connecting to your Counselor...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !connecting && !connected && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/95 z-20">
                        <PhoneOff className="w-16 h-16 text-red-500" />
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

                {/* Video Element */}
                <div className={`w-full h-full relative ${(!connected && !connecting) ? 'hidden' : ''}`}>
                    <video
                        id="anam-video-element"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>

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

                    {/* Video Toggle Button (stubbed for Anam) */}
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
            </div>

            {/* Chat Section */}
            <div className={`
                fixed inset-y-0 left-0 w-80 max-w-[85vw] h-full z-40 lg:static lg:h-full lg:w-1/3 lg:z-auto
                transition-transform duration-300 ease-in-out
                ${isChatOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col bg-white shadow-2xl lg:shadow-xl overflow-hidden border-r-2 lg:border-2 border-orange-100
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
                        <X size={24} />
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
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim() || !connected}
                            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 font-medium"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Mobile Backdrop for Chat */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsChatOpen(false)}
                />
            )}

            {/* Mobile Chat FAB */}
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
