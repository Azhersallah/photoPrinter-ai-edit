import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const EmptyState: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 md:p-8">
      <div className="text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('noPhotos')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          {t('selectPhotosPrompt')}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
