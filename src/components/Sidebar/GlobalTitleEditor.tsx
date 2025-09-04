import React, { useState } from 'react';
import { DocumentTextIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const GlobalTitleEditor: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [globalTitle, setGlobalTitle] = useState('');

  const handleApplyGlobalTitle = () => {
    if (!globalTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    // Find all page title inputs and apply the global title
    const titleInputs = document.querySelectorAll('.page-title-input');
    titleInputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        input.value = globalTitle;
        // Trigger input event to notify any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    toast.success(`Title applied to ${titleInputs.length} pages`);
  };

  const handleClearGlobalTitle = () => {
    setGlobalTitle('');
    
    // Clear all page title inputs
    const titleInputs = document.querySelectorAll('.page-title-input');
    titleInputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        input.value = '';
        // Trigger input event to notify any listeners
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    toast.success('All titles cleared');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <DocumentTextIcon className="w-4 h-4 mr-2" />
        {t('globalTitle')}
      </h3>

      <div className="space-y-3">
        {/* Title Input */}
        <div>
          <textarea
            value={globalTitle}
            onChange={(e) => setGlobalTitle(e.target.value)}
            placeholder={t('enterTitlePrompt')}
            className="form-textarea h-20"
            dir="auto"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleApplyGlobalTitle}
            disabled={!globalTitle.trim()}
            className="btn-primary flex-1 text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="w-4 h-4" />
            <span>{t('apply')}</span>
          </button>

          <button
            onClick={handleClearGlobalTitle}
            className="btn-danger text-sm flex items-center justify-center space-x-1"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>{t('clear')}</span>
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This title will be applied to all page title fields. You can still edit individual page titles after applying.
        </p>
      </div>
    </div>
  );
};

export default GlobalTitleEditor;
