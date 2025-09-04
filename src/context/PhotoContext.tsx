import React, { createContext, useContext, ReactNode } from 'react';
import { usePhotoStore } from '../store/photoStore';

// Re-export the store hook for convenience
export { usePhotoStore };

interface PhotoContextType {
  // The context can be extended with additional methods if needed
  // For now, we'll use the store directly through the hook
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

interface PhotoProviderProps {
  children: ReactNode;
}

export const PhotoProvider: React.FC<PhotoProviderProps> = ({ children }) => {
  const value: PhotoContextType = {
    // Context-specific methods can go here
  };

  return (
    <PhotoContext.Provider value={value}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = (): PhotoContextType => {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};

// Custom hooks for specific store slices
export const usePhotos = () => {
  return usePhotoStore((state) => ({
    photos: state.photos,
    selectedPhotos: state.selectedPhotos,
    addPhotos: state.addPhotos,
    removePhoto: state.removePhoto,
    clearAllPhotos: state.clearAllPhotos,
    updatePhoto: state.updatePhoto,
    reorderPhotos: state.reorderPhotos,
    sortPhotos: state.sortPhotos,
  }));
};

export const usePhotoSelection = () => {
  return usePhotoStore((state) => ({
    selectedPhotos: state.selectedPhotos,
    selectPhoto: state.selectPhoto,
    deselectPhoto: state.deselectPhoto,
    selectAllPhotos: state.selectAllPhotos,
    clearSelection: state.clearSelection,
    togglePhotoSelection: state.togglePhotoSelection,
  }));
};

export const usePhotoLayouts = () => {
  return usePhotoStore((state) => ({
    pageLayouts: state.pageLayouts,
    settings: state.settings,
    setPhotosPerPage: state.setPhotosPerPage,
    createPageLayouts: state.createPageLayouts,
    updatePageLayout: state.updatePageLayout,
    insertPage: state.insertPage,
    duplicatePage: state.duplicatePage,
    clearPage: state.clearPage,
  }));
};

export const usePhotoEditor = () => {
  return usePhotoStore((state) => ({
    editorState: state.editorState,
    openEditor: state.openEditor,
    closeEditor: state.closeEditor,
    addAnnotation: state.addAnnotation,
    updateAnnotation: state.updateAnnotation,
    removeAnnotation: state.removeAnnotation,
    setActiveAnnotation: state.setActiveAnnotation,
    startCrop: state.startCrop,
    updateCropArea: state.updateCropArea,
    applyCrop: state.applyCrop,
    cancelCrop: state.cancelCrop,
  }));
};

export const useAppSettings = () => {
  return usePhotoStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
  }));
};

export const useProjectActions = () => {
  return usePhotoStore((state) => ({
    saveProject: state.saveProject,
    loadProject: state.loadProject,
    exportToPDF: state.exportToPDF,
  }));
};
