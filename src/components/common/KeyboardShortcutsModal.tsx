import React, { useState, useEffect } from 'react';
import { XMarkIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { groupShortcutsByCategory, getShortcutString } from '../../utils/keyboardShortcuts';

const KeyboardShortcutsModal: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const shortcutGroups = groupShortcutsByCategory();

  useEffect(() => {
    const handleShowShortcuts = () => setIsOpen(true);
    
    window.addEventListener('showKeyboardShortcuts', handleShowShortcuts);
    
    return () => {
      window.removeEventListener('showKeyboardShortcuts', handleShowShortcuts);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <CommandLineIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="btn-icon btn-secondary"
            title={t('close')}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(shortcutGroups).map(([category, shortcuts]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {category}
                </h3>
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getShortcutString(shortcut).split(' + ').map((key, keyIndex, keys) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                              {key}
                            </kbd>
                            {keyIndex < keys.length - 1 && (
                              <span className="text-gray-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">?</kbd> anytime to show this help</p>
            <p>Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Esc</kbd> to close</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
