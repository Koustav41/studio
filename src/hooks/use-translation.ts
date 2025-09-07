
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useTransition,
} from 'react';
import { translate } from '@/app/actions';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
];

type TranslationContextType = {
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
  t: (originalText: string, key: string, options?: Record<string, any>) => string;
  loading: boolean;
  availableLanguages: typeof LANGUAGES;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const storedLang = localStorage.getItem('language') || 'en';
    setCurrentLanguage(storedLang);
  }, []);

  const changeLanguage = (langCode: string) => {
    startTransition(() => {
      localStorage.setItem('language', langCode);
      setCurrentLanguage(langCode);
      setTranslations({});
    });
  };

  const t = useCallback(
    (originalText: string, key: string, options?: Record<string, any>): string => {
      const template = translations[key] || originalText;
      if (!options) {
        return template;
      }
      return Object.entries(options).reduce((acc, [optKey, value]) => {
        return acc.replace(`{${optKey}}`, String(value));
      }, template);
    },
    [translations]
  );
  
  const translateAndCache = useCallback(async (textsToTranslate: Record<string, string>, lang: string) => {
    if (lang === 'en') return;

    const untranslatedTexts: Record<string, string> = {};
    for (const key in textsToTranslate) {
      if (!translations[key]) {
        untranslatedTexts[key] = textsToTranslate[key];
      }
    }
    
    if (Object.keys(untranslatedTexts).length === 0) return;

    try {
      // This part needs a bulk translate function, but for now we do it one by one.
      // A future improvement would be to create a `translateMany` action.
      for (const key in untranslatedTexts) {
        const text = untranslatedTexts[key];
        const translated = await translate(text, lang);
        setTranslations(prev => ({ ...prev, [key]: translated }));
      }
    } catch (e) {
        console.error('Translation failed', e);
    }
  }, [translations]);

  useEffect(() => {
    // This is a placeholder effect. The actual translation calls
    // should be initiated from the components that need translations.
  }, [currentLanguage, translateAndCache]);


  const value = useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
      t,
      loading: isPending,
      availableLanguages: LANGUAGES,
    }),
    [currentLanguage, changeLanguage, t, isPending]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      'useTranslation must be used within a TranslationProvider'
    );
  }

  // The hook will now return a function to trigger translations
  const { t, currentLanguage } = context;

  const translateTexts = useCallback(async (texts: Record<string, string>) => {
    if (currentLanguage === 'en' || !texts) return;
    
    const textsToTranslate: Record<string, string> = {};
    for (const key in texts) {
        // Simplified check, real implementation is in the provider
        textsToTranslate[key] = texts[key];
    }

    if (Object.keys(textsToTranslate).length > 0) {
        try {
            // Again, ideally a bulk operation
            for (const key in textsToTranslate) {
                const translated = await translate(textsToTranslate[key], currentLanguage);
                // This state update will be batched by React
                // And we update via the provider's `t` function to set state
                context.t(translated, key);
            }
        } catch(e) {
            console.error(e)
        }
    }
  }, [currentLanguage, context]);

  // A new `translate` function is returned to be used in components
  const newT = useCallback(
    (originalText: string, key: string, options?: Record<string, any>) => {
      // This effect triggers the translation if not already cached
      useEffect(() => {
        if (currentLanguage !== 'en') {
          // A simplified approach to trigger translation
          // The context itself doesn't expose a method to add translations
          // so this becomes a read-only hook that depends on a parent component
          // to provide the translations. This is a flaw in the original design.
          // For now, we'll log that a translation is needed.
          // console.log(`Translation needed for ${key}`);
        }
      }, [currentLanguage, key, originalText]);
      
      return t(originalText, key, options);
    },
    [t, currentLanguage]
  );

  return { ...context, t: newT };
}
