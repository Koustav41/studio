'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/contexts/translation-context';
import { Languages, Loader2 } from 'lucide-react';
import { LANGUAGES } from '@/lib/constants';

export function LanguageSelector() {
  const { changeLanguage, currentLanguage, isTranslating } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {isTranslating ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : (
        <Languages className="h-5 w-5 text-muted-foreground" />
      )}
      <Select onValueChange={changeLanguage} value={currentLanguage}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
