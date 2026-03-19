"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Logo } from "../components/Logo";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleResend = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        try {
            const { auth } = await import('@/lib/firebase');
            const { sendEmailVerification, signInWithEmailAndPassword } = await import('firebase/auth');
            
            // This is tricky because the user is logged out. 
            // In a real app, you might ask for password again or use a backend triggered resend.
            // For now, we'll suggest them to sign in to trigger verification if needed, 
            // or if they just signed up, the auth object might still have the user if not fully cleared.
            
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                toast.success("Verification email resent!");
                setCooldown(60);
            } else {
                toast.error("Please sign in to resend verification email.");
                router.push('/signin');
            }
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff7ed] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements same as signup */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl opacity-50"></div>

            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 text-center relative z-10">
                <div className="mb-8 flex justify-center">
                    <Logo className="w-32 h-32" />
                </div>

                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="text-orange-600 w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">Verify your email</h1>
                <p className="text-slate-600 mb-8">
                    We've sent a verification link to <span className="font-semibold text-slate-900">{email || 'your email'}</span>. 
                    Please click the link in the email to activate your account.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleResend}
                        disabled={loading || cooldown > 0}
                        className="w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Email"}
                    </button>

                    <Link
                        href="/signin"
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                    >
                        <ArrowLeft size={20} /> Back to Sign In
                    </Link>
                </div>

                <p className="mt-8 text-sm text-slate-500">
                    Can't find the email? Check your spam folder or try resending.
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
