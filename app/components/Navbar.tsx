import { useState } from "react";
import { Menu, X, LogOut, User } from 'lucide-react';
import { Logo } from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '../i18n';

interface NavbarProps {
    onNavigate: (pageOrSection: string) => void;
    onAuth: (type: 'student' | 'school', mode?: 'login' | 'signup') => void;
    isAuthenticated?: boolean;
    onLogout?: () => void;
}

export default function Navbar({ onNavigate, onAuth, isAuthenticated, onLogout }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
                        <div className="text-primary">
                            <Logo className="w-32 h-32" />
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        <LanguageSwitcher />
                        <button onClick={() => onNavigate('#features')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t('nav.features')}</button>
                        <button onClick={() => onNavigate('#how-it-works')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t('nav.how_it_works')}</button>
                        <button onClick={() => onNavigate('guides')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t('nav.guides')}</button>
                        
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Link href="/dashboard" className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                        <User size={16} />
                                        {t('nav.dashboard')}
                                    </Link>
                                    <button 
                                        onClick={onLogout}
                                        className="text-slate-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        title={t('nav.logout')}
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onAuth('student', 'login')}
                                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    {t('nav.login')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-b border-orange-100 p-4 space-y-4 shadow-xl absolute w-full top-20 left-0 z-40">
                    <button onClick={() => { onNavigate('#features'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-600 font-medium py-2">{t('nav.features')}</button>
                    <button onClick={() => { onNavigate('#how-it-works'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-600 font-medium py-2">{t('nav.how_it_works')}</button>
                    <button onClick={() => { onNavigate('guides'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-600 font-medium py-2">{t('nav.guides')}</button>
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    href="/dashboard" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 text-center flex items-center justify-center gap-2"
                                >
                                    <User size={18} />
                                    {t('nav.dashboard')}
                                </Link>
                                <button 
                                    onClick={() => { onLogout?.(); setIsMenuOpen(false); }}
                                    className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} />
                                    {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => { onAuth('student', 'login'); setIsMenuOpen(false); }}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium shadow-lg text-center"
                            >
                                {t('nav.login')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
