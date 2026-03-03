"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Logo } from "../components/Logo";
import { ArrowRight, Mail, Lock, School, User, CheckCircle, UserCircle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from 'react-i18next';
import '../i18n';
import { useAnalytics } from '@/lib/useAnalytics';

function SignUpContent() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const initialType = searchParams.get('type') === 'school' ? 'school' : 'student';
    const [userType, setUserType] = useState<'student' | 'school'>(initialType);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password: password.trim(), role: userType }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            trackEvent('signup', { role: userType });
            toast.success("Account created successfully! Please sign in.");

            // Redirect to signin
            router.push(`/signin?type=${userType}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff7ed] relative overflow-hidden flex items-center justify-center p-4">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl opacity-50"></div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 min-h-[600px]">

                {/* Left Side - Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 mb-6 hover:opacity-80 transition-opacity">
                            <Logo className="w-32 h-32" />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.create_account')}</h1>
                        <p className="text-slate-500">{t('auth.join_today')}</p>
                    </div>

                    {/* User Type Toggle */}
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
                        <button
                            onClick={() => setUserType('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${userType === 'student'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <User size={18} />
                            {t('auth.student')}
                        </button>
                        <button
                            onClick={() => setUserType('school')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${userType === 'school'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <School size={18} />
                            {t('auth.school_admin')}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignUp}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">{t('auth.full_name')}</label>
                            <div className="relative">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">{t('auth.password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                // disabled={loading}
                                disabled={true} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? t('auth.creating_account') : (
                                    <>{t('auth.create_account_btn')} <ArrowRight size={20} /></>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-slate-500 text-sm">
                        {t('auth.already_have_account')}{" "}
                        <Link href={`/signin?type=${userType}`} className="text-orange-600 font-bold hover:text-orange-700">
                            {t('auth.sign_in')}
                        </Link>
                    </p>
                </div>

                {/* Right Side - Visuals */}
                <div className={`relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden order-1 lg:order-2 ${userType === 'student'
                    ? 'bg-slate-900 border-t border-slate-800'
                    : 'bg-slate-900 border-t border-slate-800'
                    }`}>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full -ml-20 -mb-20 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-medium border border-white/10 mb-8">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            {userType === 'student' ? t('auth.join_community') : t('auth.partner_with_us')}
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-6">
                            {userType === 'student'
                                ? t('auth.start_journey')
                                : t('auth.transform_school')}
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed max-w-md">
                            {userType === 'student'
                                ? t('auth.student_access')
                                : t('auth.school_access')}
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="relative z-10 space-y-4">
                        {(userType === 'student' ? [
                            t('auth.features_student.free'),
                            t('auth.features_student.private'),
                            t('auth.features_student.instant')
                        ] : [
                            t('auth.features_school.implementation'),
                            t('auth.features_school.compliance'),
                            t('auth.features_school.support')
                        ]).map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                                <CheckCircle className="text-white" size={20} />
                                <span className="font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignUp() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpContent />
        </Suspense>
    );
}
