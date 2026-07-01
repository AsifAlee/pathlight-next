"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    GraduationCap,
    Loader2,
    Mail,
    Send,
    Sparkles,
    Target,
    User,
} from "lucide-react";
import { Logo } from "../components/Logo";

const studentStatuses = ["High school", "College", "University", "Recent graduate", "Not a student"];
const chosenDirections = ["Yes, firmly", "Somewhat", "Not at all"];
const worryOptions = ["Never", "Sometimes", "Often"];
const yesSomeNo = ["Yes", "Only some", "No"];
const helpedOptions = ["Yes", "A little", "No"];
const adviceSources = ["Family", "Friends", "Teacher", "Internet", "No one"];
const timelines = ["Now", "This year", "1-2 years", "Not sure"];
const yesNo = ["Yes", "No"];

const initialForm = {
    fullName: "",
    studentStatus: "",
    schoolName: "",
    studyFocus: "",
    graduationYear: "",
    studentEmail: "",
    careerClarity: "3",
    chosenDirection: "",
    wrongPathWorry: "",
    careerConfusion: "",
    fieldJobKnowledge: "",
    usedCareerSupport: "",
    careerSupportName: "",
    careerSupportHelped: "",
    adviceSource: "",
    decisionConfidence: "3",
    feelingPressure: "",
    pressureSource: "",
    decisionTimeline: "",
    missedOpportunity: "",
    rightPathOutcome: "",
    canTestAndFeedback: "",
};

type FormState = typeof initialForm;

function OptionGroup({
    label,
    value,
    options,
    onChange,
    required = true,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    required?: boolean;
}) {
    return (
        <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-800">{label}</legend>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <label
                        key={option}
                        className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-all ${value === option
                            ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50"
                            }`}
                    >
                        <input
                            type="radio"
                            name={label}
                            value={option}
                            checked={value === option}
                            onChange={() => onChange(option)}
                            required={required}
                            className="sr-only"
                        />
                        {option}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

function TextField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    required = true,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
        </label>
    );
}

function TextArea({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                required
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
        </label>
    );
}

function ScaleQuestion({
    label,
    value,
    lowLabel,
    highLabel,
    onChange,
}: {
    label: string;
    value: string;
    lowLabel: string;
    highLabel: string;
    onChange: (value: string) => void;
}) {
    return (
        <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-slate-800">{label}</legend>
            <div className="grid grid-cols-5 gap-2">
                {["1", "2", "3", "4", "5"].map((rating) => (
                    <label
                        key={rating}
                        className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-bold transition-all ${value === rating
                            ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                            : "border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50"
                            }`}
                    >
                        <input
                            type="radio"
                            name={label}
                            value={rating}
                            checked={value === rating}
                            onChange={() => onChange(rating)}
                            required
                            className="sr-only"
                        />
                        {rating}
                    </label>
                ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>{lowLabel}</span>
                <span>{highLabel}</span>
            </div>
        </fieldset>
    );
}

export default function BetaAccessPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const progress = useMemo(() => {
        const requiredKeys = Object.entries(form).filter(([key]) => !["careerSupportName", "careerSupportHelped", "pressureSource"].includes(key));
        const answered = requiredKeys.filter(([, value]) => value).length;
        return Math.round((answered / requiredKeys.length) * 100);
    }, [form]);

    const update = (field: keyof FormState, value: string) => {
        setForm((current) => {
            const next = { ...current, [field]: value };
            if (field === "usedCareerSupport" && value === "No") {
                next.careerSupportName = "";
                next.careerSupportHelped = "";
            }
            if (field === "feelingPressure" && value === "No") {
                next.pressureSource = "";
            }
            return next;
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch("/api/beta-applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to submit your application.");
            }

            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to submit your application.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-white text-slate-950">
                <header className="border-b border-orange-100 bg-white">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="text-primary">
                            <Logo className="h-24 w-24" />
                        </Link>
                        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-orange-300 hover:bg-orange-50">
                            Back home
                        </Link>
                    </div>
                </header>
                <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={40} />
                    </div>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-orange-600">Application received</p>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Thanks for applying to Pathlight beta.</h1>
                    <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                        We review every response by hand and give beta access to students who are most likely to benefit from guided career support right now. Watch your student email over the next few days.
                    </p>
                    <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
                        Return to Pathlight <ArrowRight size={18} />
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-slate-950">
            <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="text-primary">
                        <Logo className="h-24 w-24" />
                    </Link>
                    <div className="hidden items-center gap-3 sm:flex">
                        <span className="text-sm font-semibold text-slate-500">Beta questionnaire</span>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </header>

            <section className="border-b border-orange-100 bg-orange-50/60">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_0.55fr] lg:px-8 lg:py-20">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                            <Sparkles size={16} />
                            Free during beta
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Apply for Pathlight beta access
                        </h1>
                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                            Pathlight is inviting students who genuinely need help finding the right career path. Answer the questions below honestly, and our team will evaluate each application before sending access.
                        </p>
                    </div>
                    <aside className="self-end rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/60">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-950">20 short questions</p>
                                <p className="text-sm text-slate-500">Usually takes 5-7 minutes</p>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-600" /> Student status and school email</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-600" /> Career clarity and pressure level</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-600" /> Feedback availability</div>
                        </div>
                    </aside>
                </div>
            </section>

            <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                <section className="mb-10 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-8">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <User size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Student details</h2>
                            <p className="text-sm text-slate-500">We use this to confirm enrollment and reply to you.</p>
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <TextField label="01 Full name" value={form.fullName} onChange={(value) => update("fullName", value)} placeholder="Your full name" />
                        <OptionGroup label="02 Are you currently a student?" value={form.studentStatus} options={studentStatuses} onChange={(value) => update("studentStatus", value)} />
                        <TextField label="03 Name of your school, college, or university" value={form.schoolName} onChange={(value) => update("schoolName", value)} placeholder="School name" />
                        <TextField label='04 What are you studying or working toward?' value={form.studyFocus} onChange={(value) => update("studyFocus", value)} placeholder='If undecided, write "undecided."' />
                        <TextField label="05 Expected year of graduation" value={form.graduationYear} onChange={(value) => update("graduationYear", value)} placeholder="2027" />
                        <TextField label="06 Student email address" type="email" value={form.studentEmail} onChange={(value) => update("studentEmail", value)} placeholder="name@school.edu" />
                    </div>
                </section>

                <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <Target size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Career clarity</h2>
                            <p className="text-sm text-slate-500">Tell us where you are in the decision process.</p>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        <ScaleQuestion label="07 How clear are you about your career path?" value={form.careerClarity} lowLabel="1 = no idea" highLabel="5 = very clear" onChange={(value) => update("careerClarity", value)} />
                        <OptionGroup label="08 Have you already chosen a career direction?" value={form.chosenDirection} options={chosenDirections} onChange={(value) => update("chosenDirection", value)} />
                        <OptionGroup label="09 How often do you worry about picking the wrong path?" value={form.wrongPathWorry} options={worryOptions} onChange={(value) => update("wrongPathWorry", value)} />
                        <TextArea label="10 In one line, what confuses you most about your career?" value={form.careerConfusion} onChange={(value) => update("careerConfusion", value)} placeholder="Example: I do not know which major connects to the kind of work I want." />
                        <OptionGroup label="11 Do you know what jobs your field of study can lead to?" value={form.fieldJobKnowledge} options={yesSomeNo} onChange={(value) => update("fieldJobKnowledge", value)} />
                    </div>
                </section>

                <section className="mb-10 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-8">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <GraduationCap size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Support and pressure</h2>
                            <p className="text-sm text-slate-500">This helps us prioritize students who need guidance soon.</p>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        <OptionGroup label="12 Have you used a career counselor or guidance tool before?" value={form.usedCareerSupport} options={yesNo} onChange={(value) => update("usedCareerSupport", value)} />
                        {form.usedCareerSupport === "Yes" && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <TextField label="Which one?" value={form.careerSupportName} onChange={(value) => update("careerSupportName", value)} placeholder="Counselor, platform, or tool name" />
                                <OptionGroup label="13 If yes, did it actually help you?" value={form.careerSupportHelped} options={helpedOptions} onChange={(value) => update("careerSupportHelped", value)} />
                            </div>
                        )}
                        <OptionGroup label="14 Who do you usually turn to for career advice?" value={form.adviceSource} options={adviceSources} onChange={(value) => update("adviceSource", value)} />
                        <ScaleQuestion label="15 How confident are you making a career decision on your own?" value={form.decisionConfidence} lowLabel="1 = not at all" highLabel="5 = very" onChange={(value) => update("decisionConfidence", value)} />
                        <OptionGroup label="16 Are you feeling pressure to decide soon?" value={form.feelingPressure} options={yesNo} onChange={(value) => update("feelingPressure", value)} />
                        {form.feelingPressure === "Yes" && (
                            <TextField label="From whom?" value={form.pressureSource} onChange={(value) => update("pressureSource", value)} placeholder="Family, school, deadline, yourself..." />
                        )}
                        <OptionGroup label="17 How soon do you need to make a decision?" value={form.decisionTimeline} options={timelines} onChange={(value) => update("decisionTimeline", value)} />
                        <OptionGroup label="18 Have you ever missed or avoided an opportunity because you were unsure of your path?" value={form.missedOpportunity} options={yesNo} onChange={(value) => update("missedOpportunity", value)} />
                    </div>
                </section>

                <section className="rounded-3xl border border-orange-200 bg-orange-50 p-5 sm:p-8">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <Mail size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Final review</h2>
                            <p className="text-sm text-slate-600">We reply within a few days after reviewing your answers.</p>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        <TextArea label='19 In one line, what would the "right" career path give you that you do not have now?' value={form.rightPathOutcome} onChange={(value) => update("rightPathOutcome", value)} placeholder="Example: Confidence that my degree and future job are connected." />
                        <OptionGroup label="20 Can you spend about 30 minutes testing Pathlight and sharing honest feedback?" value={form.canTestAndFeedback} options={yesNo} onChange={(value) => update("canTestAndFeedback", value)} />
                        <div className="flex flex-col gap-4 border-t border-orange-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-xl text-sm leading-6 text-slate-600">
                                By submitting, you agree that Pathlight can review your answers to determine beta access eligibility and contact you at your student email.
                            </p>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {submitting ? "Submitting..." : "Submit application"}
                            </button>
                        </div>
                    </div>
                </section>
            </form>
        </main>
    );
}
