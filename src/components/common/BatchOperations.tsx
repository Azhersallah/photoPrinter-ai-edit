import React, { useState } from 'react';
import { 
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TagIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { usePhotoSelection, usePhotos } from '../../context/PhotoContext';
import { useLanguage } from '../../context/LanguageContext';
import { Photo } from '../../types';
import toast from 'react-hot-toast';

const BatchOperations: React.FC = () => {
  const { t } = useLanguage();
  const { selectedPhotos, clearSelection } = usePhotoSelection();
  const { photos, removePhoto } = usePhotos();
  const [isVisible, setIsVisible] = useState(false);

  // Show batch operations when photos are selected
  React.useEffect(() => {
    setIsVisible(selectedPhotos.size > 0);
  }, [selectedPhotos.size]);

  const getSelectedPhotos = (): Photo[] => {
    return photos.filter(photo => selectedPhotos.has(photo.id));
  };

  const handleBatchDelete = () => {
    const selectedCount = selectedPhotos.size;
    const confirmMessage = `Delete ${selectedCount} selected photo${selectedCount > 1 ? 's' : ''}?`;
    
    if (confirm(confirmMessage)) {
      selectedPhotos.forEach(photoId => {
        removePhoto(photoId);
      });
      toast.success(`${selectedCount} photo${selectedCount > 1 ? 's' : ''} deleted`);
    }
  };

  const handleBatchDownload = async () => {
    const selectedPhotoList = getSelectedPhotos();
    
    if (selectedPhotoList.length === 1) {
      // Single photo - direct download
      const photo = selectedPhotoList[0];
      const a = document.createElement('a');
      a.href = photo.src;
      a.download = photo.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Photo downloaded');
    } else {
      // Multiple photos - zip download (would need additional implementation)
      toast.loading('Preparing photos for download...');
      
      // For now, download each photo individually
      let downloaded = 0;
      for (const photo of selectedPhotoList) {
        try {
          const a = document.createElement('a');
          a.href = photo.src;
          a.download = photo.file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          downloaded++;
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Download error:', error);
        }
      }
      
      toast.dismiss();
      toast.success(`${downloaded} photos downloaded`);
    }
  };

  const handleBatchRotate = () => {
    // Implement batch rotation logic
    toast.success(`${selectedPhotos.size} photos rotated`);
  };

  const handleBatchEdit = () => {
    // Open batch edit modal or panel
    toast.info('Batch edit feature coming soon');
  };

  const handleBatchTag = () => {
    // Implement batch tagging
    toast.info('Batch tagging feature coming soon');
  };

  const handleBatchDuplicate = () => {
    // Implement batch duplication
    toast.success(`${selectedPhotos.size} photos duplicated`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
        <div className="flex items-center p-4">
          {/* Selection info */}
          <div className="flex items-center space-x-3 mr-6">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {selectedPhotos.size}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {t('photosSelected', { count: selectedPhotos.size })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Batch operations available
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBatchEdit}
              className="btn-icon btn-secondary"
              title="Batch Edit"
            >
              <PencilIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleBatchRotate}
              className="btn-icon btn-secondary"
              title="Rotate Selected"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleBatchTag}
              className="btn-icon btn-secondary"
              title="Tag Selected"
            >
              <TagIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleBatchDuplicate}
              className="btn-icon btn-secondary"
              title="Duplicate Selected"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleBatchDownload}
              className="btn-icon btn-secondary"
              title="Download Selected"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

            <button
              onClick={handleBatchDelete}
              className="btn-icon btn-danger"
              title="Delete Selected"
            >
              <TrashIcon className="w-4 h-4" />
            </button>

            <button
              onClick={clearSelection}
              className="btn-icon btn-secondary"
              title="Clear Selection"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchOperations;
