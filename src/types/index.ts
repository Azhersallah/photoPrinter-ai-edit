export interface Photo {
  id: string;
  src: string;
  file: File;
  originalWidth: number;
  originalHeight: number;
  displayWidth?: number;
  displayHeight?: number;
  annotations?: Annotation[];
  pageNumber?: number;
}

export interface Annotation {
  id: string;
  type: 'text' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  // Text-specific properties
  text?: string;
  size?: number;
  font?: string;
  // Shape-specific properties
  shape?: 'rectangle' | 'circle' | 'line' | 'arrow';
  widthValue?: number;
  fill?: string;
}

export interface LayoutOption {
  value: string;
  label: string;
  photosCount: number;
  textsCount: number;
  layout: 'grid' | 'mixed';
}

export interface PageLayout {
  id: string;
  pageNumber: number;
  layout: string;
  photos: Photo[];
  title?: string;
  texts?: string[];
}

export interface AppSettings {
  photosPerPage: string;
  currentLanguage: string;
  isDarkMode: boolean;
  pagesPerSection: number;
  currentSection: number;
  totalSections: number;
  pageStartNumber: number;
}

export interface FindReplaceState {
  isOpen: boolean;
  findText: string;
  replaceText: string;
  foundOccurrences: FoundOccurrence[];
  currentOccurrenceIndex: number;
}

export interface FoundOccurrence {
  element: HTMLElement;
  originalText: string;
  startIndex: number;
  endIndex: number;
  pageNumber?: number;
}

export interface CropState {
  isActive: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  photo?: Photo;
}

export interface EditorState {
  isOpen: boolean;
  currentPhoto?: Photo;
  activeAnnotation?: Annotation;
  isDragging: boolean;
  isResizing: boolean;
  viewRotation: number; // degrees 0,90,180,270
  cropState: CropState;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  [languageCode: string]: Translation;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Layout types
export type PhotoLayout = '1' | '2' | '4' | '2text' | '1text';

// Export format types
export type ExportFormat = 'pdf' | 'png' | 'jpg';

// Page operation types
export type PageOperation = 'insert-start' | 'insert-end' | 'insert-custom' | 'clear' | 'duplicate';

// Sort types
export type SortType = 'name' | 'date' | 'size' | 'custom';

// Print options
export interface PrintOptions {
  orientation: 'portrait' | 'landscape';
  paperSize: 'a4' | 'letter' | 'legal';
  margins: 'default' | 'none' | 'narrow' | 'wide';
  quality: 'draft' | 'normal' | 'high';
  colorMode: 'color' | 'grayscale';
}

// Project save/load types
export interface ProjectData {
  version: string;
  photos: Photo[];
  settings: AppSettings;
  layouts: PageLayout[];
  metadata: {
    createdAt: string;
    modifiedAt: string;
    name: string;
    description?: string;
  };
}

// Drag and drop types
export interface DragState {
  isDragging: boolean;
  draggedPhoto?: Photo;
  dragOverIndex?: number;
}

// Toast notification types
export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
