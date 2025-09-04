import React, { useEffect } from 'react';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { useFindReplaceStore } from '../../store/findReplaceStore';

const FindReplacePanel: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const {
    isOpen,
    findText,
    replaceText,
    foundOccurrences,
    currentOccurrenceIndex,
    closePanel,
    setFindText,
    setReplaceText,
    findTextInPages,
    findNext,
    findPrevious,
    replaceCurrentOccurrence,
    replaceAllOccurrences,
  } = useFindReplaceStore();

  // Auto-search when find text changes (with debounce)
  useEffect(() => {
    if (findText.trim()) {
      const timeoutId = setTimeout(() => {
        findTextInPages(findText);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [findText, findTextInPages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        findPrevious();
      } else {
        findNext();
      }
    } else if (e.key === 'Escape') {
      closePanel();
    }
  };

  const handleReplace = () => {
    replaceCurrentOccurrence(replaceText);
  };

  const handleReplaceAll = () => {
    const count = replaceAllOccurrences(findText, replaceText);
    // The count is handled internally by the store
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-6 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-40 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('findReplace')}
          </h3>
        </div>
        <button
          onClick={closePanel}
          className="btn-icon btn-secondary"
          title={t('close')}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Find Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('find')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('enterTextToFind')}
              className="form-input pr-10"
              dir="auto"
              autoFocus
            />
            {findText && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                {foundOccurrences.length > 0 && (
                  <span>
                    {currentOccurrenceIndex + 1}/{foundOccurrences.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Replace Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('replaceWith')}
          </label>
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('enterReplacementText')}
            className="form-input"
            dir="auto"
          />
        </div>

        {/* Search Results Status */}
        {findText && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {foundOccurrences.length === 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{t('noMatchesFound')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {t('matchesFound', {
                      current: currentOccurrenceIndex + 1,
                      total: foundOccurrences.length
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={findPrevious}
              disabled={foundOccurrences.length === 0}
              className="btn-secondary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Find Previous (Shift+Enter)"
            >
              <ArrowDownIcon className="w-4 h-4 mr-2 rotate-180" />
              Previous
            </button>
            <button
              onClick={findNext}
              disabled={foundOccurrences.length === 0}
              className="btn-secondary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Find Next (Enter)"
            >
              <ArrowDownIcon className="w-4 h-4 mr-2" />
              {t('findNext')}
            </button>
          </div>

          {/* Replace Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleReplace}
              disabled={foundOccurrences.length === 0 || currentOccurrenceIndex === -1}
              className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              {t('replace')}
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={foundOccurrences.length === 0}
              className="btn-secondary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              {t('replaceAll')}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Press Enter to find next, Shift+Enter to find previous</p>
          <p>• Press Escape to close this panel</p>
          <p>• Search includes page titles and text areas</p>
        </div>
      </div>
    </div>
  );
};

export default FindReplacePanel;
