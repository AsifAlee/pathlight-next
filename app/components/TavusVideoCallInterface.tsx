"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TavusVideoCallInterface() {
    const [loading, setLoading] = useState(false);
    const [personaId, setPersonaId] = useState<string | null>(null);
    const [conversationUrl, setConversationUrl] = useState<string | null>(null);

    const createPersona = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/tavus/persona", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    persona_name: "Tavus Researcher",
                    default_replica_id: "rf4703150052",
                    system_prompt: "Your responses will be spoken out, so avoid any formatting...",
                    context: "Tavus is a Series A, AI research company...",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create persona");
            }

            const data = await response.json();
            setPersonaId(data.persona_id);
            toast.success("Persona created successfully!");
            console.log("Persona Created:", data);

        } catch (error: any) {
            console.error("Error creating persona:", error);
            toast.error(error.message || "Failed to create persona");
        } finally {
            setLoading(false);
        }
    };

    const startCall = async () => {
        if (!personaId) {
            toast.error("No persona created yet!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/tavus/conversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    persona_id: personaId,
                    // You might need to pass other parameters like replica_id if needed, 
                    // or if the backend can infer it/use validation. 
                    // Assuming for now persona_id is enough or backend handles linking logic, 
                    // but per docs usually persona_id is key. 
                    // If replica_id is strictly required by Tavus even with persona_id, add it here.
                    // For now, let's assume we might need to look it up or pass it if available.
                    // Ideally, we should have stored the replica_id used to create the persona too.
                    replica_id: "rf4703150052", // Passing the same default for now
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to start conversation");
            }

            const data = await response.json();
            if (data.conversation_url) {
                setConversationUrl(data.conversation_url);
                toast.success("Call started!");
            } else {
                throw new Error("No conversation URL returned");
            }

        } catch (error: any) {
            console.error("Error starting call:", error);
            toast.error(error.message || "Failed to start call");
        } finally {
            setLoading(false);
        }
    };

    if (conversationUrl) {
        return (
            <div className="w-full h-full flex flex-col gap-4">
                <button
                    onClick={() => setConversationUrl(null)}
                    className="self-start px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 mb-2"
                >
                    End / Back
                </button>
                <iframe
                    src={conversationUrl}
                    className="w-full flex-1 rounded-xl border border-slate-700"
                    allow="microphone; camera"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
            <h2 className="text-2xl font-bold">Tavus Persona Creator</h2>
            {personaId ? (
                <div className="text-center flex flex-col gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <p className="mb-2 font-semibold text-green-400">Persona Ready!</p>
                        <p className="text-sm text-slate-400">ID: {personaId}</p>
                    </div>
                    <button
                        onClick={startCall}
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        {loading ? "Starting..." : "Start Video Call"}
                    </button>
                </div>
            ) : (
                <button
                    onClick={createPersona}
                    disabled={loading}
                    className="px-6 py-3 bg-orange-600 rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" />}
                    {loading ? "Creating..." : "Create Persona"}
                </button>
            )}
        </div>
    );
}
