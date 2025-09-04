import { useEffect } from 'react';
import { usePhotos, usePhotoLayouts, usePhotoSelection } from '../context/PhotoContext';
import { useTheme } from '../context/ThemeContext';
import { useFindReplaceStore } from '../store/findReplaceStore';

export const useKeyboardEvents = () => {
  const { selectAllPhotos, clearSelection } = usePhotoSelection();
  const { selectedPhotos } = usePhotoSelection();
  const { photos, removePhoto } = usePhotos();
  const { setPhotosPerPage } = usePhotoLayouts();
  const { toggleTheme } = useTheme();
  const toggleFindReplace = useFindReplaceStore(state => state.togglePanel);

  useEffect(() => {
    const handleSelectAllPhotos = () => {
      if (selectedPhotos.size === photos.length) {
        clearSelection();
      } else {
        selectAllPhotos();
      }
    };

    const handleDeleteSelectedPhotos = () => {
      if (selectedPhotos.size > 0) {
        const confirmMessage = `Delete ${selectedPhotos.size} selected photo${selectedPhotos.size > 1 ? 's' : ''}?`;
        if (confirm(confirmMessage)) {
          selectedPhotos.forEach(photoId => {
            removePhoto(photoId);
          });
        }
      }
    };

    const handleToggleFindReplace = () => {
      toggleFindReplace();
    };

    const handleSetLayout = (event: CustomEvent) => {
      const layout = event.detail;
      setPhotosPerPage(layout);
    };

    const handleToggleTheme = () => {
      toggleTheme();
    };

    // Add event listeners
    window.addEventListener('selectAllPhotos', handleSelectAllPhotos);
    window.addEventListener('deleteSelectedPhotos', handleDeleteSelectedPhotos);
    window.addEventListener('toggleFindReplace', handleToggleFindReplace);
    window.addEventListener('setLayout', handleSetLayout as EventListener);
    window.addEventListener('toggleTheme', handleToggleTheme);

    return () => {
      // Remove event listeners
      window.removeEventListener('selectAllPhotos', handleSelectAllPhotos);
      window.removeEventListener('deleteSelectedPhotos', handleDeleteSelectedPhotos);
      window.removeEventListener('toggleFindReplace', handleToggleFindReplace);
      window.removeEventListener('setLayout', handleSetLayout as EventListener);
      window.removeEventListener('toggleTheme', handleToggleTheme);
    };
  }, [selectedPhotos, photos.length, selectAllPhotos, clearSelection, removePhoto, setPhotosPerPage, toggleTheme, toggleFindReplace]);
};
