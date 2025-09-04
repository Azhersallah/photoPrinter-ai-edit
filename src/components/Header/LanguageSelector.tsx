import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-icon btn-secondary flex items-center space-x-2"
        title="Change Language"
      >
        <LanguageIcon className="w-5 h-5" />
        <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentLanguage.code === language.code
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                dir="auto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{language.name}</div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
