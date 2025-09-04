import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  DocumentIcon, 
  ClockIcon,
  CpuChipIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { usePhotos, usePhotoLayouts, usePhotoSelection } from '../../context/PhotoContext';
import { useLanguage } from '../../context/LanguageContext';

const StatusBar: React.FC = () => {
  const { t } = useLanguage();
  const { photos } = usePhotos();
  const { selectedPhotos } = usePhotoSelection();
  const { pageLayouts } = usePhotoLayouts();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Monitor memory usage if available
  useEffect(() => {
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1024 / 1024));
        }
      };

      updateMemory();
      const timer = setInterval(updateMemory, 5000);
      
      return () => clearInterval(timer);
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleShowShortcuts = () => {
    const event = new CustomEvent('showKeyboardShortcuts');
    window.dispatchEvent(event);
  };

  const totalFileSize = photos.reduce((total, photo) => total + photo.file.size, 0);
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 no-print">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        {/* Left side - Photo and page info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <PhotoIcon className="w-4 h-4" />
            <span>
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              {selectedPhotos.size > 0 && (
                <span className="text-primary-600 dark:text-primary-400 ml-1">
                  ({selectedPhotos.size} selected)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <DocumentIcon className="w-4 h-4" />
            <span>
              {pageLayouts.length} {pageLayouts.length === 1 ? 'page' : 'pages'}
            </span>
          </div>

          {totalFileSize > 0 && (
            <div className="flex items-center space-x-2">
              <CpuChipIcon className="w-4 h-4" />
              <span>
                {formatFileSize(totalFileSize)}
              </span>
            </div>
          )}
        </div>

        {/* Center - Performance info */}
        <div className="flex items-center space-x-6">
          {memoryUsage !== null && (
            <div className="flex items-center space-x-2">
              <CpuChipIcon className="w-4 h-4" />
              <span>
                {memoryUsage} MB
              </span>
            </div>
          )}

          <button
            onClick={handleShowShortcuts}
            className="flex items-center space-x-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title="Show keyboard shortcuts"
          >
            <CommandLineIcon className="w-4 h-4" />
            <span>Shortcuts</span>
          </button>
        </div>

        {/* Right side - Time and app info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4" />
            <span>{formatTime(currentTime)}</span>
          </div>

          <div className="text-gray-500 dark:text-gray-500">
            Photo Printer Pro v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
