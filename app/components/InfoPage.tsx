"use client";

import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Brain, Heart, Phone, Users, FileText, Globe, School, Award, Briefcase } from 'lucide-react';
import { Logo } from './Logo';

interface InfoPageProps {
  title: string;
  onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getContent = () => {
    switch (title) {
      case 'About Us':
        return {
          icon: <Users className="w-12 h-12 text-primary" />,
          content: (
            <div className="space-y-6">
              <p>Pathlight AI was founded with a simple mission: to ensure no student ever feels alone. We combine cutting-edge artificial intelligence with clinical psychological principles to create a safe, accessible space for mental wellness.</p>
              <p>Our team consists of former school counselors, child psychologists, and AI engineers working together to bridge the gap in mental health support availability.</p>
            </div>
          )
        };
      case 'Careers':
        return {
          icon: <Briefcase className="w-12 h-12 text-primary" />,
          content: (
            <div className="space-y-6">
              <p>Join us in revolutionizing student mental health. We are currently hiring for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Senior AI Ethics Researcher</li>
                <li>Clinical Psychologist Consultant</li>
                <li>Full Stack Engineer (React/Node)</li>
                <li>School Success Manager</li>
              </ul>
              <p className="font-bold mt-4">Send your resume to careers@pathlight.ai</p>
            </div>
          )
        };
      case 'Crisis Hotlines':
        return {
          icon: <Phone className="w-12 h-12 text-red-500" />,
          content: (
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-bold text-red-700">If you are in immediate danger, call 911.</p>
              </div>
              <h3 className="font-bold text-lg">National Resources</h3>
              <ul className="space-y-4">
                <li className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="font-bold">988 Suicide & Crisis Lifeline</div>
                  <div className="text-slate-500">Call or Text: 988</div>
                </li>
                <li className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="font-bold">Crisis Text Line</div>
                  <div className="text-slate-500">Text HOME to 741741</div>
                </li>
                <li className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="font-bold">The Trevor Project (LGBTQ+)</div>
                  <div className="text-slate-500">1-866-488-7386</div>
                </li>
              </ul>
            </div>
          )
        };
      case 'Integration API':
        return {
          icon: <Logo className="w-12 h-12 text-amber-500" />,
          content: (
            <div className="space-y-6">
              <p>Pathlight integrates seamlessly with major Learning Management Systems (LMS) and Student Information Systems (SIS).</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded border text-center font-semibold">Canvas</div>
                <div className="p-4 bg-slate-50 rounded border text-center font-semibold">Blackboard</div>
                <div className="p-4 bg-slate-50 rounded border text-center font-semibold">PowerSchool</div>
                <div className="p-4 bg-slate-50 rounded border text-center font-semibold">Google Classroom</div>
              </div>
              <p>Documentation available for registered partners.</p>
            </div>
          )
        };
      case 'Contact':
        return {
          icon: <School className="w-12 h-12 text-blue-500" />,
          content: (
            <div className="space-y-6">
              <p>We'd love to hear from you. Reach out to our team for demos, support, or general inquiries.</p>
              <div className="space-y-2">
                <p><strong>General Inquiries:</strong> hello@pathlight.ai</p>
                <p><strong>Support:</strong> support@pathlight.ai</p>
                <p><strong>Sales:</strong> sales@pathlight.ai</p>
                <p><strong>Address:</strong> 123 Innovation Dr, San Francisco, CA 94105</p>
              </div>
            </div>
          )
        };
      case 'Counselor Training':
        return {
          icon: <Award className="w-12 h-12 text-orange-500" />,
          content: (
            <div className="space-y-4">
              <p>We provide comprehensive training for school counselors to effectively utilize Pathlight's data insights.</p>
              <p>Our 4-week certification program covers:</p>
              <ul className="list-disc pl-5">
                <li>Dashboard Analytics Mastery</li>
                <li>Digital Intervention Strategies</li>
                <li>Ethical AI Usage in Schools</li>
              </ul>
            </div>
          )
        };
      case 'Case Studies':
        return {
          icon: <FileText className="w-12 h-12 text-green-500" />,
          content: (
            <div className="space-y-4">
              <h3 className="font-bold">Riverdale High School</h3>
              <p>Reduced counselor administrative load by 40% in the first semester.</p>
              <h3 className="font-bold mt-4">Oakwood Academy</h3>
              <p>Identified and intervened in 15 critical mental health cases early using Pathlight's sentiment analysis.</p>
            </div>
          )
        };
      case 'Help Center':
        return {
          icon: <Heart className="w-12 h-12 text-pink-500" />,
          content: (
            <div className="space-y-4">
              <p>Browse our ICONS and FAQs.</p>
              <div className="space-y-2">
                <details className="bg-white p-4 rounded border">
                  <summary className="font-semibold cursor-pointer">How do I reset my password?</summary>
                  <p className="mt-2 text-sm text-slate-600">Click 'Forgot Password' on the login screen or contact your school admin.</p>
                </details>
                <details className="bg-white p-4 rounded border">
                  <summary className="font-semibold cursor-pointer">Is my chat private?</summary>
                  <p className="mt-2 text-sm text-slate-600">Yes, chats are anonymous unless a severe safety risk is detected.</p>
                </details>
              </div>
            </div>
          )
        };
      case 'Cookies':
        return {
          icon: <Globe className="w-12 h-12 text-slate-500" />,
          content: (
            <div className="space-y-4">
              <p>We use essential cookies to keep you logged in and secure. We do not use advertising cookies or track you across other sites.</p>
            </div>
          )
        };
      default:
        return {
          icon: <Shield className="w-12 h-12 text-slate-400" />,
          content: <p>Content for {title} is currently being updated. Please check back later.</p>
        };
    }
  };

  const { icon, content } = getContent();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="text-primary">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Pathlight</span>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-8">
            <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          </div>
          <div className="prose prose-slate max-w-none">
            {content}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white py-8 text-center text-slate-500 text-sm">
        &copy; 2024 Pathlight AI Inc. All rights reserved.
      </div>
    </div>
  );
};

export default InfoPage;
