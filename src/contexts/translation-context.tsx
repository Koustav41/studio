'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  startTransition,
} from 'react';
import { translate } from '@/app/actions';

interface TranslationContextType {
  currentLanguage: string;
  changeLanguage: (newLanguage: string) => void;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

const EXCLUDED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'INPUT',
  'SELECT',
]);
const DYNAMIC_CONTENT_ATTR = 'data-dynamic-content';

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalTexts, setOriginalTexts] = useState<Map<Node, string>>(
    new Map()
  );

  const collectTextNodes = useCallback((root: HTMLElement) => {
    const texts = new Map<Node, string>();
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      (node) => {
        if (
          !node.textContent?.trim() ||
          (node.parentElement &&
            EXCLUDED_TAGS.has(node.parentElement.tagName))
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      texts.set(node, node.textContent!);
    }
    return texts;
  }, []);

  const restoreOriginalTexts = useCallback(() => {
    originalTexts.forEach((originalText, node) => {
      if (node.isConnected) {
        node.textContent = originalText;
      }
    });
  }, [originalTexts]);

  const changeLanguage = useCallback(
    async (newLanguage: string) => {
      if (newLanguage === currentLanguage) return;

      startTransition(() => {
        setIsTranslating(true);
      });

      if (newLanguage === 'en') {
        restoreOriginalTexts();
        setCurrentLanguage('en');
        setIsTranslating(false);
        setOriginalTexts(new Map());
        return;
      }

      let textsToTranslateMap: Map<Node, string>;

      if (currentLanguage === 'en') {
        textsToTranslateMap = collectTextNodes(document.body);
        setOriginalTexts(textsToTranslateMap);
      } else {
        restoreOriginalTexts();
        textsToTranslateMap = originalTexts;
      }

      const texts = Array.from(textsToTranslateMap.values());
      if (texts.length === 0) {
        setCurrentLanguage(newLanguage);
        setIsTranslating(false);
        return;
      }

      try {
        const result = await translate({
          texts: texts,
          targetLanguage: newLanguage,
        });

        if (result.translations) {
          const nodes = Array.from(textsToTranslateMap.keys());
          result.translations.forEach((translatedText, index) => {
            const node = nodes[index];
            if (node && node.isConnected) {
              node.textContent = translatedText;
            }
          });
          setCurrentLanguage(newLanguage);
        }
      } catch (error) {
        console.error('Translation failed:', error);
        restoreOriginalTexts(); // Restore on error
      } finally {
        setIsTranslating(false);
      }
    },
    [
      currentLanguage,
      collectTextNodes,
      restoreOriginalTexts,
      originalTexts,
    ]
  );
  
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      if (currentLanguage !== 'en') {
         // A simple way to re-apply translation on DOM changes.
         // This is a basic implementation and might have performance implications
         // on very dynamic pages. A more robust solution would be more granular.
        changeLanguage(currentLanguage);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false, // Don't observe text changes we are making
    });

    return () => observer.disconnect();
  }, [currentLanguage, changeLanguage]);


  const value = useMemo(
    () => ({ currentLanguage, changeLanguage, isTranslating }),
    [currentLanguage, changeLanguage, isTranslating]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      'useTranslation must be used within a TranslationProvider'
    );
  }
  return context;
};
