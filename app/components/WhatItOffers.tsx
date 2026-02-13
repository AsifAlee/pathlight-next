"use client";
import React from 'react';
import { BookOpen, GraduationCap, Briefcase } from './Icons';
import FadeIn from './FadeIn';

import { useTranslation } from 'react-i18next';
import '../i18n';

const WhatItOffers: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section id="offerings" className="py-24 bg-white relative border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <FadeIn>
                    <div className="mb-24">
                        <span className="text-secondary font-bold tracking-widest uppercase text-xs">{t('offerings.label')}</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6 tracking-tight text-slate-900">{t('offerings.title')}</h2>
                    </div>
                </FadeIn>

                <div className="space-y-32">
                    {/* Item 1: Skill Gap Analysis */}
                    <FadeIn>
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2 order-2 lg:order-1 relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 to-orange-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
                                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Skills Analysis" className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 order-1 lg:order-2">
                                <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                    <BookOpen className="text-amber-600 w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-slate-900 tracking-tight">{t('offerings.item1_title')}</h3>
                                <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                                    {t('offerings.item1_desc')}
                                </p>
                                <ul className="space-y-4">
                                    {[t('offerings.item1_li1'), t('offerings.item1_li2'), t('offerings.item1_li3')].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-700 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-4 shadow-sm"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Item 2: University Finder */}
                    <FadeIn>
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                    <GraduationCap className="text-orange-600 w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-slate-900 tracking-tight">{t('offerings.item2_title')}</h3>
                                <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                                    {t('offerings.item2_desc')}
                                </p>
                                <ul className="space-y-4">
                                    {[t('offerings.item2_li1'), t('offerings.item2_li2'), t('offerings.item2_li3')].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-700 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mr-4 shadow-sm"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:w-1/2 relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-orange-200 to-red-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white aspect-video">
                                    <img
                                        src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                        alt="University Campus"
                                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Item 3: Resume Builder */}
                    <FadeIn>
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2 order-2 lg:order-1 relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
                                    <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Workplace" className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                            <div className="lg:w-1/2 order-1 lg:order-2">
                                <div className="w-14 h-14 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                    <Briefcase className="text-yellow-600 w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-slate-900 tracking-tight">{t('offerings.item3_title')}</h3>
                                <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                                    {t('offerings.item3_desc')}
                                </p>
                                <ul className="space-y-4">
                                    {[t('offerings.item3_li1'), t('offerings.item3_li2'), t('offerings.item3_li3')].map((item, i) => (
                                        <li key={i} className="flex items-center text-slate-700 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-4 shadow-sm"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default WhatItOffers;
