import React from 'react';
import { 
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowsUpDownIcon,
  DocumentPlusIcon,
  DocumentDuplicateIcon,
  DocumentMinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { usePhotos, usePhotoLayouts, usePhotoSelection, useAppSettings } from '../../context/PhotoContext';
import PhotoUploader from './PhotoUploader';
import LayoutSelector from './LayoutSelector';
import GlobalTitleEditor from './GlobalTitleEditor';
import PageManagement from './PageManagement';
import toast from 'react-hot-toast';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { photos, sortPhotos, clearAllPhotos } = usePhotos();
  const { selectedPhotos, selectAllPhotos, clearSelection } = usePhotoSelection();
  const { settings } = useAppSettings();
  const [showPhotoBadges, setShowPhotoBadges] = React.useState(true);

  const handleSortPhotos = () => {
    sortPhotos('name');
    toast.success(t('sort') + ' ' + t('exportSuccess'));
  };

  const handleClearAll = () => {
    if (photos.length > 0) {
      if (window.confirm(t('clearAllConfirm'))) {
        clearAllPhotos();
        toast.success(t('clearAll') + ' ' + t('exportSuccess'));
      }
    }
  };

  const handleTogglePhotoBadges = () => {
    setShowPhotoBadges(!showPhotoBadges);
    // Add/remove CSS class to show/hide photo badges
    document.body.classList.toggle('hide-photo-badges', !showPhotoBadges);
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === photos.length) {
      clearSelection();
    } else {
      selectAllPhotos();
    }
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col no-print">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('actions')}
        </h2>
      </div>

      {/* Sidebar Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-6">
          
          {/* Photo Upload Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <PhotoIcon className="w-4 h-4 mr-2" />
              {t('selectPhotos')}
            </h3>
            <PhotoUploader />
          </div>

          {/* Photo Actions */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('actions')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleTogglePhotoBadges}
                  className="btn-secondary text-xs flex items-center justify-center space-x-1"
                  title={t('togglePhotoBadges')}
                >
                  {showPhotoBadges ? (
                    <EyeIcon className="w-4 h-4" />
                  ) : (
                    <EyeSlashIcon className="w-4 h-4" />
                  )}
                  <span>{t('numbers')}</span>
                </button>

                <button
                  onClick={handleSortPhotos}
                  className="btn-secondary text-xs flex items-center justify-center space-x-1"
                  title={t('sortPhotosName')}
                >
                  <ArrowsUpDownIcon className="w-4 h-4" />
                  <span>{t('sort')}</span>
                </button>

                <button
                  onClick={handleSelectAll}
                  className="btn-secondary text-xs flex items-center justify-center"
                >
                  {selectedPhotos.size === photos.length ? t('deselectAll') : t('selectAll')}
                </button>

                <button
                  onClick={handleClearAll}
                  className="btn-danger text-xs flex items-center justify-center space-x-1"
                >
                  <DocumentMinusIcon className="w-4 h-4" />
                  <span>{t('clearAll')}</span>
                </button>
              </div>

              {/* Photo Selection Info */}
              {selectedPhotos.size > 0 && (
                <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    {t('photosSelected', { count: selectedPhotos.size })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Global Title Editor */}
          <GlobalTitleEditor />

          {/* Layout Selector */}
          <LayoutSelector />

          {/* Page Management */}
          <PageManagement />

          {/* Stats */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Statistics
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Photos:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{photos.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Selected:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedPhotos.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Layout:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {settings.photosPerPage === '1' && '1×1'}
                    {settings.photosPerPage === '2' && '2×1'}
                    {settings.photosPerPage === '4' && '2×2'}
                    {settings.photosPerPage === '2text' && '2+Text'}
                    {settings.photosPerPage === '1text' && '1+Text'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
