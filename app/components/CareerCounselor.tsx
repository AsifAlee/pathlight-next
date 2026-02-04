"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader, Volume2 } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
    role: "user" | "counselor";
    content: string;
    timestamp: Date;
}

interface UserInfo {
    name: string;
    email: string;
    careerGoals: string;
    experienceLevel: string;
}

export function CareerCounselor() {
    const [stage, setStage] = useState<"greeting" | "questions" | "session">("greeting");
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: "",
        email: "",
        careerGoals: "",
        experienceLevel: "student"
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        if (stage === "session" && messages.length === 0) {
            const greeting = {
                role: "counselor" as const,
                content: `🎉 Hey there! I'm thrilled to help you explore your career path today! I can feel your enthusiasm, and I'm here to guide you every step of the way. Let me ask you a few quick questions to understand your journey better!`,
                timestamp: new Date()
            };
            setMessages([greeting]);
        }
    }, [stage]);

    const handleGreetingStart = () => {
        setStage("questions");
    };

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userInfo.name.trim()) {
            toast.error("Please enter your name!");
            return;
        }

        if (userInfo.careerGoals.trim().length === 0) {
            toast.error("Tell us about your career interests!");
            return;
        }

        // Start the session
        initializeSession();
    };

    const initializeSession = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/ai/career-counselor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "initialize",
                    userInfo
                })
            });

            const data = await response.json();

            if (data.success) {
                setSessionId(data.sessionId);
                setStage("session");
                toast.success("Session started! 🚀");
            }
        } catch (error) {
            toast.error("Failed to start session");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

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

    // GREETING STAGE
    if (stage === "greeting") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Meet Your AI Career Counselor! 🎯
                        </h1>

                        <p className="text-xl text-gray-600 mb-4">
                            I'm here to guide you on an exciting journey of career discovery!
                        </p>

                        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                            Whether you're curious about different career paths, want to explore your strengths, or need guidance on your next steps - I'm your energetic partner in this adventure!
                        </p>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-gray-800 mb-4">What We'll Explore Together:</h3>
                            <ul className="text-left space-y-2 text-gray-700">
                                <li>✨ Your career interests and passions</li>
                                <li>🚀 Your skills and experience</li>
                                <li>🎓 Personalized career recommendations</li>
                                <li>📈 Actionable steps to reach your goals</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleGreetingStart}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                        >
                            Let's Get Started! 🚀
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // QUESTIONS STAGE
    if (stage === "questions") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Let's Get to Know You! 👋
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Tell me a bit about yourself so I can personalize your career counseling experience
                        </p>

                        <form onSubmit={handleQuestionSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    What's your name? 🎤
                                </label>
                                <input
                                    type="text"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Email (optional) 📧
                                </label>
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Career Goals */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    What are your career interests or goals? 🎯
                                </label>
                                <textarea
                                    value={userInfo.careerGoals}
                                    onChange={(e) => setUserInfo({ ...userInfo, careerGoals: e.target.value })}
                                    placeholder="E.g., I'm interested in tech, want to start a business, explore healthcare careers..."
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors h-24 resize-none"
                                />
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    What's your experience level? 📚
                                </label>
                                <select
                                    value={userInfo.experienceLevel}
                                    onChange={(e) => setUserInfo({ ...userInfo, experienceLevel: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                >
                                    <option value="student">High School Student</option>
                                    <option value="college">College Student</option>
                                    <option value="early-career">Early Career (0-3 years)</option>
                                    <option value="mid-career">Mid-Career (3-10 years)</option>
                                    <option value="career-change">Career Change</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Starting your session...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Begin Career Counseling! 🚀
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // SESSION STAGE
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl h-screen md:h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Career Counselor Session</h2>
                            <p className="text-purple-100 text-sm">With {userInfo.name}</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
                        🟢 Active
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl ${
                                    message.role === "user"
                                        ? "bg-purple-600 text-white rounded-br-none"
                                        : "bg-gradient-to-br from-orange-100 to-pink-100 text-gray-900 rounded-bl-none border-2 border-orange-200"
                                }`}
                            >
                                <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                                <span className="text-xs opacity-60 mt-1 block">
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
                            <div className="bg-gradient-to-br from-orange-100 to-pink-100 px-4 py-3 rounded-xl rounded-bl-none">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t-2 border-gray-200 p-4 bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Share your thoughts, ask questions..."
                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        💡 Tip: Ask anything about careers, skills, education, or your future!
                    </p>
                </div>
            </div>
        </div>
    );
}
