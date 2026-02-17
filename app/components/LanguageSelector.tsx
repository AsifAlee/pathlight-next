
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";

import { usePathname } from "next/navigation";

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const storedLang = localStorage.getItem("i18nextLng");
        // If no language is stored, or if we want to force selection on first visit/session
        // logic can be adjusted. For now, we show if no selection has been explicitly dismissed or made active?
        // But the requirement says "when the user logins ,there should be a popup like thing".
        // Let's check a specific flag "languageSelected" to force it.
        const languageSelected = localStorage.getItem("languageSelected");
        const token = localStorage.getItem("token");

        if (token && !languageSelected) {
            setIsOpen(true);
        }
    }, [pathname]);

    const languages = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "es", label: "Español", flag: "🇪🇸" },
        { code: "ja", label: "日本語", flag: "🇯🇵" },
    ];

    const handleSelectLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        localStorage.setItem("languageSelected", "true");
        setIsOpen(false);
    };

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center bg-gradient-to-br from-orange-50 to-white">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <Globe className="w-8 h-8 text-orange-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Language</h2>
                    <p className="text-slate-500 mb-8">Choose your preferred language for the best experience.</p>

                    <div className="space-y-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelectLanguage(lang.code)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 group
                                    ${i18n.language === lang.code
                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                        : "border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/50 text-slate-700"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl shadow-sm rounded-md overflow-hidden">{lang.flag}</span>
                                    <span className="font-bold">{lang.label}</span>
                                </div>
                                {i18n.language === lang.code && (
                                    <div className="bg-orange-500 rounded-full p-1">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
