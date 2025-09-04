import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Photo, Annotation, EditorState, CropState, DragState, PageLayout, AppSettings } from '../types';

interface PhotoStore {
  // State
  photos: Photo[];
  selectedPhotos: Set<string>;
  pageLayouts: PageLayout[];
  editorState: EditorState;
  dragState: DragState;
  settings: AppSettings;
  
  // Photo actions
  addPhotos: (files: FileList | File[]) => Promise<void>;
  removePhoto: (photoId: string) => void;
  clearAllPhotos: () => void;
  updatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  reorderPhotos: (startIndex: number, endIndex: number) => void;
  sortPhotos: (type: 'name' | 'date' | 'size') => void;
  
  // Selection actions
  selectPhoto: (photoId: string) => void;
  deselectPhoto: (photoId: string) => void;
  selectAllPhotos: () => void;
  clearSelection: () => void;
  togglePhotoSelection: (photoId: string) => void;
  
  // Layout actions
  setPhotosPerPage: (layout: string) => void;
  createPageLayouts: () => void;
  updatePageLayout: (pageId: string, updates: Partial<PageLayout>) => void;
  insertPage: (position: 'start' | 'end' | number) => void;
  duplicatePage: (pageNumber: number) => void;
  clearPage: (pageNumber: number) => void;
  
  // Editor actions
  openEditor: (photo: Photo) => void;
  closeEditor: () => void;
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (annotationId: string) => void;
  setActiveAnnotation: (annotation: Annotation | undefined) => void;
  
  // Crop actions
  startCrop: (photo: Photo) => void;
  updateCropArea: (x: number, y: number, endX: number, endY: number) => void;
  applyCrop: () => Promise<void>;
  cancelCrop: () => void;
  
  // Drag actions
  startDrag: (photo: Photo) => void;
  updateDragOver: (index: number) => void;
  endDrag: () => void;
  
  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Project actions
  saveProject: () => string;
  loadProject: (projectData: string) => void;
  exportToPDF: () => Promise<void>;
}

const createInitialCropState = (): CropState => ({
  isActive: false,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
});

const createInitialEditorState = (): EditorState => ({
  isOpen: false,
  isDragging: false,
  isResizing: false,
  viewRotation: 0,
  cropState: createInitialCropState(),
});

const createInitialDragState = (): DragState => ({
  isDragging: false,
});

const createInitialSettings = (): AppSettings => ({
  photosPerPage: '4',
  currentLanguage: 'en',
  isDarkMode: false,
  pagesPerSection: 10,
  currentSection: 1,
  totalSections: 1,
  pageStartNumber: 1,
});

export const usePhotoStore = create<PhotoStore>()(
  persist(
    (set, get) => ({
      // Initial state
      photos: [],
      selectedPhotos: new Set(),
      pageLayouts: [],
      editorState: createInitialEditorState(),
      dragState: createInitialDragState(),
      settings: createInitialSettings(),

      // Photo actions
      addPhotos: async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const newPhotos: Photo[] = [];

        for (const file of fileArray) {
          if (file.type.startsWith('image/')) {
            const photo: Photo = {
              id: uuidv4(),
              src: URL.createObjectURL(file),
              file,
              originalWidth: 0,
              originalHeight: 0,
              annotations: [],
            };

            // Load image to get dimensions
            const img = new Image();
            img.onload = () => {
              photo.originalWidth = img.naturalWidth;
              photo.originalHeight = img.naturalHeight;
              set((state) => ({
                photos: state.photos.map((p) => 
                  p.id === photo.id ? { ...p, originalWidth: img.naturalWidth, originalHeight: img.naturalHeight } : p
                ),
              }));
            };
            img.src = photo.src;

            newPhotos.push(photo);
          }
        }

        set((state) => ({
          photos: [...state.photos, ...newPhotos],
        }));

        // Update page layouts
        get().createPageLayouts();
      },

      removePhoto: (photoId: string) => {
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== photoId),
          selectedPhotos: new Set([...state.selectedPhotos].filter(id => id !== photoId)),
        }));
        get().createPageLayouts();
      },

      clearAllPhotos: () => {
        const state = get();
        // Clean up object URLs
        state.photos.forEach((photo) => {
          URL.revokeObjectURL(photo.src);
        });
        
        set({
          photos: [],
          selectedPhotos: new Set(),
          pageLayouts: [],
          editorState: createInitialEditorState(),
        });
      },

      updatePhoto: (photoId: string, updates: Partial<Photo>) => {
        set((state) => ({
          photos: state.photos.map((p) => 
            p.id === photoId ? { ...p, ...updates } : p
          ),
        }));
      },

      reorderPhotos: (startIndex: number, endIndex: number) => {
        set((state) => {
          const newPhotos = [...state.photos];
          const [reorderedItem] = newPhotos.splice(startIndex, 1);
          newPhotos.splice(endIndex, 0, reorderedItem);
          return { photos: newPhotos };
        });
        get().createPageLayouts();
      },

      sortPhotos: (type: 'name' | 'date' | 'size') => {
        set((state) => {
          const sortedPhotos = [...state.photos].sort((a, b) => {
            switch (type) {
              case 'name':
                return a.file.name.localeCompare(b.file.name);
              case 'date':
                return a.file.lastModified - b.file.lastModified;
              case 'size':
                return a.file.size - b.file.size;
              default:
                return 0;
            }
          });
          return { photos: sortedPhotos };
        });
        get().createPageLayouts();
      },

      // Selection actions
      selectPhoto: (photoId: string) => {
        set((state) => ({
          selectedPhotos: new Set([...state.selectedPhotos, photoId]),
        }));
      },

      deselectPhoto: (photoId: string) => {
        set((state) => {
          const newSelection = new Set(state.selectedPhotos);
          newSelection.delete(photoId);
          return { selectedPhotos: newSelection };
        });
      },

      selectAllPhotos: () => {
        set((state) => ({
          selectedPhotos: new Set(state.photos.map((p) => p.id)),
        }));
      },

      clearSelection: () => {
        set({ selectedPhotos: new Set() });
      },

      togglePhotoSelection: (photoId: string) => {
        const state = get();
        if (state.selectedPhotos.has(photoId)) {
          state.deselectPhoto(photoId);
        } else {
          state.selectPhoto(photoId);
        }
      },

      // Layout actions
      setPhotosPerPage: (layout: string) => {
        set((state) => ({
          settings: { ...state.settings, photosPerPage: layout },
        }));
        get().createPageLayouts();
      },

      createPageLayouts: () => {
        const state = get();
        const { photos, settings } = state;
        const photosPerPage = parseInt(settings.photosPerPage) || 4;

        const layouts: PageLayout[] = [];
        let currentPage = 1;

        for (let i = 0; i < photos.length; i += photosPerPage) {
          const pagePhotos = photos.slice(i, i + photosPerPage);
          layouts.push({
            id: uuidv4(),
            pageNumber: currentPage,
            layout: settings.photosPerPage,
            photos: pagePhotos,
          });
          currentPage++;
        }

        // Ensure at least one empty A4 page exists so users can see and scroll pages
        if (layouts.length === 0) {
          layouts.push({
            id: uuidv4(),
            pageNumber: 1,
            layout: settings.photosPerPage,
            photos: [],
            title: '',
            texts: [],
          });
        }

        set({
          pageLayouts: layouts,
          settings: {
            ...state.settings,
            totalSections: Math.max(1, Math.ceil(layouts.length / settings.pagesPerSection)),
          },
        });
      },

      updatePageLayout: (pageId: string, updates: Partial<PageLayout>) => {
        set((state) => ({
          pageLayouts: state.pageLayouts.map((layout) =>
            layout.id === pageId ? { ...layout, ...updates } : layout
          ),
        }));
      },

      insertPage: (position: 'start' | 'end' | number) => {
        set((state) => {
          const newLayout: PageLayout = {
            id: uuidv4(),
            pageNumber: typeof position === 'number' ? position : 
                       position === 'start' ? 1 : state.pageLayouts.length + 1,
            layout: state.settings.photosPerPage,
            photos: [],
          };

          let newLayouts = [...state.pageLayouts];
          
          if (position === 'start') {
            newLayouts.unshift(newLayout);
            // Update page numbers
            newLayouts = newLayouts.map((layout, index) => ({
              ...layout,
              pageNumber: index + 1,
            }));
          } else if (position === 'end') {
            newLayouts.push(newLayout);
          } else if (typeof position === 'number') {
            newLayouts.splice(position - 1, 0, newLayout);
            // Update page numbers
            newLayouts = newLayouts.map((layout, index) => ({
              ...layout,
              pageNumber: index + 1,
            }));
          }

          return { pageLayouts: newLayouts };
        });
      },

      duplicatePage: (pageNumber: number) => {
        set((state) => {
          const pageIndex = pageNumber - 1;
          const originalPage = state.pageLayouts[pageIndex];
          
          if (!originalPage) return state;

          const duplicatedPage: PageLayout = {
            ...originalPage,
            id: uuidv4(),
            pageNumber: pageNumber + 1,
            photos: originalPage.photos.map(photo => ({
              ...photo,
              id: uuidv4(), // New ID for duplicated photos
            })),
          };

          const newLayouts = [...state.pageLayouts];
          newLayouts.splice(pageIndex + 1, 0, duplicatedPage);
          
          // Update page numbers
          const updatedLayouts = newLayouts.map((layout, index) => ({
            ...layout,
            pageNumber: index + 1,
          }));

          return { pageLayouts: updatedLayouts };
        });
      },

      clearPage: (pageNumber: number) => {
        set((state) => ({
          pageLayouts: state.pageLayouts.map((layout) =>
            layout.pageNumber === pageNumber
              ? { ...layout, photos: [], title: undefined, texts: undefined }
              : layout
          ),
        }));
      },

      // Editor actions
      openEditor: (photo: Photo, rotation: number = 0) => {
        set((state) => ({
          editorState: {
            ...state.editorState,
            isOpen: true,
            currentPhoto: photo,
            activeAnnotation: undefined,
            viewRotation: rotation,
          },
        }));
      },

      closeEditor: () => {
        set((state) => ({
          editorState: {
            ...createInitialEditorState(),
            isOpen: false,
          },
        }));
      },

      addAnnotation: (annotation: Omit<Annotation, 'id'>) => {
        const newAnnotation: Annotation = {
          ...annotation,
          id: uuidv4(),
        };

        set((state) => {
          if (!state.editorState.currentPhoto) return state;

          const updatedPhoto = {
            ...state.editorState.currentPhoto,
            annotations: [...(state.editorState.currentPhoto.annotations || []), newAnnotation],
          };

          return {
            photos: state.photos.map((p) => 
              p.id === updatedPhoto.id ? updatedPhoto : p
            ),
            editorState: {
              ...state.editorState,
              currentPhoto: updatedPhoto,
              activeAnnotation: newAnnotation,
            },
          };
        });
      },

      updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => {
        set((state) => {
          if (!state.editorState.currentPhoto) return state;

          const updatedAnnotations = state.editorState.currentPhoto.annotations?.map((ann) =>
            ann.id === annotationId ? { ...ann, ...updates } : ann
          ) || [];

          const updatedPhoto = {
            ...state.editorState.currentPhoto,
            annotations: updatedAnnotations,
          };

          return {
            photos: state.photos.map((p) => 
              p.id === updatedPhoto.id ? updatedPhoto : p
            ),
            editorState: {
              ...state.editorState,
              currentPhoto: updatedPhoto,
            },
          };
        });
      },

      removeAnnotation: (annotationId: string) => {
        set((state) => {
          if (!state.editorState.currentPhoto) return state;

          const updatedAnnotations = state.editorState.currentPhoto.annotations?.filter(
            (ann) => ann.id !== annotationId
          ) || [];

          const updatedPhoto = {
            ...state.editorState.currentPhoto,
            annotations: updatedAnnotations,
          };

          return {
            photos: state.photos.map((p) => 
              p.id === updatedPhoto.id ? updatedPhoto : p
            ),
            editorState: {
              ...state.editorState,
              currentPhoto: updatedPhoto,
              activeAnnotation: state.editorState.activeAnnotation?.id === annotationId 
                ? undefined 
                : state.editorState.activeAnnotation,
            },
          };
        });
      },

      setActiveAnnotation: (annotation: Annotation | undefined) => {
        set((state) => ({
          editorState: {
            ...state.editorState,
            activeAnnotation: annotation,
          },
        }));
      },

      // Crop actions
      startCrop: (photo: Photo) => {
        set((state) => ({
          editorState: {
            ...state.editorState,
            cropState: {
              ...createInitialCropState(),
              isActive: true,
              photo,
            },
          },
        }));
      },

      updateCropArea: (x: number, y: number, endX: number, endY: number) => {
        set((state) => ({
          editorState: {
            ...state.editorState,
            cropState: {
              ...state.editorState.cropState,
              startX: x,
              startY: y,
              endX,
              endY,
            },
          },
        }));
      },

      applyCrop: async () => {
        const state = get();
        const { cropState } = state.editorState;
        
        if (!cropState.photo || !cropState.isActive) return;

        // Implement cropping logic here
        // This would involve canvas manipulation to crop the image
        
        set((state) => ({
          editorState: {
            ...state.editorState,
            cropState: createInitialCropState(),
          },
        }));
      },

      cancelCrop: () => {
        set((state) => ({
          editorState: {
            ...state.editorState,
            cropState: createInitialCropState(),
          },
        }));
      },

      // Drag actions
      startDrag: (photo: Photo) => {
        set({
          dragState: {
            isDragging: true,
            draggedPhoto: photo,
          },
        });
      },

      updateDragOver: (index: number) => {
        set((state) => ({
          dragState: {
            ...state.dragState,
            dragOverIndex: index,
          },
        }));
      },

      endDrag: () => {
        set({
          dragState: createInitialDragState(),
        });
      },

      // Settings actions
      updateSettings: (updates: Partial<AppSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Project actions
      saveProject: () => {
        const state = get();
        const projectData = {
          version: '1.0.0',
          photos: state.photos,
          settings: state.settings,
          layouts: state.pageLayouts,
          metadata: {
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            name: 'Photo Printer Project',
          },
        };
        return JSON.stringify(projectData);
      },

      loadProject: (projectData: string) => {
        try {
          const data = JSON.parse(projectData);
          set({
            photos: data.photos || [],
            settings: { ...createInitialSettings(), ...data.settings },
            pageLayouts: data.layouts || [],
          });
        } catch (error) {
          console.error('Failed to load project:', error);
        }
      },

      exportToPDF: async () => {
        const state = get();
        if (state.pageLayouts.length === 0) {
          throw new Error('No pages to export');
        }

        const { exportToPDF } = await import('../utils/pdfExport');

        const filename = `photo-printer-export-${new Date().toISOString().split('T')[0]}.pdf`;

        await exportToPDF(
          state.pageLayouts,
          filename,
          {
            format: 'a4',
            orientation: 'portrait',
            quality: 0.9,
            scale: 2,
            margin: 10,
          }
        );
      },
    }),
    {
      name: 'photo-printer-store',
      partialize: (state) => ({
        settings: state.settings,
        photos: state.photos.map(photo => ({
          ...photo,
          src: '', // Don't persist blob URLs
        })),
      }),
    }
  )
);
