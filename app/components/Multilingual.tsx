
import React from 'react';
import { Languages, Globe } from 'lucide-react';
import FadeIn from './FadeIn';
import { useTranslation } from 'react-i18next';
import '../i18n';

const Multilingual: React.FC = () => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: "English" },
    { code: 'es', label: "Español" },
    { code: 'ja', label: "日本語" },
    { code: 'fr', label: "Français" },
    { code: 'de', label: "Deutsch" },
    { code: 'zh', label: "中文" },
    { code: 'hi', label: "हिन्दी" },
    { code: 'ar', label: "العربية" },
    { code: 'pt', label: "Português" }
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const supportedLanguages = ['en', 'es', 'ja'];

  return (
    <section className="py-20 bg-slate-50 overflow-hidden relative border-t border-orange-100">
      {/* Background decorations matching App.tsx style - lighter for white bg */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 text-primary mb-4 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Globe className="w-4 h-4" />
                <span className="font-bold tracking-wide uppercase text-xs">{t('career_advice.global_reach')}</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">{t('career_advice.title')} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{t('career_advice.native_tongue')}</span></h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                {t('career_advice.description')}
              </p>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang, i) => {
                  const isSupported = supportedLanguages.includes(lang.code);
                  return (
                    <button
                      key={i}
                      onClick={() => isSupported && changeLanguage(lang.code)}
                      disabled={!isSupported}
                      className={`px-4 py-2 border rounded-full text-sm font-medium transition-all ${i18n.language === lang.code
                          ? 'bg-primary text-white border-primary shadow-md'
                          : isSupported
                            ? 'bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:shadow-md'
                            : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
                <span className="px-4 py-2 text-slate-400 text-sm italic font-medium">+{t('career_advice.more')}</span>
              </div>
            </FadeIn>
          </div>
          <div className="md:w-1/2 relative">
            <FadeIn direction="right">
              <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full"></div>
              <div className="relative bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Student" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none text-slate-700 text-sm font-medium">
                    {t('career_advice.example_question')}
                  </div>
                </div>
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200">
                    <Languages className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl rounded-tr-none text-orange-900 text-sm">
                    {t('career_advice.example_answer')}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Multilingual;
