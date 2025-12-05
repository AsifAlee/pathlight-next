"use client";

import { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface VideoCallInterfaceProps {
    onEndCall: () => void;
}

export default function VideoCallInterface({ onEndCall }: VideoCallInterfaceProps) {
    const [connecting, setConnecting] = useState(true);
    const [connected, setConnected] = useState(false);
    const [muted, setMuted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const anamClientRef = useRef<any>(null);

    useEffect(() => {
        startCall();
        return () => {
            // Cleanup on unmount
            if (anamClientRef.current) {
                anamClientRef.current.stopStreaming?.();
            }
        };
    }, []);

    const startCall = async () => {
        try {
            setConnecting(true);
            setError(null);

            // Import Anam SDK
            const { createClient } = await import("@anam-ai/js-sdk");

            // Get session token from our API
            const token = localStorage.getItem("token");
            const response = await fetch("/api/anam/session-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create session");
            }

            const { sessionToken } = await response.json();

            // Create Anam client
            const anamClient = createClient(sessionToken);
            anamClientRef.current = anamClient;

            // Stream to video element
            if (videoRef.current) {
                await anamClient.streamToVideoElement("counselor-video");
                setConnected(true);
                setConnecting(false);
                toast.success("Connected to counselor");
            }
        } catch (err: any) {
            console.error("Failed to start call:", err);
            setError(err.message || "Failed to connect");
            setConnecting(false);
            toast.error("Failed to connect to counselor");
        }
    };

    const toggleMute = () => {
        if (anamClientRef.current) {
            if (muted) {
                anamClientRef.current.unmute?.();
            } else {
                anamClientRef.current.mute?.();
            }
            setMuted(!muted);
        }
    };

    const handleEndCall = () => {
        if (anamClientRef.current) {
            anamClientRef.current.stopStreaming?.();
        }
        toast.success("Call ended");
        onEndCall();
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900 rounded-3xl overflow-hidden">
            {/* Video Element */}
            <video
                id="counselor-video"
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />

            {/* Connecting Overlay */}
            {connecting && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <p className="text-white text-lg font-medium">Connecting to counselor...</p>
                    <p className="text-slate-400 text-sm">Please allow microphone access</p>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center gap-4">
                    <VideoOff className="w-12 h-12 text-red-500" />
                    <p className="text-white text-lg font-medium">Connection Failed</p>
                    <p className="text-slate-400 text-sm">{error}</p>
                    <button
                        onClick={startCall}
                        className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Call Controls */}
            {connected && !error && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    {/* Mute Button */}
                    <button
                        onClick={toggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm"
                            }`}
                        title={muted ? "Unmute" : "Mute"}
                    >
                        {muted ? (
                            <MicOff className="w-6 h-6 text-white" />
                        ) : (
                            <Mic className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={handleEndCall}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
                        title="End Call"
                    >
                        <PhoneOff className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}

            {/* Status Indicator */}
            {connected && !error && (
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Connected</span>
                </div>
            )}
        </div>
    );
}
