import React from 'react';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { usePhotoLayouts } from '../../context/PhotoContext';

const LayoutSelector: React.FC = () => {
  const { t } = useLanguage();
  const { settings, setPhotosPerPage } = usePhotoLayouts();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhotosPerPage(e.target.value);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Squares2X2Icon className="w-4 h-4 mr-2" />
        {t('layout')}
      </h3>

      <select
        className="form-select text-sm"
        value={settings.photosPerPage}
        onChange={handleChange}
      >
        <option value="1">{t('onePhoto')} (1x1)</option>
        <option value="2">{t('twoPhotos')} (2x1)</option>
        <option value="4">{t('fourPhotos')} (2x2)</option>
        <option value="2text">{t('twoPhotosText')}</option>
        <option value="1text">{t('onePhotoText')}</option>
      </select>
    </div>
  );
};

export default LayoutSelector;
