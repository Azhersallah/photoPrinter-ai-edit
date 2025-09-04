import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { usePhotos } from '../../context/PhotoContext';
import toast from 'react-hot-toast';

const PhotoUploader: React.FC = () => {
  const { t } = useLanguage();
  const { addPhotos } = usePhotos();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length !== acceptedFiles.length) {
        toast.error('Only image files are allowed');
      }
      
      if (imageFiles.length > 0) {
        await addPhotos(imageFiles);
        toast.success(`${imageFiles.length} ${imageFiles.length === 1 ? 'photo' : 'photos'} added`);
      }
    }
  }, [addPhotos]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true,
    noClick: false,
  });

  const dropzoneClassName = `
    relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
    ${isDragActive 
      ? isDragAccept 
        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
        : 'border-red-400 bg-red-50 dark:bg-red-900/20'
      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
    }
  `;

  return (
    <div {...getRootProps()} className={dropzoneClassName}>
      <input {...getInputProps()} />
      
      <div className="space-y-3">
        {isDragActive ? (
          <>
            <CloudArrowUpIcon className="w-8 h-8 text-primary-500 mx-auto" />
            <div>
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {isDragAccept ? t('dropPhotosHere') : 'Only image files allowed'}
              </p>
            </div>
          </>
        ) : (
          <>
            <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t('selectPhotos')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Click here or drag and drop images
              </p>
            </div>
          </>
        )}
      </div>

      {/* Visual feedback overlay */}
      {isDragActive && (
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-primary-400 bg-primary-500/10 animate-pulse" />
      )}
    </div>
  );
};

export default PhotoUploader;
