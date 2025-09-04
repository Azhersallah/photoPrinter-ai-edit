import React, { useState } from 'react';
import { 
  DocumentPlusIcon, 
  DocumentDuplicateIcon, 
  DocumentMinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { usePhotoLayouts, useAppSettings } from '../../context/PhotoContext';
import toast from 'react-hot-toast';

const PageManagement: React.FC = () => {
  const { t } = useLanguage();
  const { pageLayouts, insertPage, duplicatePage, clearPage } = usePhotoLayouts();
  const { settings, updateSettings } = useAppSettings();
  const [pagesPerSectionInput, setPagesPerSectionInput] = useState(settings.pagesPerSection);

  const handleInsertPage = (position: 'start' | 'end') => {
    insertPage(position);
    toast.success(`Page inserted at ${position}`);
  };

  const handleInsertCustomPage = () => {
    const pageNumber = prompt(t('promptPageNumberInsert'));
    if (pageNumber) {
      const pageNum = parseInt(pageNumber);
      if (pageNum > 0 && pageNum <= pageLayouts.length + 1) {
        insertPage(pageNum);
        toast.success(`Page inserted at position ${pageNum}`);
      } else {
        toast.error(t('invalidPageNumber'));
      }
    }
  };

  const handleDuplicatePage = () => {
    const pageNumber = prompt(t('promptPageNumberDuplicate'));
    if (pageNumber) {
      const pageNum = parseInt(pageNumber);
      if (pageNum > 0 && pageNum <= pageLayouts.length) {
        duplicatePage(pageNum);
        toast.success(`Page ${pageNum} duplicated`);
      } else {
        toast.error(t('invalidPageNumber'));
      }
    }
  };

  const handleClearPage = () => {
    const pageNumber = prompt(t('promptPageNumberClear'));
    if (pageNumber) {
      const pageNum = parseInt(pageNumber);
      if (pageNum > 0 && pageNum <= pageLayouts.length) {
        if (confirm(`Clear page ${pageNum}? This will remove all photos and content.`)) {
          clearPage(pageNum);
          toast.success(`Page ${pageNum} cleared`);
        }
      } else {
        toast.error(t('invalidPageNumber'));
      }
    }
  };

  const handleSetPagesPerSection = () => {
    if (pagesPerSectionInput > 0) {
      updateSettings({ pagesPerSection: pagesPerSectionInput });
      toast.success(`Pages per section set to ${pagesPerSectionInput}`);
    }
  };

  const handlePrevSection = () => {
    if (settings.currentSection > 1) {
      updateSettings({ currentSection: settings.currentSection - 1 });
    }
  };

  const handleNextSection = () => {
    if (settings.currentSection < settings.totalSections) {
      updateSettings({ currentSection: settings.currentSection + 1 });
    }
  };

  const startPage = (settings.currentSection - 1) * settings.pagesPerSection + 1;
  const endPage = Math.min(settings.currentSection * settings.pagesPerSection, pageLayouts.length);

  return (
    <div className="space-y-4">
      {/* Page Management Header */}
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <DocumentPlusIcon className="w-4 h-4 mr-2" />
        {t('pageManagement')}
      </h3>

      {/* Page Operations */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleInsertPage('start')}
            className="btn-secondary text-xs flex flex-col items-center p-2"
            title={t('insertPageStart')}
          >
            <DocumentPlusIcon className="w-4 h-4 mb-1" />
            <span>{t('insertStart')}</span>
          </button>

          <button
            onClick={() => handleInsertPage('end')}
            className="btn-secondary text-xs flex flex-col items-center p-2"
            title={t('insertPageEnd')}
          >
            <DocumentPlusIcon className="w-4 h-4 mb-1" />
            <span>{t('insertEnd')}</span>
          </button>

          <button
            onClick={handleInsertCustomPage}
            className="btn-secondary text-xs flex flex-col items-center p-2"
            title={t('insertPageCustom')}
          >
            <DocumentPlusIcon className="w-4 h-4 mb-1" />
            <span>{t('insertCustom')}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDuplicatePage}
            className="btn-secondary text-xs flex items-center justify-center space-x-1"
            title={t('duplicateSpecificPage')}
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
            <span>{t('duplicatePage')}</span>
          </button>

          <button
            onClick={handleClearPage}
            className="btn-secondary text-xs flex items-center justify-center space-x-1"
            title={t('clearSpecificPage')}
          >
            <DocumentMinusIcon className="w-4 h-4" />
            <span>{t('clearPage')}</span>
          </button>
        </div>
      </div>

      {/* Pages Per Section Settings */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
          <Cog6ToothIcon className="w-3 h-3 mr-1" />
          {t('pagePerSection')}
        </h4>
        
        <div className="flex space-x-2">
          <input
            type="number"
            min="1"
            max="50"
            value={pagesPerSectionInput}
            onChange={(e) => setPagesPerSectionInput(parseInt(e.target.value) || 1)}
            className="form-input text-sm flex-1"
          />
          <button
            onClick={handleSetPagesPerSection}
            className="btn-primary text-xs px-3"
          >
            {t('set')}
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      {pageLayouts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Section Navigation
          </h4>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevSection}
              disabled={settings.currentSection <= 1}
              className="btn-icon btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('previous')}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="text-xs font-medium text-gray-900 dark:text-white">
                Section {settings.currentSection} of {settings.totalSections}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('pagesRangeOfTotal', {
                  startPage,
                  endPage: endPage !== startPage ? `-${endPage}` : '',
                  totalPages: pageLayouts.length
                })}
              </div>
            </div>

            <button
              onClick={handleNextSection}
              disabled={settings.currentSection >= settings.totalSections}
              className="btn-icon btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('next')}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Stats */}
      {pageLayouts.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Page Statistics</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Pages:</span>
              <span className="font-medium text-gray-900 dark:text-white">{pageLayouts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current Section:</span>
              <span className="font-medium text-gray-900 dark:text-white">{settings.currentSection}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Sections:</span>
              <span className="font-medium text-gray-900 dark:text-white">{settings.totalSections}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageManagement;
