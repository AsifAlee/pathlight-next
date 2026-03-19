"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../components/Logo";
import { ArrowRight, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import '../i18n';
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { auth } = await import('@/lib/firebase');
            const { sendPasswordResetEmail } = await import('firebase/auth');

            await sendPasswordResetEmail(auth, email.trim());

            setSubmitted(true);
            toast.success("Reset link sent to your email!");
        } catch (err: any) {
            console.error('Forgot password error:', err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('auth.email_sent_title')}</h1>
                    <p className="text-slate-500 mb-8">
                        {t('auth.email_sent_desc', { email })}
                    </p>
                    <Link 
                        href="/signin" 
                        className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors"
                    >
                        <ArrowLeft size={20} /> {t('auth.back_to_login')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fff7ed] relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl opacity-50"></div>

            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 p-8 lg:p-12">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-orange-600 mb-6 hover:opacity-80 transition-opacity">
                        <Logo className="w-24 h-24" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.forgot_password_title')}</h1>
                    <p className="text-slate-500">{t('auth.forgot_password_desc')}</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">{t('auth.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? t('auth.sending_link') : (
                            <>{t('auth.send_reset_link')} <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/signin" className="text-slate-500 hover:text-slate-700 flex items-center justify-center gap-2 text-sm font-medium">
                        <ArrowLeft size={16} /> {t('auth.back_to_login')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
