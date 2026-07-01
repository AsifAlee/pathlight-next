"use client";

import { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Loader2, Notebook, Send, MessageCircle, X, Maximize2, Minimize2 } from "lucide-react";
import toast from "react-hot-toast";
import NotesSidebar from "./NotesSidebar";
import { createClient, AnamClient } from "@anam-ai/js-sdk";

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

type ConnectionClosedReason =
    | "CONNECTION_CLOSED_CODE_NORMAL"
    | "CONNECTION_CLOSED_CODE_MICROPHONE_PERMISSION_DENIED"
    | "CONNECTION_CLOSED_CODE_SIGNALLING_CLIENT_CONNECTION_FAILURE"
    | "CONNECTION_CLOSED_CODE_WEBRTC_FAILURE"
    | "CONNECTION_CLOSED_CODE_SERVER_CLOSED_CONNECTION";

export default function AnamVideoCallInterface({ onEndCall, personaConfig, language = 'en' }: AnamVideoCallInterfaceProps) {
    const [connecting, setConnecting] = useState(true);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState("Requesting live avatar session...");
    const [muted, setMuted] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Anam State
    const rootRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const userCameraRef = useRef<HTMLVideoElement>(null);
    const anamClientRef = useRef<AnamClient | null>(null);
    const videoStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputAudioStreamRef = useRef<MediaStream | null>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);
    const sessionIdRef = useRef<string>(typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `session-${Date.now()}`);
    const saveInProgressRef = useRef(false);
    const lastSavedSignatureRef = useRef("");

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesRef = useRef<Message[]>([]); // Ref to hold latest messages for unmount/end call
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Notes State
    const [showNotes, setShowNotes] = useState(false);

    const formatConnectionError = (reason?: string, details?: string) => {
        switch (reason) {
            case "CONNECTION_CLOSED_CODE_MICROPHONE_PERMISSION_DENIED":
                return "Microphone access was denied. Allow microphone permission and try again.";
            case "CONNECTION_CLOSED_CODE_WEBRTC_FAILURE":
                return details || "The live avatar connection failed to start. Try again in Chrome or Edge.";
            case "CONNECTION_CLOSED_CODE_SERVER_CLOSED_CONNECTION":
                return details || "The live avatar session was closed by the server.";
            case "CONNECTION_CLOSED_CODE_SIGNALLING_CLIENT_CONNECTION_FAILURE":
                return "The live avatar signalling connection failed. Please try again.";
            default:
                return details || "Failed to connect to the live avatar.";
        }
    };

    const clearVideoStartTimeout = () => {
        if (videoStartTimeoutRef.current) {
            clearTimeout(videoStartTimeoutRef.current);
            videoStartTimeoutRef.current = null;
        }
    };

    const stopInputAudioStream = () => {
        inputAudioStreamRef.current?.getTracks().forEach((track) => track.stop());
        inputAudioStreamRef.current = null;
    };

    const stopUserCamera = () => {
        cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
        if (userCameraRef.current) {
            userCameraRef.current.srcObject = null;
        }
        setCameraStream(null);
        setVideoEnabled(false);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Keep messagesRef updated so stopCall has latest state
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        if (userCameraRef.current) {
            userCameraRef.current.srcObject = cameraStream;
        }
    }, [cameraStream]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        startCall(abortController.signal);

        return () => {
            abortController.abort();
            clearVideoStartTimeout();
            stopCall();
            // Reset connection state on unmount
            setConnected(false);
        };
        // startCall/stopCall close over the current persona config and are intentionally run once per mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveTranscript = async () => {
        if (saveInProgressRef.current || messagesRef.current.length === 0) return;

        const signature = JSON.stringify(messagesRef.current.map((message) => [
            message.role,
            message.content,
            new Date(message.timestamp).getTime()
        ]));

        if (signature === lastSavedSignatureRef.current) return;

        saveInProgressRef.current = true;
        try {
            const response = await fetch("/api/anam/transcript", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify({
                    sessionId: sessionIdRef.current,
                    personaId: personaConfig?.personaId || personaConfig?.avatarId || "emily",
                    messages: messagesRef.current
                }),
                keepalive: true
            });

            if (response.ok) {
                lastSavedSignatureRef.current = signature;
            }
        } catch (err) {
            console.error("Failed to save transcript:", err);
        } finally {
            saveInProgressRef.current = false;
        }
    };

    const stopCall = async () => {
        if (anamClientRef.current) {
            try {
                clearVideoStartTimeout();
                await saveTranscript();

                await anamClientRef.current.stopStreaming();
            } catch (error) {
                console.error("Error stopping stream:", error);
            }
            anamClientRef.current = null;
        }
        stopInputAudioStream();
        stopUserCamera();
        setConnected(false);
    };

    const startCall = async (signalOrEvent?: AbortSignal | React.MouseEvent) => {
        const signal = signalOrEvent instanceof AbortSignal ? signalOrEvent : undefined;

        try {
            setConnecting(true);
            setError(null);
            setConnectionStatus("Requesting live avatar session...");

            // 1. Get a server-generated Anam session token.
            const tokenResponse = await fetch("/api/anam/session-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify({
                    language
                }),
                signal
            });

            if (!tokenResponse.ok) {
                throw new Error("Failed to get session token");
            }

            const { sessionToken } = await tokenResponse.json();
            setConnectionStatus("Live avatar session created. Starting stream...");

            // Check if aborted before continuing (though fetch would normally throw)
            if (signal?.aborted) return;

            setConnectionStatus("Checking microphone access...");
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("Microphone access is not supported in this browser. Try Chrome or Edge.");
            }

            const inputAudioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            inputAudioStreamRef.current = inputAudioStream;
            setMuted(false);

            // 2. Initialize Anam Client
            const client = createClient(sessionToken, {
                disableInputAudio: false
            });

            anamClientRef.current = client;

            client.addListener("CONNECTION_ESTABLISHED", () => {
                setConnected(true);
                setConnectionStatus("Connection established. Waiting for avatar video...");
            });

            client.addListener("VIDEO_PLAY_STARTED", () => {
                clearVideoStartTimeout();
                setConnecting(false);
                setConnected(true);
                setError(null);
                setConnectionStatus("Avatar connected.");
            });

            client.addListener("CONNECTION_CLOSED", (reason: ConnectionClosedReason, details?: string) => {
                clearVideoStartTimeout();
                console.error("Anam connection closed:", reason, details);
                setConnected(false);
                setConnecting(false);
                setError(formatConnectionError(reason, details));
            });

            client.addListener("SERVER_WARNING", (warning: string) => {
                console.warn("Anam warning:", warning);
                setConnectionStatus(`Server warning: ${warning}`);
            });

            client.addListener("MIC_PERMISSION_DENIED", (details?: string) => {
                clearVideoStartTimeout();
                setConnected(false);
                setConnecting(false);
                setError(formatConnectionError("CONNECTION_CLOSED_CODE_MICROPHONE_PERMISSION_DENIED", details));
            });

            client.addListener("MIC_PERMISSION_PENDING", () => {
                setConnectionStatus("Waiting for microphone permission in your browser...");
            });

            client.addListener("MIC_PERMISSION_GRANTED", () => {
                setConnectionStatus("Microphone granted. Connecting live avatar...");
            });

            client.addListener("INPUT_AUDIO_STREAM_STARTED", () => {
                setConnectionStatus("Microphone connected. Emily can hear you.");
            });

            // 3. Start Streaming
            if (videoRef.current) {
                setConnectionStatus("Opening live avatar stream...");
                // The Anam docs support this second MediaStream argument, but the installed
                // SDK type definition is stale and only declares the first parameter.
                // @ts-expect-error Anam streamToVideoElement accepts a custom input stream.
                await client.streamToVideoElement("anam-video-element", inputAudioStream);
                setConnectionStatus("Microphone connected. Emily can hear you.");
                clearVideoStartTimeout();
                videoStartTimeoutRef.current = setTimeout(() => {
                    setConnecting(false);
                    setError("The live avatar session started, but no video appeared. This is usually a browser microphone/WebRTC/autoplay issue. Try Chrome or Edge, allow microphone access, and reload.");
                }, 15000);
            }

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
            messagesRef.current = [greeting];
            saveTranscript();

            // Add event listener for message history
            client.addListener("MESSAGE_HISTORY_UPDATED", (history: Array<{ role: string; content: string }>) => {
                // history is array of messages from Anam
                const formattedMessages: Message[] = history.map(msg => ({
                    role: msg.role === 'persona' ? 'counselor' : 'user',
                    content: msg.content,
                    timestamp: new Date()
                }));
                // Prepend our custom greeting to the history
                const nextMessages = [greeting, ...formattedMessages];
                setMessages(nextMessages);
                messagesRef.current = nextMessages;
                saveTranscript();
            });

            toast.success("Connected to session! 🎥");

        } catch (err: unknown) {
            // Ignore abort errors
            if (err instanceof Error && err.name === 'AbortError') {
                // console.log("Anam call aborted");
                return;
            }

            console.error("Failed to start Anam call:", err);

            // Do not set error if we are already connected (handling race condition where one succeeds)
            if (!connected) {
                clearVideoStartTimeout();
                stopInputAudioStream();
                const message = err instanceof Error ? err.message : "Failed to connect";
                setError(message);
                setConnecting(false);
                toast.error("Failed to connect to counselor");
            }
        }
    };

    const toggleMute = () => {
        if (!anamClientRef.current) return;

        try {
            const nextMuted = !muted;
            inputAudioStreamRef.current?.getAudioTracks().forEach((track) => {
                track.enabled = !nextMuted;
            });
            if (nextMuted) {
                anamClientRef.current.muteInputAudio();
                toast.success("Microphone muted");
            } else {
                anamClientRef.current.unmuteInputAudio();
                toast.success("Microphone unmuted");
            }
            setMuted(nextMuted);
        } catch (e) {
            console.error("Error toggling mute", e);
            toast.error("Could not change microphone state");
        }
    };

    const toggleVideo = async () => {
        if (videoEnabled || cameraStreamRef.current) {
            stopUserCamera();
            toast.success("Camera preview off");
            return;
        }

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                toast.error("Camera is not supported in this browser");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 720 },
                    height: { ideal: 1280 }
                },
                audio: false
            });

            cameraStreamRef.current = stream;
            setCameraStream(stream);
            setVideoEnabled(true);
            toast.success("Camera preview on");
        } catch (error) {
            console.error("Camera preview failed:", error);
            toast.error("Camera is blocked or unavailable");
            stopUserCamera();
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await rootRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error("Fullscreen failed:", error);
            toast.error("Fullscreen is not available in this browser");
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || !anamClientRef.current) return;

        const trimmedInput = inputValue.trim();
        const userMessage: Message = {
            role: "user",
            content: trimmedInput,
            timestamp: new Date()
        };

        const nextMessages = [...messagesRef.current, userMessage];
        setMessages(nextMessages);
        messagesRef.current = nextMessages;
        setInputValue("");
        setLoading(true);

        try {
            if (/\b(can|do)\s+you\s+hear\s+me\b/i.test(trimmedInput)) {
                const typedOnlyResponse: Message = {
                    role: "counselor",
                    content: "No, I can read this typed chat message, but I only hear you when you speak through the microphone.",
                    timestamp: new Date()
                };
                const responseMessages = [...nextMessages, typedOnlyResponse];
                setMessages(responseMessages);
                messagesRef.current = responseMessages;
                await saveTranscript();
                setLoading(false);
                return;
            }

            // Anam SDK likely has a method to send text message to the persona
            // Based on d.ts: talk(content: string) makes the persona speak
            // sendUserMessage(content: string) sends a user text message

            anamClientRef.current.sendUserMessage(userMessage.content);
            saveTranscript();

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
        <div ref={rootRef} className="relative w-full h-full min-h-screen bg-slate-950 overflow-hidden">
            {/* Video Section */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">

                {/* Connecting Overlay */}
                {connecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/95 z-20">
                        <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                        <p className="text-white text-xl font-bold">Connecting to your Counselor...</p>
                        <p className="text-slate-300 text-sm text-center max-w-md px-6">{connectionStatus}</p>
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

                {cameraStream && (
                    <div className="absolute right-4 top-4 z-20 w-28 overflow-hidden rounded-2xl border border-white/30 bg-black shadow-2xl sm:right-6 sm:top-6 sm:w-40">
                        <video
                            ref={userCameraRef}
                            autoPlay
                            playsInline
                            muted
                            className="aspect-[9/16] w-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/45 px-2 py-1 text-center text-[10px] font-semibold text-white">
                            Your camera
                        </div>
                    </div>
                )}

                {/* Video Controls Overlay */}
                <div className="fixed bottom-5 left-1/2 z-[80] flex w-full max-w-xl -translate-x-1/2 items-center justify-center gap-2 px-3 pb-[env(safe-area-inset-bottom)] sm:bottom-8 sm:gap-4 sm:px-4">

                    {/* Mute Button */}
                    <button
                        onClick={toggleMute}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg flex-shrink-0 sm:h-14 sm:w-14 ${muted
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-slate-700/90 hover:bg-slate-600 backdrop-blur-md"
                            }`}
                        title={muted ? "Unmute" : "Mute"}
                    >
                        {muted ? (
                            <MicOff className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        ) : (
                            <Mic className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        )}
                    </button>

                    {/* Video Toggle Button (stubbed for Anam) */}
                    <button
                        onClick={toggleVideo}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg flex-shrink-0 sm:h-14 sm:w-14 ${!videoEnabled
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-slate-700/90 hover:bg-slate-600 backdrop-blur-md"
                            }`}
                        title={videoEnabled ? "Turn off camera preview" : "Turn on camera preview"}
                    >
                        {videoEnabled ? (
                            <Video className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        ) : (
                            <VideoOff className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        )}
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="w-12 h-12 rounded-full bg-slate-700/90 hover:bg-slate-600 backdrop-blur-md flex items-center justify-center transition-all shadow-lg flex-shrink-0 sm:h-14 sm:w-14"
                        title={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        ) : (
                            <Maximize2 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        )}
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={handleEndCall}
                        className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all shadow-lg flex-shrink-0 sm:h-14 sm:w-14"
                        title="End Session"
                    >
                        <PhoneOff className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </button>

                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center transition-all shadow-lg flex-shrink-0 sm:h-14 sm:w-14"
                        title="Open Chat"
                    >
                        <MessageCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </button>

                    {/* Notes Button */}
                    <button
                        onClick={() => setShowNotes(true)}
                        className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center transition-all shadow-lg flex-shrink-0 sm:h-14 sm:w-14"
                        title="Open Notes"
                    >
                        <Notebook className="h-5 w-5 text-white sm:h-6 sm:w-6" />
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
                fixed inset-y-0 right-0 w-80 max-w-[85vw] h-full z-40 lg:w-96 lg:max-w-sm
                transition-transform duration-300 ease-in-out
                ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}
                flex flex-col bg-white shadow-2xl overflow-hidden border-l-2 border-orange-100
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
                    <button
                        onClick={() => setIsChatOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close live chat"
                        title="Close live chat"
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

            {/* Notes Sidebar */}
            <NotesSidebar show={showNotes} onClose={() => setShowNotes(false)} />
        </div>
    );
}
