import { Translations, Language } from '../types';

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
  },
  {
    code: 'ku',
    name: 'Kurdish',
    nativeName: 'کوردی',
    direction: 'rtl',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
  },
];

export const translations: Translations = {
  en: {
    // Header
    appTitle: "Photo Printer",
    saveProject: "Save Project",
    loadProject: "Load Project",
    clearAll: "Clear All",
    exportPDF: "Export PDF",
    
    // Layout options
    layout: "Layout",
    onePhoto: "1 Photo (1x1)",
    twoPhotos: "2 Photos (2x1)", 
    fourPhotos: "4 Photos (2x2)",
    twoPhotosText: "2 Photos + 2 Texts",
    onePhotoText: "1 Photo + 1 Text",
    
    // Page Management
    pageManagement: "Page Management",
    insertStart: "Insert at Start",
    insertEnd: "Insert at End",
    insertCustom: "Insert Custom",
    clearPage: "Clear Page",
    duplicatePage: "Duplicate Page",
    
    // Controls
    globalTitle: "Global Title",
    actions: "Actions",
    selectPhotos: "Select Photos",
    numbers: "Show Numbers",
    print: "Print",
    sort: "Sort",
    
    // Empty state
    noPhotos: "No photos selected",
    selectPhotosPrompt: "Click 'Select Photos' to begin or drag and drop images here",
    
    // Drag and drop
    dropPhotosHere: "Drop your photos here",
    
    // Editor
    editPhoto: "Edit Photo",
    text: "Text",
    addText: "Add Text",
    textContent: "Text Content",
    textColor: "Text Color",
    fontSize: "Font Size",
    fontFamily: "Font Family",
    shapes: "Shapes",
    rectangle: "Rectangle",
    circle: "Circle",
    borderColor: "Border Color",
    borderWidth: "Border Width",
    fillColor: "Fill Color",
    transparentFill: "Transparent Fill",
    crop: "Crop",
    cropImage: "Crop Image",
    apply: "Apply",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    close: "Close",
    
    // Placeholders
    pageTitle: "Page Title",
    enterTitlePrompt: "Enter title for all pages",
    textAreaPlaceholder: "Write your text here...",
    enterYourTextHere: "Enter your text here",
    doubleClickToEdit: "Double click to edit",
    
    // Confirmations and alerts
    deleteConfirm: "Are you sure you want to delete this photo?",
    clearConfirm: "Are you sure you want to clear all photos?",
    deletePhotoConfirm: "Are you sure you want to delete photo number",
    deleteWithTextConfirm: "This action will delete both the photo and its associated text.",
    noPhotosExport: "No photos to export!",
    exporting: "Exporting...",
    cropSuccess: "Image cropped successfully!",
    noCropArea: "No area selected for cropping!",
    smallCropArea: "Selected area is too small!",
    confirm: "Confirm",
    ok: "OK", 
    invalidProjectFile: "Invalid project file.",
    failedToLoadProject: "Failed to load project file.",
    exportSuccess: "PDF exported successfully!",
    errorGeneratingPDF: "Error generating PDF. Please try again.",

    // Buttons and actions
    delete: "Delete",
    edit: "Edit",
    move: "Move",
    copy: "Copy",
    paste: "Paste",
    undo: "Undo",
    redo: "Redo",
    reset: "Reset",
    clear: "Clear",
    save: "Save",
    load: "Load",
    changePhoto: "Change Photo",
    set: "Set",
    
    // Font families
    notoNaskh: "Noto Naskh Arabic",
    calibri: "Calibri Regular", 
    uniQaidar: "UniQAIDAR 006",
    arial: "Arial",
    courierNew: "Courier New",
    georgia: "Georgia",
    
    // Tooltips
    togglePhotoBadges: "Toggle photo number badges",
    sortPhotosName: "Sort photos by name",
    insertPageStart: "Insert new page at start",
    insertPageEnd: "Insert new page at end", 
    insertPageCustom: "Insert new page at custom position",
    clearSpecificPage: "Clear specific page",
    duplicateSpecificPage: "Duplicate specific page",
    toggleTheme: "Toggle theme",
    rotateLeft: "Rotate Left",
    rotateRight: "Rotate Right",
    dragToReorder: "Drag to reorder", 
    deletePhoto: "Delete Photo",
    
    // Pagination
    previous: "Previous",
    next: "Next",
    pageOf: "Page {currentPage} of {totalPages}",
    pagesRangeOfTotal: "Pages {startPage}-{endPage} of {totalPages}",
    pagePerSection: "Pages Per Section",
    
    // Prompts
    promptPageNumberInsert: "Enter page number to insert new page (1, 2, 3, etc.):",
    invalidPageNumber: "Invalid page number",
    promptPageNumberClear: "Enter page number to clear (1, 2, 3, etc.):", 
    promptPageNumberDuplicate: "Enter page number to duplicate (1, 2, 3, etc.):", 
    promptCustomStartPageNumber: "Enter starting page number:", 
    clearAllConfirm: "Are you sure to clear all photos?", 

    // Find and Replace
    findReplace: "Find and Replace",
    find: "Find",
    replaceWith: "Replace With",
    findNext: "Find Next",
    replace: "Replace",
    replaceAll: "Replace All",
    noMatchesFound: "No matches found.",
    matchesFound: "{current} of {total} matches found.",
    replacedCount: "{count} replacements made.",
    enterTextToFind: "Enter text to find",
    enterReplacementText: "Enter replacement text (optional)",

    // New features
    photosSelected: "{count} photos selected",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    deleteSelected: "Delete Selected",
    batchEdit: "Batch Edit",
    exportSelected: "Export Selected",
    photoDetails: "Photo Details",
    fileSize: "File Size",
    dimensions: "Dimensions",
    fileType: "File Type",
    lastModified: "Last Modified",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    fitToWindow: "Fit to Window",
    actualSize: "Actual Size",
    fullscreen: "Fullscreen",
    grid: "Grid View",
    list: "List View",
    thumbnails: "Thumbnails",
  },
  
  ku: {
    // Header - سەرپەڕە
    appTitle: "چاپکەری وێنە",
    saveProject: "پاشەکەوتکردنی پرۆژە",
    loadProject: "هێنانەوەی پرۆژەی پاشەکەوتکراو",
    clearAll: "سڕینەوەی هەموو لاپەرەكان",
    exportPDF: "گۆڕین بۆ پی دی ئێف",
    
    // Layout options - هەڵبژاردەی نیشاندان
    layout: "شێوازی نیشاندان",
    onePhoto: "١ وێنە (١×١)",
    twoPhotos: "٢ وێنە (٢×١)",
    fourPhotos: "٤ وێنە (٢×٢)",
    twoPhotosText: "٢ وێنە + ٢ نووسین",
    onePhotoText: "١ وێنە + ١ نووسین",
    
    // Page Management - بەڕێوەبردنی پەڕە
    pageManagement: "بەڕێوەبردنی پەڕە",
    insertStart: "زیادکردنی پەڕە لە سەرەتا",
    insertEnd: "زیادکردنی پەڕە لە کۆتای",
    insertCustom: "زیادکردنی پەڕە لە شوێنێکی دیاریکراو",
    clearPage: "پاککردنەوەی پەڕەیەکی دیاریکراو",
    duplicatePage: "کۆپیکردنی پەڕەیەکی دیاریکراو",
    
    // Controls - کۆنترۆڵەکان
    globalTitle: "ناونیشانی گشتی ",
    actions: "کردارەکان",
    selectPhotos: "هەڵبژاردنی وێنە",
    numbers: "ژمارەکان",
    print: "چاپکردن",
    sort: "ڕیزکردن",
    
    // Empty state - حاڵەتی بەتاڵ
    noPhotos: "هیچ وێنەیەک نییە",
    selectPhotosPrompt: "کرتە لەسەر 'هەڵبژاردنی وێنە' بکە یان وێنەکان بکێشە و بیخەرە ئێرە",
    
    // Drag and drop - کێشان و خستن
    dropPhotosHere: "وێنەکانت لێرە دابنێ",
    
    // Editor - دەستکاریکەر
    editPhoto: "دەستکاریکردنی وێنە",
    text: "نووسین",
    addText: "زیادکردنی نووسین",
    textContent: "ناوەڕۆکی نووسین",
    textColor: "ڕەنگی نووسین",
    fontSize: "قەبارەی نووسین",
    fontFamily: "جۆری فۆنت",
    shapes: "شێوەکان",
    rectangle: "چوارگۆشە",
    circle: "بازنە",
    borderColor: "ڕەنگی چوارچێوە",
    borderWidth: "ئەستووری چوارچێوە",
    fillColor: "ڕەنگی ناوەوە",
    transparentFill: "ڕەنگی شەفاف",
    crop: "بڕین",
    cropImage: "بڕینی وێنە",
    apply: "جێبەجێکردن",
    cancel: "پاشگەزبوونەوە",
    saveChanges: "پاشەکەوتکردنی گۆڕانکارییەکان",
    close: "داخستن",
    
    // Additional Kurdish translations...
    photosSelected: "{count} وێنە هەڵبژێردراو",
    selectAll: "هەڵبژاردنی هەموو",
    deselectAll: "لابردنی هەڵبژاردن",
    deleteSelected: "سڕینەوەی هەڵبژێردراوەکان",
    batchEdit: "دەستکاریکردنی کۆمەڵگەیی",
    exportSelected: "هەناردەکردنی هەڵبژێردراوەکان",
  },
  
  ar: {
    // Header - الرأس
    appTitle: "طابعة الصور",
    saveProject: "حفظ المشروع",
    loadProject: "تحميل المشروع",
    clearAll: "مسح الكل",
    exportPDF: "تصدير PDF",
    
    // Layout options - خيارات التخطيط
    layout: "التخطيط",
    onePhoto: "صورة واحدة (١×١)",
    twoPhotos: "صورتان (٢×١)",
    fourPhotos: "أربع صور (٢×٢)",
    twoPhotosText: "صورتان + نصان",
    onePhotoText: "صورة واحدة + نص واحد",
    
    // Page Management - إدارة الصفحات
    pageManagement: "إدارة الصفحات",
    insertStart: "إدراج في البداية",
    insertEnd: "إدراج في النهاية",
    insertCustom: "إدراج مخصص",
    clearPage: "مسح الصفحة",
    duplicatePage: "تكرار الصفحة",
    
    // Controls - عناصر التحكم
    globalTitle: "العنوان العام",
    actions: "الإجراءات",
    selectPhotos: "اختيار الصور",
    numbers: "إظهار الأرقام",
    print: "طباعة",
    sort: "ترتيب",
    
    // Additional Arabic translations...
    photosSelected: "{count} صور محددة",
    selectAll: "تحديد الكل",
    deselectAll: "إلغاء التحديد",
    deleteSelected: "حذف المحدد",
    batchEdit: "تحرير متعدد",
    exportSelected: "تصدير المحدد",
  },
};

export const getTranslation = (key: string, language: string = 'en', params: Record<string, string | number> = {}): string => {
  const translation = translations[language]?.[key] || translations['en']?.[key] || key;
  
  // Replace parameters in the translation
  return Object.entries(params).reduce((str, [param, value]) => {
    return str.replace(new RegExp(`{${param}}`, 'g'), String(value));
  }, translation);
};

export const getCurrentLanguage = (): Language => {
  const savedLanguage = localStorage.getItem('language') || 'en';
  return languages.find(lang => lang.code === savedLanguage) || languages[0];
};

export const setLanguage = (languageCode: string): void => {
  localStorage.setItem('language', languageCode);
  const language = languages.find(lang => lang.code === languageCode);
  if (language) {
    // Keep direction unchanged; only set language attribute
    document.documentElement.lang = language.code;
  }
};
