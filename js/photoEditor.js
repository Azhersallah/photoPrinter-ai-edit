// photoEditor.js
class PhotoEditor {
    constructor() {
        this.dom = {
            fileInput: document.getElementById('fileInput'),
            selectPhotosBtn: document.getElementById('selectPhotosBtn'),
            printBtn: document.getElementById('printBtn'),
            clearAllBtn: document.getElementById('clearAllBtn'),
            output: document.getElementById('output'),
            emptyState: document.getElementById('emptyState'),
            dropZone: document.getElementById('dropZone'),
            globalTitleInput: document.getElementById('globalTitle'),
            applyGlobalTitleBtn: document.getElementById('applyGlobalTitle'),
            clearGlobalTitle: document.getElementById('clearGlobalTitle'),
            photosPerPageSelect: document.getElementById('photosPerPage'),
            dragOverlay: document.getElementById('dragOverlay'),
            themeToggle: document.getElementById('themeToggle'),
            editorOverlay: document.getElementById('editorOverlay'),
            editorPreview: document.getElementById('editorPreview'),
            closeEditorBtn: document.getElementById('closeEditorBtn'),
            addTextBtn: document.getElementById('addTextBtn'),
            addCircleBtn: document.getElementById('addCircleBtn'),
            addRectangleBtn: document.getElementById('addRectangleBtn'),
            cropBtn: document.getElementById('cropBtn'),
            applyCropBtn: document.getElementById('applyCropBtn'),
            cancelCropBtn: document.getElementById('cancelCropBtn'),
            cropControls: document.getElementById('cropControls'),
            cancelEditBtn: document.getElementById('cancelEditBtn'),
            saveEditBtn: document.getElementById('saveEditBtn'),
            textContent: document.getElementById('textContent'),
            textColor: document.getElementById('textColor'),
            textSize: document.getElementById('textSize'),
            textFont: document.getElementById('textFont'),
            shapeColor: document.getElementById('shapeColor'),
            shapeWidth: document.getElementById('shapeWidth'),
            shapeFill: document.getElementById('shapeFill'),
            transparentFill: document.getElementById('transparentFill'),
            pdfExportBtn: document.getElementById('pdfExportBtn'),
            // Pagination DOM elements
            prevPageBtn: document.getElementById('prevPageBtn'),
            nextPageBtn: document.getElementById('nextPageBtn'),
            pageCounter: document.getElementById('pageCounter'),
            pageNavigation: document.getElementById('pageNavigation'),
            // New Find and Replace DOM elements
            findReplaceBtn: document.getElementById('findReplaceBtn'),
            findReplacePanel: document.getElementById('findReplacePanel'), // Changed from overlay to panel
            closeFindReplaceBtn: document.getElementById('closeFindReplaceBtn'),
            findInput: document.getElementById('findInput'),
            replaceInput: document.getElementById('replaceInput'),
            findNextBtn: document.getElementById('findNextBtn'),
            replaceBtn: document.getElementById('replaceBtn'),
            replaceAllBtn: document.getElementById('replaceAllBtn'),
            findStatus: document.getElementById('findStatus'),
            // Loading Overlay for PDF Export
            loadingOverlay: document.getElementById('loadingOverlay'),
            loadingText: document.getElementById('loadingText'),
        };

        this.state = {
            photos: [],
            rotations: {},
            photoTexts: {},
            pageLayouts: {}, // ADDED: To store individual page layouts
            currentEditingPhoto: null,
            annotations: [],
            activeAnnotation: null,
            isDragging: false,
            isResizing: false,
            isCropping: false,
            cropStartX: 0,
            cropStartY: 0,
            cropEndX: 0,
            cropEndY: 0,
            cropElement: null,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
            startLeft: 0,
            startTop: 0,
            savedTitles: {},
            savedSubtitles: {},
            logo: null,
            currentPage: 1, // This will now represent the *start* page of the current section
            totalPages: 0, // Total individual pages
            pagesPerSection: 10, // Number of pages to show per section
            currentSection: 1, // Current section being viewed
            totalSections: 0, // Total number of sections
            // New Find and Replace state
            findText: '',
            replaceText: '',
            foundOccurrences: [], // Array of { element: HTMLElement, originalText: string, startIndex: number, endIndex: number }
            currentOccurrenceIndex: -1,
            isFinding: false,
        };

        this.init();
    }

    init() {
        this.initDragAndDrop();
        this.setupEventListeners();
        this.setupEditorEventListeners();
        this.loadLogo();
        
        const savedTheme = localStorage.getItem('themePreference');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            // Update theme toggle icon here directly for initial load
            const themeToggleIcon = this.dom.themeToggle.querySelector('i');
            if (themeToggleIcon) {
                themeToggleIcon.classList.remove('fa-moon');
                themeToggleIcon.classList.add('fa-sun');
            }
        }

        const savedLanguage = localStorage.getItem('languagePreference') || 'en';
        this.dom.languageSelect.value = savedLanguage;
        // Call updateLanguage after all DOM elements are accessible
        document.addEventListener('DOMContentLoaded', () => {
            updateLanguage(savedLanguage);
        });
    }

    loadLogo() {
        this.state.logo = 'Logo/IT_department.jpg';
    }

    showCustomDialog(message, inputType = null, defaultValue = '', callback) {
        const existingDialog = document.getElementById('customAlertDialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'customAlertDialog';
        dialogOverlay.className = 'custom-dialog-overlay';
        dialogOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `;

        const dialogBox = document.createElement('div');
        dialogBox.className = 'custom-dialog';
        dialogBox.style.cssText = `
            background-color: white;
            color: black;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 90%;
            text-align: center;
            z-index: 999999;
            display: flex;
            flex-direction: column;
        `;

        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        const inputElement = document.createElement('input');
        inputElement.type = (inputType === 'number') ? 'text' : inputType;
        inputElement.value = defaultValue;
        inputElement.className = 'form-control';
        inputElement.style.width = '100%';
        inputElement.style.padding = '8px';
        inputElement.style.border = '1px solid #ccc';
        inputElement.style.borderRadius = '4px';
        inputElement.style.boxSizing = 'border-box';
        inputElement.dir = 'auto';

        if (inputType === 'number') {
            inputElement.setAttribute('data-numeric-input', 'true');
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-around';
        buttonContainer.style.marginTop = '15px';
        buttonContainer.style.gap = '10px';

        const okButton = document.createElement('button');
        // Ensure getTranslation is available globally or passed correctly
        okButton.textContent = typeof getTranslation === 'function' ? getTranslation('ok') : 'OK';
        okButton.className = 'btn btn-primary';
        okButton.style.flex = '1';

        const cancelButton = document.createElement('button');
        // Ensure getTranslation is available globally or passed correctly
        cancelButton.textContent = typeof getTranslation === 'function' ? getTranslation('cancel') : 'Cancel';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.style.flex = '1';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(okButton);
        dialogBox.appendChild(messageElement);
        if (inputType !== null) {
            dialogBox.appendChild(inputElement);
        }
        dialogBox.appendChild(buttonContainer);
        dialogOverlay.appendChild(dialogBox);
        document.body.appendChild(dialogOverlay);

        if (inputType !== null) {
            inputElement.focus();
        } else {
            okButton.focus();
        }

        okButton.addEventListener('click', () => {
            dialogOverlay.remove();
            callback(inputType !== null ? inputElement.value : true);
        });

        cancelButton.addEventListener('click', () => {
            dialogOverlay.remove();
            callback(null);
        });

        document.addEventListener('keydown', function handler(event) {
            if (event.key === 'Escape') {
                dialogOverlay.remove();
                callback(null);
                document.removeEventListener('keydown', handler);
            }
        });
    }

    // New Find and Replace Methods
    showFindReplaceDialog() {
        this.dom.findReplacePanel.classList.toggle('hidden');
        if (!this.dom.findReplacePanel.classList.contains('hidden')) {
            // Clear previous highlights and reset state when opening
            this.clearFindHighlights();
            this.state.foundOccurrences = [];
            this.state.currentOccurrenceIndex = -1;
            this.updateFindStatus();
            // Do not focus on the input, as per user request
        }
    }

    findTextInPages(searchText) {
        this.clearFindHighlights(); // Clear existing highlights
        this.state.foundOccurrences = []; // Reset found occurrences
        this.state.currentOccurrenceIndex = -1; // Reset current index

        if (!searchText) {
            this.updateFindStatus(getTranslation('enterTextToFind'));
            return;
        }

        const textAreas = document.querySelectorAll('.page-title-input, .layout-text-area');
        const lowerSearchText = searchText.toLowerCase();

        textAreas.forEach(element => {
            const originalText = element.value;
            const lowerOriginalText = originalText.toLowerCase();
            let lastIndex = 0;

            while (lastIndex < lowerOriginalText.length) {
                const foundIndex = lowerOriginalText.indexOf(lowerSearchText, lastIndex);
                if (foundIndex === -1) break;

                this.state.foundOccurrences.push({
                    element: element,
                    originalText: originalText, // Store original text for replacement
                    startIndex: foundIndex,
                    endIndex: foundIndex + searchText.length
                });
                lastIndex = foundIndex + searchText.length;
            }
        });

        if (this.state.foundOccurrences.length > 0) {
            this.state.currentOccurrenceIndex = 0; // Start with the first occurrence
            this.highlightCurrentOccurrence();
        } else {
            this.updateFindStatus(getTranslation('noMatchesFound'));
        }
    }

    highlightCurrentOccurrence() {
        this.clearFindHighlights(); // Clear all highlights first

        if (this.state.foundOccurrences.length === 0 || this.state.currentOccurrenceIndex === -1) {
            return;
        }

        const currentMatch = this.state.foundOccurrences[this.state.currentOccurrenceIndex];
        const element = currentMatch.element;
        
        // Add a class for visual indication (e.g., outline)
        element.classList.add('find-active-match'); 
        
        // Scroll the element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        this.updateFindStatus();
    }

    clearFindHighlights() {
        document.querySelectorAll('.find-active-match').forEach(el => {
            el.classList.remove('find-active-match');
        });
    }

    findNextOccurrence() {
        if (this.state.foundOccurrences.length === 0) {
            this.findTextInPages(this.dom.findInput.value); // Try to find if no matches yet
            if (this.state.foundOccurrences.length > 0) {
                this.state.currentOccurrenceIndex = 0; // If found, start at the first
                this.highlightCurrentOccurrence();
            }
            return;
        }
        
        this.state.currentOccurrenceIndex = (this.state.currentOccurrenceIndex + 1) % this.state.foundOccurrences.length;
        this.highlightCurrentOccurrence();
    }

    replaceCurrentOccurrence(replaceText) {
        if (this.state.foundOccurrences.length === 0 || this.state.currentOccurrenceIndex === -1) {
            this.updateFindStatus(getTranslation('noMatchesFound'));
            return;
        }

        const currentMatch = this.state.foundOccurrences[this.state.currentOccurrenceIndex];
        const element = currentMatch.element;
        const originalText = element.value; 

        const before = originalText.substring(0, currentMatch.startIndex);
        const after = originalText.substring(currentMatch.endIndex);
        
        element.value = before + replaceText + after;

        // Re-find all occurrences after a replacement, as indices might have shifted
        // This is crucial for correctness, even if it means a slight performance hit for single replacements.
        this.findTextInPages(this.dom.findInput.value); 
        this.updateFindStatus(); 
    }

    replaceAllOccurrences(findText, replaceText) {
        if (!findText) {
            this.updateFindStatus(getTranslation('enterTextToFind'));
            return;
        }
        // Re-scan all occurrences before replacing to get the most up-to-date indices
        this.findTextInPages(findText); 

        if (this.state.foundOccurrences.length === 0) {
            this.updateFindStatus(getTranslation('noMatchesFound'));
            return;
        }

        let replacementsMade = 0;
        // Create a copy and iterate backwards to handle shifting indices correctly
        const matchesToReplace = [...this.state.foundOccurrences].sort((a, b) => b.startIndex - a.startIndex);
        
        matchesToReplace.forEach(match => {
            const element = match.element;
            const originalText = element.value; 

            // Verify the match still exists at the expected position (important if previous replacements affected it)
            // Use current element.value for verification
            const currentSegment = originalText.substring(match.startIndex, match.endIndex);
            if (currentSegment.toLowerCase() === findText.toLowerCase()) {
                const before = originalText.substring(0, match.startIndex);
                const after = originalText.substring(match.endIndex);
                element.value = before + replaceText + after;
                replacementsMade++;
            }
        });

        this.clearFindHighlights(); // Clear all highlights after replacement
        this.state.foundOccurrences = []; // Reset found occurrences
        this.state.currentOccurrenceIndex = -1; // Reset current index
        this.updateFindStatus(getTranslation('replacedCount').replace('{count}', replacementsMade));
        
        // After replacing all, re-scan to show any new matches if the replacement text contains the find text
        this.findTextInPages(findText);
    }

    updateFindStatus(message = null) {
        if (message) {
            this.dom.findStatus.textContent = message;
        } else if (this.state.foundOccurrences.length > 0) {
            this.dom.findStatus.textContent = getTranslation('matchesFound')
                .replace('{current}', this.state.currentOccurrenceIndex + 1)
                .replace('{total}', this.state.foundOccurrences.length);
        } else {
            this.dom.findStatus.textContent = ''; // Clear status if no matches
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.photoEditor = new PhotoEditor();
});
