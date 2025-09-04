import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Photo } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PhotoComparisonModalProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoComparisonModal: React.FC<PhotoComparisonModalProps> = ({
  photos,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (photos.length > 0 && currentIndex >= 0 && currentIndex < photos.length) {
      setCurrentPhoto(photos[currentIndex]);
    }
  }, [photos, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-lg font-semibold">{currentPhoto.file.name}</h2>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} of {photos.length} • {formatFileSize(currentPhoto.file.size)} • 
              {currentPhoto.originalWidth} × {currentPhoto.originalHeight}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            title={t('close')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
            title="Previous photo"
          >
            <ArrowLeftIcon className="w-8 h-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white hover:bg-white/20 rounded-full transition-colors"
            title="Next photo"
          >
            <ArrowRightIcon className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Image */}
      <div className="flex items-center justify-center w-full h-full p-20">
        <img
          src={currentPhoto.src}
          alt={currentPhoto.file.name}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2 bg-black/50 backdrop-blur-sm rounded-lg p-3 max-w-screen-lg overflow-x-auto">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-2 rounded">
        Use ← → keys to navigate • Press Esc to close
      </div>
    </div>
  );
};

export default PhotoComparisonModal;
