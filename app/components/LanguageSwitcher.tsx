'use client';

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import '../i18n'; // Ensure i18n is initialized

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'ja', label: '日本語', flag: '🇯🇵' },
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-primary hover:bg-orange-50 transition-all"
                aria-label="Select Language"
            >
                <Globe size={18} />
                <span className="hidden sm:inline text-sm font-medium">{currentLanguage.label}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-orange-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-orange-50 transition-colors ${i18n.language === lang.code ? 'text-primary font-medium bg-orange-50/50' : 'text-slate-600'
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
