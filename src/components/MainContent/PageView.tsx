import React, { useEffect, useState } from 'react';
import { usePhotoLayouts, useAppSettings } from '../../context/PhotoContext';
import { useLanguage } from '../../context/LanguageContext';
import PageRenderer from './PageRenderer';

const PageView: React.FC = () => {
  const { t } = useLanguage();
  const { pageLayouts, createPageLayouts } = usePhotoLayouts();
  const { settings } = useAppSettings();
  const [currentPages, setCurrentPages] = useState<any[]>([]);

  // Calculate which pages to show based on current section
  useEffect(() => {
    const startIndex = (settings.currentSection - 1) * settings.pagesPerSection;
    const endIndex = Math.min(startIndex + settings.pagesPerSection, pageLayouts.length);
    const pagesToShow = pageLayouts.slice(startIndex, endIndex);
    setCurrentPages(pagesToShow);
  }, [pageLayouts, settings.currentSection, settings.pagesPerSection]);

  // Create initial page layouts if photos exist but no layouts
  useEffect(() => {
    if (pageLayouts.length === 0) {
      createPageLayouts();
    }
  }, [pageLayouts.length, createPageLayouts]);

  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-800">
      {/* Page View Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 no-print sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Page Layout Preview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Section {settings.currentSection} of {settings.totalSections} • 
              Showing pages {currentPages.length > 0 ? currentPages[0]?.pageNumber : 0} - {currentPages.length > 0 ? currentPages[currentPages.length - 1]?.pageNumber : 0}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>A4 Format (210 × 297 mm)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Print Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Container */}
      <div className="p-6 md:p-8">
        {currentPages.length > 0 ? (
          <div className="space-y-8">
            {currentPages.map((pageLayout) => (
              <PageRenderer 
                key={pageLayout.id} 
                pageLayout={pageLayout}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No pages in this section
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add photos or change the section to view pages
            </p>
          </div>
        )}
      </div>

      {/* Print footer info */}
      <div className="no-print bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div>
            Layout: {settings.photosPerPage === '1' && '1 Photo per page'}
            {settings.photosPerPage === '2' && '2 Photos per page'}
            {settings.photosPerPage === '4' && '4 Photos per page'}
            {settings.photosPerPage === '2text' && '2 Photos + 2 Text areas'}
            {settings.photosPerPage === '1text' && '1 Photo + 1 Text area'}
          </div>
          <div>
            Total pages: {pageLayouts.length} • 
            Pages per section: {settings.pagesPerSection}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageView;
