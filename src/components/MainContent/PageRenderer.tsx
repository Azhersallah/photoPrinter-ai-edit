import React, { useState } from 'react';
import { PencilIcon, PhotoIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { PageLayout } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { usePhotoLayouts, usePhotoEditor } from '../../context/PhotoContext';

interface PageRendererProps {
  pageLayout: PageLayout;
}

const PageRenderer: React.FC<PageRendererProps> = ({ pageLayout }) => {
  const { t, currentLanguage } = useLanguage();
  const { updatePageLayout } = usePhotoLayouts();
  const { openEditor } = usePhotoEditor();
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [pageTitle, setPageTitle] = useState(pageLayout.title || '');
  const [pageTexts, setPageTexts] = useState<string[]>(pageLayout.texts || []);

  const handleTitleChange = (newTitle: string) => {
    setPageTitle(newTitle);
    updatePageLayout(pageLayout.id, { title: newTitle });
  };

  const handleTextChange = (index: number, newText: string) => {
    const updatedTexts = [...pageTexts];
    updatedTexts[index] = newText;
    setPageTexts(updatedTexts);
    updatePageLayout(pageLayout.id, { texts: updatedTexts });
  };

  const handleRotate = (photoId: string) => {
    setRotations(prev => ({ ...prev, [photoId]: ((prev[photoId] || 0) + 90) % 360 }));
  };

  const handleDeleteFromPage = (index: number) => {
    const newPhotos = [...pageLayout.photos];
    newPhotos.splice(index, 1);
    updatePageLayout(pageLayout.id, { photos: newPhotos });
  };

  const renderPhotoSlot = (index: number) => {
    const photo = pageLayout.photos[index];
    
    if (photo) {
      return (
        <div className="relative w-full h-full group bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm flex items-center justify-center">
          <img
            src={photo.src}
            alt={photo.file.name}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `rotate(${rotations[photo.id] || 0}deg)` }}
          />
          {/* Photo overlay actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 no-print">
            <div className="flex space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); openEditor(photo, rotations[photo.id] || 0); }}
                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full transition-colors"
                title={t('edit')}
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleRotate(photo.id); }}
                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full transition-colors"
                title={t('rotateRight')}
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteFromPage(index); }}
                className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full transition-colors"
                title={t('delete')}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Photo number badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {index + 1}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="text-center text-gray-400 dark:text-gray-500">
          <PhotoIcon className="w-8 h-8 mx-auto mb-2" />
          <div className="text-sm">Photo {index + 1}</div>
        </div>
      </div>
    );
  };

  const renderTextArea = (index: number) => {
    return (
      <textarea
        value={pageTexts[index] || ''}
        onChange={(e) => handleTextChange(index, e.target.value)}
        placeholder={t('textAreaPlaceholder')}
        className="layout-text-area w-full h-full resize-none border border-gray-300 rounded-xl p-3 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        dir="auto"
      />
    );
  };

  const renderLayout = () => {
    const { layout } = pageLayout;

    switch (layout) {
      case '1':
        return (
          <div className="w-full h-full">
            {renderPhotoSlot(0)}
          </div>
        );

      case '2':
        return (
          <div className="grid grid-cols-2 gap-4 print:gap-2 w-full h-full">
            {renderPhotoSlot(0)}
            {renderPhotoSlot(1)}
          </div>
        );

      case '4':
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 print:gap-2 w-full h-full">
            {renderPhotoSlot(0)}
            {renderPhotoSlot(1)}
            {renderPhotoSlot(2)}
            {renderPhotoSlot(3)}
          </div>
        );

      case '2text':
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 print:gap-2 w-full h-full">
            {renderPhotoSlot(0)}
            {renderTextArea(0)}
            {renderPhotoSlot(1)}
            {renderTextArea(1)}
          </div>
        );

      case '1text':
        return (
          <div className="grid grid-cols-2 gap-4 print:gap-2 w-full h-full">
            {renderPhotoSlot(0)}
            {renderTextArea(0)}
          </div>
        );

      default:
        return (
          <div className="w-full h-full">
            {renderPhotoSlot(0)}
          </div>
        );
    }
  };

  return (
    <div
      className="a4-page bg-white shadow-lg rounded-lg border border-gray-200 mx-auto my-6 print:shadow-none print:border-none print:rounded-none print:mx-0 flex flex-col"
      data-page-id={pageLayout.id}
    >
      {/* Page Header */}
      <div className="mb-6">
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder={`${t('pageTitle')} ${pageLayout.pageNumber}`}
          className="page-title-input w-full text-xl font-bold text-center border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
          dir="auto"
        />
      </div>

      {/* Page Content */}
      <div className="flex-1 min-h-0 h-full overflow-hidden">
        {renderLayout()}
      </div>

      {/* Page Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="text-left">{new Date().toLocaleDateString()}</div>
        <div className="text-center">({pageLayout.pageNumber})</div>
        <div className="text-right"></div>
      </div>
    </div>
  );
};

export default PageRenderer;
