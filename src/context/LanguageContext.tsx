import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { languages, getTranslation, getCurrentLanguage, setLanguage } from '../utils/translations';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (languageCode: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    // Set only language attribute; do not change text direction automatically
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const changeLanguage = (languageCode: string) => {
    const newLanguage = languages.find(lang => lang.code === languageCode);
    if (newLanguage) {
      setCurrentLanguage(newLanguage);
      setLanguage(languageCode);
      
      // Update only language attribute; keep direction unchanged
    document.documentElement.lang = newLanguage.code;
    }
  };

  const t = (key: string, params: Record<string, string | number> = {}) => {
    return getTranslation(key, currentLanguage.code, params);
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
