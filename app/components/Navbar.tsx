"use client";

import { useState } from "react";
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
    onNavigate: (pageOrSection: string) => void;
    onAuth: (type: 'student' | 'school', mode?: 'login' | 'signup') => void;
}

export default function Navbar({ onNavigate, onAuth }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log('dfdf')
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
                        <button onClick={() => onNavigate('#features')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</button>
                        <button onClick={() => onNavigate('#how-it-works')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How it Works</button>
                        <button onClick={() => onNavigate('guides')} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Our ICONS</button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <a href="/dashboard" className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-all shadow-md hover:shadow-lg">
                                Call Dashboard
                            </a>
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
                    <button onClick={() => { onNavigate('#features'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-600 font-medium py-2">Features</button>
                    <button onClick={() => { onNavigate('#how-it-works'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-600 font-medium py-2">How it Works</button>
                    <button onClick={() => { onNavigate('guides'); setIsMenuOpen(false); }} className="block w-full text-left text-slate-600 font-medium py-2">Our ICONS</button>
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                        <a href="/dashboard" className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/20 text-center">
                            Call Dashboard
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
