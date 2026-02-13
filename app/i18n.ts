'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
    .use(resourcesToBackend((language: string, namespace: string) => import(`../public/locales/${language}/${namespace}.json`)))
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'es', 'ja'],
        load: 'languageOnly', // transform en-US to en
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            useSuspense: false // fix for hydration mismatch with next.js if needed, or handle loading state
        }
    });

export default i18n;
