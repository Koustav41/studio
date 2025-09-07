
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
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
  t: (text: string, key?: string) => string;
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
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      changeLanguage(storedLang);
    }
  }, []);

  const changeLanguage = useCallback(
    async (langCode: string) => {
      if (langCode === currentLanguage && langCode !== 'en') return;

      localStorage.setItem('language', langCode);
      setCurrentLanguage(langCode);

      if (langCode === 'en') {
        setTranslations({});
        return;
      }

      setLoading(true);
      const textsToTranslate = Object.values(translations)
        .map((v) => v.split('__ORIGINAL__')[1])
        .filter(Boolean);

      try {
        const translatedTexts = await Promise.all(
          textsToTranslate.map((text) => translate(text, langCode))
        );

        const newTranslations: Record<string, string> = {};
        Object.keys(translations).forEach((key, index) => {
          const originalText = textsToTranslate[index];
          const translatedText = translatedTexts[index];
          if (originalText && translatedText) {
            newTranslations[key] = `${translatedText}__ORIGINAL__${originalText}`;
          }
        });
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Translation failed', error);
      } finally {
        setLoading(false);
      }
    },
    [currentLanguage, translations]
  );

  const t = useCallback(
    (text: string, key?: string): string => {
      const translationKey = key || text;

      if (!isMounted || currentLanguage === 'en') {
        return text;
      }

      const storedTranslation = translations[translationKey];

      if (storedTranslation) {
        return storedTranslation.split('__ORIGINAL__')[0];
      }

      if (!loading) {
        const isAlreadyTracked = translationKey in translations;

        if (!isAlreadyTracked) {
          setTranslations((prev) => ({
            ...prev,
            [translationKey]: `...__ORIGINAL__${text}`,
          }));

          translate(text, currentLanguage)
            .then((translated) => {
              setTranslations((prev) => ({
                ...prev,
                [translationKey]: `${translated}__ORIGINAL__${text}`,
              }));
            })
            .catch((e) => {
              console.error(e);
              setTranslations((prev) => ({
                ...prev,
                [translationKey]: `${text}__ORIGINAL__${text}`,
              }));
            });
        }
      }
      return storedTranslation ? storedTranslation.split('__ORIGINAL__')[0] : '';
    },
    [currentLanguage, translations, loading, isMounted]
  );

  const value = useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
      t,
      loading,
      availableLanguages: LANGUAGES,
    }),
    [currentLanguage, changeLanguage, t, loading]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      'useTranslation must be used within a TranslationProvider'
    );
  }
  return context;
};
