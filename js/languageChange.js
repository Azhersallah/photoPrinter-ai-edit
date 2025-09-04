const translations = {
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
        insertStart: "Start",
        insertEnd: "End",
        insertCustom: "Custom",
        clearPage: "Clear Page",
        duplicatePage: "Duplicate",
        
        // Controls
        globalTitle: "Global Title",
        actions: "Actions",
        selectPhotos: "Select Photos",
        numbers: "Numbers",
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
        exportSuccess: "PDF exported successfully!", // New translation
        errorGeneratingPDF: "Error generating PDF. Please try again.", // New translation

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
        pagesRangeOfTotal: "Pages {startPage}{endPage} of {totalPages}",
        pagePerSection: "Page Per Section",
        
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
        
        // Placeholders - جێگرەوەکان
        pageTitle: "ناونیشانی پەڕە",
        enterTitlePrompt: "ناونیشان بۆ هەموو پەڕەکان بنووسە",
        textAreaPlaceholder: "نووسینەکەت لێرە بنووسە...",
        enterYourTextHere: "نووسینەکەت لێرە بنووسە",
        doubleClickToEdit: "بۆ دەستکاری کردن دووجار کرتە بکە",
        
        // Confirmations and alerts - پشتڕاستکردنەوە و ئاگادارکردنەوەکان
        deleteConfirm: "دڵنیایت لە سڕینەوەی ئەم وێنەیە؟",
        clearConfirm: "دڵنیایت لە سڕینەوەی هەموو وێنەکان؟",
        deletePhotoConfirm: "دڵنیایت لە سڕینەوەی وێنەی ژمارە",
        deleteWithTextConfirm: "ئەم کارە وێنەکە و نووسینەکەی پێکەوە دەسڕێتەوە.",
        noPhotosExport: "هیچ وێنەیەک نییە!",
        exporting: "گۆڕین بۆ PDF...",
        cropSuccess: "وێنەکە بە سەرکەوتوویی بڕدرا!",
        noCropArea: "هیچ ناوچەیەک بۆ بڕین هەڵنەبژێردراوە!",
        smallCropArea: "ناوچەی هەڵبژێردراو زۆر بچووکە!",
        confirm: "پشتڕاستکردنەوە",
        ok: "باشە",
        invalidProjectFile: "فایلی پرۆژەکە نادروستە.",
        failedToLoadProject: "سەرکەوتوو نەبوو لە بارکردنی فایلی پرۆژە.",
        exportSuccess: "پی دی ئێف بە سەرکەوتوویی هەناردە کرا!", // New translation
        errorGeneratingPDF: "هەڵەیەک لە هەناردەکردنی پی دی ئێفدا ڕوویدا. تکایە دووبارە هەوڵبدەوە.", // New translation
        
        // Buttons and actions - دوگمە و کردارەکان
        delete: "سڕینەوە",
        edit: "دەستکاریکردن",
        move: "گوازینەوە",
        copy: "کۆپیکردن",
        paste: "لکاندن",
        undo: "گەڕاندنەوە",
        redo: "دووبارەکردنەوە",
        reset: "ڕێکخستنەوە",
        clear: "پاککردنەوە",
        save: "پاشەکەوتکردن",
        load: "بارکردن",
        changePhoto: "گۆڕانی وێنە",
        set: "دانان",
        
        // Font families - جۆرەکانی فۆنت
        notoNaskh: "نۆتۆ نەسخی عەرەبی",
        calibri: "کالیبری ئاسایی",
        uniQaidar: "یونی قایدار ٠٠٦",
        arial: "ئاریاڵ",
        courierNew: "کۆریەر نوێ",
        georgia: "جۆرجیا",
        
        // Tooltips - ئامرازی یارمەتی
        togglePhotoBadges: "گۆڕینی ژمارەی وێنەکان",
        sortPhotosName: "ڕیزکردنی وێنەکان بەپێی ناو",
        insertPageStart: "زیادکردنی پەڕەی نوێ لە سەرەتا",
        insertPageEnd: "زیادکردنی پەڕەی نوێ لە کۆتایی",
        insertPageCustom: "زیادکردنی پەڕەی نوێ لە شوێنی دیاریکراو",
        clearSpecificPage: "پاککردنەوەی پەڕەی تایبەت",
        duplicateSpecificPage: "کۆپیکردنی پەڕەی تایبەت",
        toggleTheme: "گۆڕینی ڕووکار",
        rotateLeft: "سوڕاندنەوە بۆ چەپ",
        rotateRight: "سوڕاندنەوە بۆ ڕاست",
        dragToReorder: "کێشان بۆ ڕیزکردنەوە", 
        deletePhoto: "سڕینەوەی وێنە", 
        
        // Pagination
        previous: "پێشوو",
        next: "دواتر",
        pageOf: "پەڕە {currentPage} لە {totalPages}",
        pagesRangeOfTotal: "پەڕەکانی {startPage}{endPage} لە {totalPages}", 
        pagePerSection: "لاپەڕە بۆ هەر بەشێک",

        // Prompts
        promptPageNumberInsert: "ژمارەی ئەو پەڕەیە بنووسە کە دەتەوێت پەڕەی نوێ تێی زیاد بکەیت (1, 2, 3, هتد)",
        invalidPageNumber: "ژمارەی پەڕە نادروستە",
        promptPageNumberClear: "ژمارەی ئەو پەڕەیە بنووسە کە دەتەوێت بیسرێتەوە (1, 2, 3, هتد)",  
        promptPageNumberDuplicate: "ژمارەی ئەو پەڕەیە بنووسە کە دەتەوێت کۆپی بکەیت (1, 2, 3, هتد)",  
        promptCustomStartPageNumber: "ژمارەی دەستپێکی پەڕە بنووسە",  
        clearAllConfirm: "ئایە دەتەوێت هەموو لاپەڕەکان بسڕیتەوە؟",

        // Find and Replace
        findReplace: "دۆزینەوە و گۆڕین",
        find: "دۆزینەوە",
        replaceWith: "گۆڕین بە",
        findNext: "دۆزینەوەی دواتر",
        replace: "گۆڕین",
        replaceAll: "گۆڕینی هەموو",
        noMatchesFound: "هیچ ئەنجامێک نەدۆزرایەوە.",
        matchesFound: "{current} لە {total} ئەنجام دۆزرایەوە.",
        replacedCount: "{count} گۆڕانکاری ئەنجامدرا.",
        enterTextToFind: "نووسینێک بنووسە بۆ دۆزینەوە",
        enterReplacementText: "نووسینی جێگرەوە بنووسە (هەڵبژاردەییە)",
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
        insertStart: "البداية",
        insertEnd: "النهاية",
        insertCustom: "مخصص",
        clearPage: "مسح الصفحة",
        duplicatePage: "نسخ",
        
        // Controls - عناصر التحكم
        globalTitle: "العنوان العام",
        actions: "الإجراءات",
        selectPhotos: "اختيار الصور",
        numbers: "الأرقام",
        print: "طباعة",
        sort: "ترتيب",
        
        // Empty state - الحالة الفارغة
        noPhotos: "لا توجد صور محددة",
        selectPhotosPrompt: "انقر فوق 'اختيار الصور' للبدء أو اسحب الصور وأسقطها هنا",
        
        // Drag and drop - السحب والإفلات
        dropPhotosHere: "أسقط صورك هنا",
        
        // Editor - المحرر
        editPhoto: "تعديل الصورة",
        text: "النص",
        addText: "إضافة نص",
        textContent: "محتوى النص",
        textColor: "لون النص",
        fontSize: "حجم الخط",
        fontFamily: "نوع الخط",
        shapes: "الأشكال",
        rectangle: "مستطيل",
        circle: "دائرة",
        borderColor: "لون الحدود",
        borderWidth: "عرض الحدود",
        fillColor: "لون التعبئة",
        transparentFill: "تعبئة شفافة",
        crop: "قص",
        cropImage: "قص الصورة",
        apply: "تطبيق",
        cancel: "إلغاء",
        saveChanges: "حفظ التغييرات",
        close: "إغلاق",
        
        // Placeholders - النصوص التوضيحية
        pageTitle: "عنوان الصفحة",
        enterTitlePrompt: "أدخل عنوان لجميع الصفحات",
        textAreaPlaceholder: "اكتب النص الخاص بك هنا...",
        enterYourTextHere: "أدخل النص الخاص بك هنا",
        doubleClickToEdit: "انقر نقرًا مزدوجًا للتعديل",
        
        // Confirmations and alerts - التأكيدات والتنبيهات
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه الصورة؟",
        clearConfirm: "هل أنت متأكد أنك تريد مسح جميع الصور؟",
        deletePhotoConfirm: "هل أنت متأكد من حذف الصورة رقم",
        deleteWithTextConfirm: "سيؤدي هذا الإجراء إلى حذف الصورة والنص المرتبط بها معًا.",
        noPhotosExport: "لا توجد صور للتصدير!",
        exporting: "جاري التصدير...",
        cropSuccess: "تم قص الصورة بنجاح!",
        noCropArea: "لم يتم تحديد منطقة للقص!",
        smallCropArea: "المنطقة المحددة صغيرة جدًا!",
        confirm: "تأكيد",
        ok: "موافق",
        invalidProjectFile: "ملف المشروع غير صالح.",
        failedToLoadProject: "فشل تحميل ملف المشروع.",
        exportSuccess: "تم تصدير PDF بنجاح!", // New translation
        errorGeneratingPDF: "حدث خطأ أثناء تصدير PDF. الرجاء المحاولة مرة أخرى.", // New translation
        
        // Buttons and actions - الأزرار والإجراءات
        delete: "حذف",
        edit: "تعديل",
        move: "نقل",
        copy: "نسخ",
        paste: "لصق",
        undo: "تراجع",
        redo: "إعادة",
        reset: "إعادة تعيين",
        clear: "مسح",
        save: "حفظ",
        load: "تحميل",
        changePhoto: "تغيير الصورة",
        set: "تعيين",
        
        // Font families - أنواع الخطوط
        notoNaskh: "نوتو نسخ عربي",
        calibri: "كاليبري عادي",
        uniQaidar: "يوني قيدار ٠٠٦",
        arial: "أريال",
        courierNew: "كوريير نيو",
        georgia: "جورجيا",
        
        // Tooltips - تلميحات الأدوات
        togglePhotoBadges: "تبديل شارات أرقام الصور",
        sortPhotosName: "ترتيب الصور حسب الاسم",
        insertPageStart: "إدراج صفحة جديدة في البداية",
        insertPageEnd: "إدراج صفحة جديدة في النهاية",
        insertPageCustom: "إدراج صفحة جديدة في موضع مخصص",
        clearSpecificPage: "مسح صفحة محددة",
        duplicateSpecificPage: "نسخ صفحة محددة",
        toggleTheme: "تبديل المظهر",
        rotateLeft: "تدوير لليسار",
        rotateRight: "تدوير لليمين",
        dragToReorder: "سحب لإعادة الترتيب",
        deletePhoto: "حذف الصورة",
        
        // Pagination
        previous: "السابق",
        next: "التالي",
        pageOf: "صفحة {currentPage} من {totalPages}",
        pagesRangeOfTotal: "الصفحات {startPage}{endPage} من {totalPages}",
        pagePerSection: "صفحة لكل قسم",
        
        // Prompts
        promptPageNumberInsert: "أدخل رقم الصفحة لإدراج صفحة جديدة (1, 2, 3, إلخ):",
        invalidPageNumber: "رقم الصفحة غير صالح",
        promptPageNumberClear: "أدخل رقم الصفحة للمسح (1, 2, 3, إلخ):",  
        promptPageNumberDuplicate: "أدخل رقم الصفحة لنسخها (1, 2, 3, إلخ):",  
        promptCustomStartPageNumber: "أدخل رقم الصفحة البادئة:",  
        clearAllConfirm: "هل تريد حذف جميع الصفحات؟",

        // Find and Replace
        findReplace: "بحث واستبدال",
        find: "بحث",
        replaceWith: "استبدال بـ",
        findNext: "بحث التالي",
        replace: "استبدال",
        replaceAll: "استبدال الكل",
        noMatchesFound: "لا توجد تطابقات.",
        matchesFound: "{current} من {total} تطابقات تم العثور عليها.",
        replacedCount: "{count} استبدالات تمت.",
        enterTextToFind: "أدخل النص للبحث عنه",
        enterReplacementText: "أدخل نص الاستبدال (اختياري)",
    }
};

// Global variable to store current language for use in other modules
let currentLanguage = 'en';

// Get translation function
function getTranslation(key, lang = currentLanguage) {
    const trans = translations[lang] || translations.en;
    return trans[key] || translations.en[key] || key;
}

// Complete language update function
function updateLanguage(lang) {
    currentLanguage = lang;
    const trans = translations[lang] || translations.en;
    
    // Update page title
    document.title = trans.appTitle;

    // Update header elements
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.innerHTML = `<i class="fas fa-print"></i> ${trans.appTitle}`;
    
    // Update control labels
    const actionsLabel = document.getElementById('actionsLabel');
    if(actionsLabel) actionsLabel.innerHTML = `<i class="fas fa-cog"></i> ${trans.actions}`;

    const layoutLabel = document.querySelector('label[for="photosPerPage"]');
    if (layoutLabel) layoutLabel.innerHTML = `<i class="fas fa-th"></i> ${trans.layout}`;
    
    const globalTitleLabel = document.querySelector('label[for="globalTitle"]');
    if (globalTitleLabel) globalTitleLabel.innerHTML = `<i class="fas fa-heading"></i> ${trans.globalTitle}`;
    
    // Update layout options
    const photosPerPageSelect = document.getElementById('photosPerPage');
    if (photosPerPageSelect) {
        const options = photosPerPageSelect.querySelectorAll('option');
        if (options[0]) options[0].textContent = trans.onePhoto;
        if (options[1]) options[1].textContent = trans.twoPhotos;
        if (options[2]) options[2].textContent = trans.fourPhotos;
        if (options[3]) options[3].textContent = trans.twoPhotosText;
        if (options[4]) options[4].textContent = trans.onePhotoText;
    }
    
    // Update page management
    const pageManagementTitle = document.querySelector('.page-management-title');
    if (pageManagementTitle) pageManagementTitle.innerHTML = `<i class="fas fa-file-alt"></i> ${trans.pageManagement}`;
       
    
    // Update empty state
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        const h2 = emptyState.querySelector('h2');
        const p = emptyState.querySelector('p');
        if (h2) h2.textContent = trans.noPhotos;
        if (p) p.textContent = trans.selectPhotosPrompt;
    }
    
    // Update drag overlay
    const dragOverlay = document.getElementById('dragOverlay');
    if (dragOverlay) {
        const dragMessage = dragOverlay.querySelector('.drag-message p');
        if (dragMessage) dragMessage.textContent = trans.dropPhotosHere;
    }
    
    // Update editor elements
    const editorOverlay = document.getElementById('editorOverlay');
    if (editorOverlay) {
        const editorTitle = editorOverlay.querySelector('.editor-header h3');
        if (editorTitle) editorTitle.innerHTML = `<i class="fas fa-edit"></i> ${trans.editPhoto}`;
        
        // Update tool groups
        const toolGroups = editorOverlay.querySelectorAll('.tool-group h3');
        if (toolGroups[0]) toolGroups[0].innerHTML = `<i class="fas fa-font"></i> ${trans.text}`;
        if (toolGroups[1]) toolGroups[1].innerHTML = `<i class="fas fa-shapes"></i> ${trans.shapes}`;
        if (toolGroups[2]) toolGroups[2].innerHTML = `<i class="fas fa-crop"></i> ${trans.crop}`;
        
        const elementsToTranslate = [
            // Header buttons
            { id: 'saveProjectBtn', tooltipKey: 'saveProject' },
            { id: 'loadProjectBtn', tooltipKey: 'loadProject' },
            { id: 'clearAllBtn', tooltipKey: 'clearAll' },
            { id: 'pdfExportBtn', tooltipKey: 'exportPDF' },
            { id: 'themeToggle', tooltipKey: 'toggleTheme' },
            { id: 'findReplaceBtn', tooltipKey: 'findReplace' }, // New button

            // Actions control group buttons
            { id: 'selectPhotosBtn', tooltipKey: 'selectPhotos' },
            { id: 'togglePhotoBadges', tooltipKey: 'togglePhotoBadges' },
            { id: 'printBtn', tooltipKey: 'print' },
            { id: 'sortPhotosBtn', tooltipKey: 'sortPhotosName' },
            { id: 'customStartPageNumberBtn', tooltipKey: 'promptCustomStartPageNumber' },

            // Global Title control group buttons
            { id: 'applyGlobalTitle', tooltipKey: 'apply' },
            { id: 'clearGlobalTitle', tooltipKey: 'clear' },

            // Page Management buttons
            { id: 'insertPageStartBtn', tooltipKey: 'insertPageStart' },
            { id: 'insertPageEndBtn', tooltipKey: 'insertPageEnd' },
            { id: 'insertPageCustomBtn', tooltipKey: 'insertPageCustom' },
            { id: 'clearPageBtn', tooltipKey: 'clearSpecificPage' },
            { id: 'duplicatePageBtn', tooltipKey: 'duplicateSpecificPage' },

            // Page Navigation buttons
            { id: 'prevPageBtn', tooltipKey: 'previous' },
            { id: 'nextPageBtn', tooltipKey: 'next' },
            
            // Editor buttons
            { id: 'closeEditorBtn', tooltipKey: 'close' },
            { id: 'addTextBtn', textKey: 'addText', tooltipKey: 'addText' },
            { id: 'addRectangleBtn', textKey: 'rectangle', tooltipKey: 'rectangle' },
            { id: 'addCircleBtn', textKey: 'circle', tooltipKey: 'circle' },
            { id: 'cropBtn', textKey: 'cropImage', tooltipKey: 'cropImage' },
            { id: 'applyCropBtn', textKey: 'apply', tooltipKey: 'apply' },
            { id: 'cancelCropBtn', textKey: 'cancel', tooltipKey: 'cancel' },
            { id: 'cancelEditBtn', textKey: 'cancel', tooltipKey: 'cancel' },
            { id: 'saveEditBtn', textKey: 'saveChanges', tooltipKey: 'saveChanges' },
            { id: 'setPagesPerSectionBtn', textKey: 'set' },

            // Find and Replace buttons/labels
            { id: 'closeFindReplaceBtn', tooltipKey: 'close' },
            { id: 'findReplaceTitle', textKey: 'findReplace' },
            { id: 'findLabel', textKey: 'find' },
            { id: 'replaceWithLabel', textKey: 'replaceWith' },
            { id: 'findNextBtnText', textKey: 'findNext' },
            { id: 'replaceBtnText', textKey: 'replace' },
            { id: 'replaceAllBtnText', textKey: 'replaceAll' },
        ];

        elementsToTranslate.forEach(({ id, textKey, tooltipKey }) => {
            const element = document.getElementById(id);
            if (element) {
                // Update text content if textKey is provided
                if (textKey) {
                    const iconElement = element.querySelector('i');
                    if (iconElement && !element.hasAttribute('data-icon-only')) {
                        // Preserve icon if it exists and not icon-only
                        element.innerHTML = `${iconElement.outerHTML} ${trans[textKey]}`;
                    } else {
                        element.textContent = trans[textKey];
                    }
                }
                // Update the title attribute for tooltips if tooltipKey is provided
                if (tooltipKey) {
                    element.setAttribute('title', trans[tooltipKey]);
                }
            }
        });

        // Update font options in editor
        const textFontSelect = document.getElementById('textFont');
        if (textFontSelect) {
            const fontOptions = textFontSelect.querySelectorAll('option');
            if (fontOptions[0]) fontOptions[0].textContent = trans.notoNaskh;
            if (fontOptions[1]) fontOptions[1].textContent = trans.calibri;
            if (fontOptions[2]) fontOptions[2].textContent = trans.uniQaidar;
            if (fontOptions[3]) fontOptions[3].textContent = trans.arial;
            if (fontOptions[4]) fontOptions[4].textContent = trans.courierNew;
            if (fontOptions[5]) fontOptions[5].textContent = trans.georgia;
        }
        
        // Update control labels in editor (FIXED LOGIC)
        const editorTools = editorOverlay.querySelector('.editor-tools');
        if (editorTools) {
            const controlLabels = editorTools.querySelectorAll('.control-label');
            const labelKeys = [
                'textContent', 'textColor', 'fontSize', 'fontFamily',
                'borderColor', 'borderWidth', 'fillColor'
            ];
            let keyIndex = 0;
            controlLabels.forEach(label => {
                // Ensure we are not targeting a label for a checkbox that is handled separately
                if (!label.htmlFor || label.htmlFor !== 'transparentFill') {
                    if (keyIndex < labelKeys.length) {
                        const key = labelKeys[keyIndex];
                        if (trans[key]) {
                            label.textContent = trans[key];
                            keyIndex++;
                        }
                    }
                }
            });
        }
        
        const transparentFillLabel = editorOverlay.querySelector('label[for="transparentFill"]');
        if (transparentFillLabel) transparentFillLabel.textContent = trans.transparentFill;
    }
    
    // Update placeholders
    const globalTitleInput = document.getElementById('globalTitle');
    if (globalTitleInput) globalTitleInput.placeholder = trans.enterTitlePrompt;
    
    const titleInputs = document.querySelectorAll('.page-title-input');
    titleInputs.forEach(input => input.placeholder = trans.pageTitle);
    
    const layoutTextAreas = document.querySelectorAll('.layout-text-area');
    layoutTextAreas.forEach(textarea => textarea.placeholder = trans.textAreaPlaceholder);

    // Update Find/Replace placeholders
    const findInput = document.getElementById('findInput');
    if (findInput) findInput.placeholder = trans.enterTextToFind;
    const replaceInput = document.getElementById('replaceInput');
    if (replaceInput) replaceInput.placeholder = trans.enterReplacementText;
    
    // Update Page Per Section title
    const pageSectionSettingsTitle = document.querySelector('.page-section-settings .control-label');
    if (pageSectionSettingsTitle) {
        pageSectionSettingsTitle.innerHTML = `<i class="fas fa-layer-group"></i> ${trans.pagePerSection}`;
    }

    // Update loading text
    const loadingTextElement = document.getElementById('loadingText');
    if (loadingTextElement) {
        loadingTextElement.textContent = trans.exporting;
    }

    // Save language preference
    localStorage.setItem('languagePreference', lang);
    
    updateDynamicContent(trans);
}

function updateDynamicContent(trans) {
    const toolBtns = document.querySelectorAll('.photo-tools .tool-btn');
    toolBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            if (icon.classList.contains('fa-edit')) btn.title = trans.editPhoto;
            else if (icon.classList.contains('fa-images')) btn.title = trans.changePhoto;
            else if (icon.classList.contains('fa-undo')) btn.title = trans.rotateLeft;
            else if (icon.classList.contains('fa-redo')) btn.title = trans.rotateRight;
            else if (icon.classList.contains('fa-trash')) btn.title = trans.deletePhoto;
        }
    });

    const dragHandles = document.querySelectorAll('.drag-handle');
    dragHandles.forEach(handle => handle.title = trans.dragToReorder);

    if (window.photoEditor) window.photoEditor.updatePageCounter();

    const customAlertDialog = document.getElementById('customAlertDialog');
    if (customAlertDialog) {
        const okButton = customAlertDialog.querySelector('.btn-primary');
        const cancelButton = customAlertDialog.querySelector('.btn-secondary');
        if (okButton) okButton.textContent = trans.ok;
        if (cancelButton) cancelButton.textContent = trans.cancel;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('languagePreference') || 'en';
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLang;
        languageSelect.addEventListener('change', function() {
            updateLanguage(this.value);
        });
    }
    updateLanguage(savedLang);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, getTranslation, updateLanguage, currentLanguage };
}
