"use client";

import { Globe, Users } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
    onNavigate: (pageOrSection: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
    return (
        <footer className="bg-slate-900 text-slate-400 py-1 md:py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                            <div className="text-primary">
                                <Logo className="w-32 h-32" />
                            </div>
                        </div>
                        <p className="w-[70%] md:w-full mx-auto md:mx-0 text-center md:text-left text-sm leading-relaxed mb-6">Empowering the next generation with accessible, safe, and intelligent mental health support.</p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Globe size={20} className="hover:text-white cursor-pointer" />
                            <Users size={20} className="hover:text-white cursor-pointer" />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => onNavigate('#features')} className="hover:text-primary transition-colors">Live Avatar</button></li>
                            <li><button onClick={() => onNavigate('#compliance')} className="hover:text-primary transition-colors">Safety Protocols</button></li>
                            <li><button onClick={() => onNavigate('#schools')} className="hover:text-primary transition-colors">School Dashboard</button></li>
                            <li><button onClick={() => onNavigate('Integration API')} className="hover:text-primary transition-colors">Integration API</button></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => onNavigate('Crisis Hotlines')} className="hover:text-primary transition-colors">Crisis Hotlines</button></li>
                            <li><button onClick={() => onNavigate('Counselor Training')} className="hover:text-primary transition-colors">Counselor Training</button></li>
                            <li><button onClick={() => onNavigate('Case Studies')} className="hover:text-primary transition-colors">Case Studies</button></li>
                            <li><button onClick={() => onNavigate('Help Center')} className="hover:text-primary transition-colors">Help Center</button></li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => onNavigate('About Us')} className="hover:text-primary transition-colors">About Us</button></li>
                            <li><button onClick={() => onNavigate('Careers')} className="hover:text-primary transition-colors">Careers</button></li>
                            <li><button onClick={() => onNavigate('Contact')} className="hover:text-primary transition-colors">Contact</button></li>
                            <li><button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p className="text-center md:text-left">&copy; 2024 Pathlight AI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <button onClick={() => onNavigate('terms')} className="hover:text-white">Terms</button>
                        <button onClick={() => onNavigate('privacy')} className="hover:text-white">Privacy</button>
                        <button onClick={() => onNavigate('Cookies')} className="hover:text-white">Cookies</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
