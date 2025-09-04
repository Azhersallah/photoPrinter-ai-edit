import React from 'react';
import { 
  ArrowUturnLeftIcon, 
  ArrowUturnRightIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';

const EditorToolbar: React.FC = () => {
  const { t } = useLanguage();

  const handleUndo = () => {
    // Implement undo functionality
    console.log('Undo');
  };

  const handleRedo = () => {
    // Implement redo functionality
    console.log('Redo');
  };

  const handleZoomIn = () => {
    // Implement zoom in functionality
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    // Implement zoom out functionality
    console.log('Zoom out');
  };

  const handleFitToWindow = () => {
    // Implement fit to window functionality
    console.log('Fit to window');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3">
      <div className="flex items-center justify-between">
        {/* Left side - History controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            className="btn-icon btn-secondary"
            title={t('undo')}
          >
            <ArrowUturnLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            className="btn-icon btn-secondary"
            title={t('redo')}
          >
            <ArrowUturnRightIcon className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
        </div>

        {/* Center - Tool info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Selection Tool</span>
          </div>
        </div>

        {/* Right side - View controls */}
        <div className="flex items-center space-x-2">
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          
          <button
            onClick={handleZoomOut}
            className="btn-icon btn-secondary"
            title={t('zoomOut')}
          >
            <MagnifyingGlassMinusIcon className="w-4 h-4" />
          </button>
          
          <div className="text-xs text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
            100%
          </div>
          
          <button
            onClick={handleZoomIn}
            className="btn-icon btn-secondary"
            title={t('zoomIn')}
          >
            <MagnifyingGlassPlusIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleFitToWindow}
            className="btn-icon btn-secondary"
            title={t('fitToWindow')}
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
