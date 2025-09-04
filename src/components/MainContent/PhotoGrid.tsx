import React, { useState } from 'react';
import { 
  TrashIcon, 
  PencilIcon, 
  ArrowPathIcon,
  EyeIcon,
  ViewColumnsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { usePhotos, usePhotoSelection, usePhotoEditor } from '../../context/PhotoContext';
import { useLanguage } from '../../context/LanguageContext';
import { Photo } from '../../types';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

const PhotoGrid: React.FC = () => {
  const { t } = useLanguage();
  const { photos, removePhoto } = usePhotos();
  const { selectedPhotos, togglePhotoSelection } = usePhotoSelection();
  const { openEditor } = usePhotoEditor();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [rotations, setRotations] = useState<Record<string, number>>({});

  const handleDeletePhoto = (photo: Photo) => {
    if (confirm(t('deletePhotoConfirm') + ` ${photo.file.name}?`)) {
      removePhoto(photo.id);
      toast.success('Photo deleted');
    }
  };

  const handleEditPhoto = (photo: Photo) => {
    openEditor(photo);
  };

  const handleRotatePhoto = (photoId: string) => {
    setRotations(prev => ({
      ...prev,
      [photoId]: ((prev[photoId] || 0) + 90) % 360
    }));
  };

  const handlePhotoClick = (photo: Photo, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      togglePhotoSelection(photo.id);
    } else {
      openEditor(photo);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (photos.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Photos ({photos.length})
          </h2>
          
          <div className="flex items-center space-x-2">
            {/* View mode toggle */}
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="Grid View"
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="List View"
              >
                <ViewColumnsIcon className="w-4 h-4" />
              </button>
            </div>

            {selectedPhotos.size > 0 && (
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                {selectedPhotos.size} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Photo Grid/List */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`photo-container group cursor-pointer transition-all duration-200 ${
                  selectedPhotos.has(photo.id) 
                    ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900' 
                    : ''
                }`}
                onClick={(e) => handlePhotoClick(photo, e)}
              >
                {/* Photo */}
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={photo.src}
                    alt={photo.file.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    style={{ transform: `rotate(${rotations[photo.id] || 0}deg)` }}
                  />
                  
                  {/* Photo number badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>

                  {/* Selection indicator */}
                  {selectedPhotos.has(photo.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPhoto(photo);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full transition-colors"
                        title={t('edit')}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotatePhoto(photo.id);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full transition-colors"
                        title={t('rotateRight')}
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo);
                        }}
                        className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full transition-colors"
                        title={t('delete')}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo info */}
                <div className="p-2 text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {photo.file.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {formatFileSize(photo.file.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`photo-container flex items-center p-4 cursor-pointer transition-all duration-200 ${
                  selectedPhotos.has(photo.id) 
                    ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900' 
                    : ''
                }`}
                onClick={(e) => handlePhotoClick(photo, e)}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                  <img
                    src={photo.src}
                    alt={photo.file.name}
                    className="w-full h-full object-cover"
                    style={{ transform: `rotate(${rotations[photo.id] || 0}deg)` }}
                  />
                </div>

                {/* Photo info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {photo.file.name}
                    </h3>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatFileSize(photo.file.size)}</span>
                    <span>{photo.originalWidth} × {photo.originalHeight}</span>
                    <span>{photo.file.type}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPhoto(photo);
                    }}
                    className="btn-icon btn-secondary"
                    title={t('edit')}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRotatePhoto(photo.id);
                    }}
                    className="btn-icon btn-secondary"
                    title={t('rotateRight')}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(photo);
                    }}
                    className="btn-icon btn-danger"
                    title={t('delete')}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Selection indicator */}
                {selectedPhotos.has(photo.id) && (
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center ml-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGrid;
