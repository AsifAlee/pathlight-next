"use client";

import { Globe, Users } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
    onNavigate: (pageOrSection: string) => void;
}

import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Footer({ onNavigate }: FooterProps) {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <div className="flex flex-col items-center md:items-start space-y-6">
                            <div className="text-primary">
                                <Logo className="w-32 h-32" />
                            </div>
                            <p className="relative top-[-2rem] text-slate-400 text-center md:text-left text-sm leading-relaxed max-w-sm">
                                {t('footer.description')}
                            </p>
                            <div className="flex items-center gap-5 text-slate-400">
                                <a href="#" className="hover:text-primary transition-colors duration-200">
                                    <Globe size={20} />
                                </a>
                                <a href="#" className="hover:text-primary transition-colors duration-200">
                                    <Users size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
                        <div>
                            <h4 className="font-semibold text-white mb-6 tracking-wide text-sm uppercase opacity-90">{t('footer.platform')}</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><button onClick={() => onNavigate('#features')} className="hover:text-primary transition-colors duration-200">{t('footer.live_avatar')}</button></li>
                                <li><button onClick={() => onNavigate('#compliance')} className="hover:text-primary transition-colors duration-200">{t('footer.safety_protocols')}</button></li>
                                <li><button onClick={() => onNavigate('#schools')} className="hover:text-primary transition-colors duration-200">{t('footer.school_dashboard')}</button></li>
                                <li><button onClick={() => onNavigate('Integration API')} className="hover:text-primary transition-colors duration-200">{t('footer.integration_api')}</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-6 tracking-wide text-sm uppercase opacity-90">{t('footer.resources')}</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><button onClick={() => onNavigate('Crisis Hotlines')} className="hover:text-primary transition-colors duration-200">{t('footer.crisis_hotlines')}</button></li>
                                <li><button onClick={() => onNavigate('Counselor Training')} className="hover:text-primary transition-colors duration-200">{t('footer.counselor_training')}</button></li>
                                <li><button onClick={() => onNavigate('Case Studies')} className="hover:text-primary transition-colors duration-200">{t('footer.case_studies')}</button></li>
                                <li><button onClick={() => onNavigate('Help Center')} className="hover:text-primary transition-colors duration-200">{t('footer.help_center')}</button></li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="font-semibold text-white mb-6 tracking-wide text-sm uppercase opacity-90">{t('footer.company')}</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><button onClick={() => onNavigate('About Us')} className="hover:text-primary transition-colors duration-200">{t('footer.about_us')}</button></li>
                                <li><button onClick={() => onNavigate('Careers')} className="hover:text-primary transition-colors duration-200">{t('footer.careers')}</button></li>
                                <li><button onClick={() => onNavigate('Contact')} className="hover:text-primary transition-colors duration-200">{t('footer.contact')}</button></li>
                                <li><button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors duration-200">{t('footer.privacy_policy')}</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
                    <p className="order-2 md:order-1">&copy; {currentYear} {t('footer.rights_reserved')}</p>
                    <div className="flex flex-wrap justify-center gap-8 order-1 md:order-2">
                        <button onClick={() => onNavigate('terms')} className="hover:text-primary transition-colors duration-200">{t('footer.terms')}</button>
                        <button onClick={() => onNavigate('privacy')} className="hover:text-primary transition-colors duration-200">{t('footer.privacy')}</button>
                        <button onClick={() => onNavigate('Cookies')} className="hover:text-primary transition-colors duration-200">{t('footer.cookies')}</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
