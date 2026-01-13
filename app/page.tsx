"use client";
import Image from "next/image";
import {
  Menu, X, Shield, Users, ArrowRight, Activity,
  MessageCircle, School, Lock, Heart, CheckCircle, Globe, Award, FileText,
  TrendingUp, Video, Phone, Mic, Sparkles, Smile, Brain
} from 'lucide-react';
// import Dashboard from './components/Dashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import InfoPage from './components/InfoPage';
import Multilingual from './components/Multilingual';
import WhatItOffers from './components/WhatItOffers';
import { Logo } from './components/Logo';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/types";
const AVATARS = [
  {
    id: 1,
    name: "David",
    role: "The Visionary Philanthropist",
    image: "/p1.jpeg",
    desc: "Focuses on global impact, strategic thinking, and finding solutions to complex world problems.",
    color: "bg-orange-500"
  },
  {
    id: 2,
    name: "Elon Musk",
    role: "The Innovation Catalyst",
    image: "/elon.jpg",
    desc: "Focuses on disruptive technology, future-building, and pushing the boundaries of what's possible.",
    color: "bg-amber-600"
  },
  {
    id: 3,
    name: "J.K. Rowling",
    role: "The Creative Storyteller",
    image: "/jk-rowling.jpg",
    desc: "Focuses on narrative, imagination, and building resilience through the power of story.",
    color: "bg-yellow-500"
  },
  {
    id: 4,
    name: "Jeff Bezos",
    role: "The Customer Obsession Expert",
    image: "/jeff-bezos.jpg",
    desc: "Focuses on long-term thinking, operational excellence, and relentless innovation.",
    color: "bg-orange-600"
  }
];
export default function Home() {

  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Navigation State
  const [activePage, setActivePage] = useState<string>('home');

  // Interactive Hero State
  const [activeAvatar, setActiveAvatar] = useState(AVATARS[0]);

  const handleLogin = (role: 'student' | 'school') => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setActivePage('home');
  };

  const openAuth = (type: 'student' | 'school', mode: 'login' | 'signup' = 'login') => {
    if (mode === 'signup') {
      router.push(`/signup?type=${type}`);
    } else {
      router.push(`/signin?type=${type}`);
    }
  };

  const navigateTo = (pageOrSection: string) => {
    if (pageOrSection.startsWith('#')) {
      setActivePage('home');
      // Use setTimeout to allow render if coming from another page
      setTimeout(() => {
        const element = document.querySelector(pageOrSection);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActivePage(pageOrSection);
      window.scrollTo(0, 0);
    }
  };

  if (currentRole) {
    return (
      <>
        {/* Navigation for Dashboard */}
        <nav className=" test-style fixed w-full z-50 bg-white border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentRole(null)}>
                <div className="text-primary">
                  <Logo className="w-8 h-8" />
                </div>

              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 hidden sm:block">Logged in as {currentRole === 'student' ? 'Student' : 'Administrator'}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-orange-50"
                >
                  Logout
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-200">
                  {currentRole === 'student' ? 'S' : 'A'}
                </div>
              </div>
            </div>
          </div>
        </nav>
        {/* <Dashboard role={currentRole} userName={currentRole === 'student' ? 'Alex' : 'Principal Skinner'} /> */}
      </>
    );
  }

  // Handle Legal and Info Pages
  if (activePage === 'privacy') return <PrivacyPolicy onBack={() => navigateTo('home')} />;
  if (activePage === 'terms') return <TermsOfService onBack={() => navigateTo('home')} />;
  if (activePage !== 'home') return <InfoPage title={activePage} onBack={() => navigateTo('home')} />;

  // Default Landing Page
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20">

      {/* Navbar */}
      <Navbar onNavigate={navigateTo} onAuth={openAuth} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 shadow-sm">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-orange-700 tracking-wide uppercase">New: Live 24/7 Support</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                The World's First <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI Career Counselor.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Experience the future of mental health and career support. Choose a guide that resonates with you and get real-time, judgment-free support for school, stress, and life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => openAuth('student', 'signup')} className="bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group">
                  Try It Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigateTo('#features')} className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 transition-colors flex items-center justify-center hover:border-orange-300">
                  See Features
                </button>
              </div>


              <div className="pt-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Select your guide to preview</p>
                <div className="flex gap-3">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setActiveAvatar(avatar)}
                      className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${activeAvatar.id === avatar.id ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-white opacity-70 hover:opacity-100 hover:scale-105'}`}
                    >
                      <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-medium">
                    +More
                  </div>
                </div>
              </div>
            </div>


            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="relative w-80 sm:w-96 aspect-[9/16] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-900 ring-1 ring-slate-900/10 transition-all duration-500">

                <div className="absolute inset-0">
                  <img
                    key={activeAvatar.id}
                    src={activeAvatar.image}
                    alt="Active Avatar"
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-500 animate-[fadeIn_0.5s_ease-in-out]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
                </div>


                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-center text-white/90">

                    <div className="flex items-stretch rounded-lg overflow-hidden shadow-lg select-none transform transition-transform hover:scale-105 border border-white/10">
                      <div className="w-10 flex items-center justify-center bg-slate-800 relative">
                        <Mic size={16} className="text-white z-10" />

                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary"></div>
                      </div>
                      <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-md flex items-center border-l border-white/5">
                        <span className="text-sm font-bold text-white tracking-wide">AI Counselor</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-white text-2xl font-bold">{activeAvatar.name}</h3>
                      <p className="text-white/70 text-sm">{activeAvatar.role}</p>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                      <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <Mic size={20} />
                      </button>
                      <button
                        onClick={() => openAuth('student', 'signup')}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 hover:from-orange-500 hover:to-primary text-white flex items-center justify-center shadow-xl shadow-orange-500/40 transform hover:scale-110 transition-all animate-[pulse_2s_infinite]"
                      >
                        <Phone size={32} className="fill-current" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <Video size={20} />
                      </button>
                    </div>
                    <p className="text-white/50 text-xs">Tap call button to start chat</p>
                  </div>
                </div>
              </div>


              <div className={`absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl animate-pulse transition-colors duration-500`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-10 border-y border-orange-100 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 font-medium mb-8 text-sm uppercase tracking-widest">Joining forces with innovative schools</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Riverside High', 'Oakwood Academy', 'Tech Institute', 'Global Prep', 'Future Learning'].map(school => (
              <span key={school} className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <School size={24} className="text-slate-400" /> {school}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Meet Your Guides (Interactive Showcase) */}
      <section id="guides" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Diverse Voices for Diverse Needs</h2>
            <p className="text-slate-600 text-lg">Mental health isn't one-size-fits-all. Our platform offers a range of AI personalities modeled after real counseling styles.</p>
          </div>

          <div className="md:p-0 p-8  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AVATARS.map((avatar) => (
              <div key={avatar.id} className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 bg-slate-100" onClick={() => { setActiveAvatar(avatar); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-xl">{avatar.name}</h3>
                  <p className="text-white/80 text-sm font-medium mb-2">{avatar.role}</p>
                  <p className="text-white/60 text-xs line-clamp-2 mb-4">{avatar.desc}</p>
                  <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 flex items-center justify-center text-white text-xs font-bold group-hover:bg-white group-hover:text-primary transition-colors">
                    Select Guide
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual Support Section */}
      <Multilingual />

      {/* Offerings Section */}
      <WhatItOffers />

      {/* NEW SECTION 1: How It Works */}
      <section id="how-it-works" className="py-24 bg-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Support in 3 Simple Steps</h2>
            <p className="text-slate-600 text-lg">We've made getting help as easy as sending a text or hopping on a call.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">

            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>

            {[
              { title: "Connect", desc: "Sign up anonymously through your school portal or personal account.", icon: <Users size={32} /> },
              { title: "Interact", desc: "Chat via text or have a live voice session with your AI avatar.", icon: <MessageCircle size={32} /> },
              { title: "Grow", desc: "Receive personalized coping strategies and track your progress.", icon: <TrendingUp size={32} /> }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl border border-orange-50 z-10 shadow-sm">
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-orange-50 shadow-xl flex items-center justify-center mb-6 text-primary relative">
                  {step.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold border-4 border-white">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Student Wellness Platform</h2>
            <p className="text-slate-600 text-lg">Combining advanced avatar interaction with clinical safety protocols.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Live Avatar Calls', desc: 'Face-to-face style interaction for a more human connection.', icon: <Video className="text-orange-500" /> },
              { title: 'Sentiment Analysis', desc: 'Real-time mood tracking to identify burnout early.', icon: <Heart className="text-red-500" /> },
              { title: 'Crisis Escalation', desc: 'Detects severe risks and alerts human professionals instantly.', icon: <Lock className="text-amber-500" /> },
              { title: 'Personalized Coping', desc: 'Tailored breathing exercises, journaling, and advice.', icon: <Brain className="text-primary" /> },
              { title: 'Resource Matching', desc: 'Connects students to existing school resources instantly.', icon: <School className="text-secondary" /> },
              { title: '100% Anonymous', desc: 'Students can open up without fear of judgment or stigma.', icon: <Shield className="text-green-500" /> },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: Impact/Benefits (Reframed) */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -top-40 -right-40"></div>
          <div className="absolute w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] bottom-0 left-0"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Schools Choose Pathlight</h2>
              <p className="text-slate-400 text-lg">We designed our platform to solve the most pressing challenges in student mental health today.</p>
            </div>
            <button onClick={() => navigateTo('Case Studies')} className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">
              View Benefit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: "Accessibility", label: "24/7 support means students get help whenever they need it, not just during school hours." },
              { val: "Scalability", label: "One unified platform to support thousands of students simultaneously." },
              { val: "Efficiency", label: "Frees up human counselors to focus on critical cases requiring deep intervention." },
              { val: "Engagement", label: "Modern avatar interface feels approachable and less clinical for Gen Z." }
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-3">{stat.val}</div>
                <p className="text-slate-300 font-medium leading-relaxed text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Schools Section */}
      <section id="schools" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 mb-6 text-sm font-bold tracking-wide uppercase">
                Admin Dashboard
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Empower your counseling team with data.</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Pathlight doesn't replace counselors; it extends their reach. Get aggregated, privacy-compliant insights into the mental pulse of your student body to allocate resources where they are needed most.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Identify stress hotspots by grade or semester timing.',
                  'Early warning system for bullying trends.',
                  'Automated resource distribution.',
                  'Full HIPAA & FERPA Compliance.'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} className="text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => openAuth('school')} className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/25">
                View Admin Dashboard
              </button>
            </div>
            <div className="relative group cursor-pointer">

              <div className="bg-slate-900 rounded-3xl border-8 border-slate-900 shadow-2xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="Dashboard" className="opacity-80 hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 text-white">
                    <div className="bg-green-500 p-3 rounded-xl">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">System Active</p>
                      <p className="text-slate-300 text-sm">Monitoring 1,240 Students</p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce delay-700">
                <Users className="text-primary" size={24} />
                <div>
                  <p className="text-slate-900 font-bold text-lg">95%</p>
                  <p className="text-slate-500 text-xs font-semibold">Engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">Ready to support your students?</h2>
          <p className="text-slate-600 text-xl mb-12 max-w-2xl mx-auto">Join the movement transforming student mental health support with Pathlight's AI technology.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => openAuth('school')} className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-2xl shadow-primary/20 transform hover:-translate-y-1">
              Request Demo
            </button>
            <button onClick={() => openAuth('student', 'signup')} className="bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors">
              Student Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />


    </div>
  );

}
