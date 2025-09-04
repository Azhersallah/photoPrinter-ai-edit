// events.js
PhotoEditor.prototype.setupEventListeners = function() {
    // Selectors for new Save/Load buttons
    this.dom.saveProjectBtn = document.getElementById('saveProjectBtn');
    this.dom.loadProjectBtn = document.getElementById('loadProjectBtn');
    this.dom.loadProjectInput = document.getElementById('loadProjectInput');

    // Existing event listeners
    this.dom.selectPhotosBtn.addEventListener('click', () => this.dom.fileInput.click());
    this.dom.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    this.dom.clearAllBtn.addEventListener('click', () => this.clearAllPhotos());
    this.dom.clearGlobalTitle.addEventListener('click', () => this.clearGlobalTitle());
    this.dom.languageSelect = document.getElementById('languageSelect');
    this.dom.languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });

    this.dom.printBtn.addEventListener('click', async () => {
        this.saveTitles();
        await this.arrangePhotos(); // Ensure photos are arranged for printing

        const titleInputs = document.querySelectorAll('.page-title-input');
            titleInputs.forEach(input => {
                this.autoResizeTextarea(input);
            });

        setTimeout(() => {
            window.print();
        }, 500);
    });
    this.dom.applyGlobalTitleBtn.addEventListener('click', () => this.applyGlobalTitle());
    
    this.dom.photosPerPageSelect.addEventListener('change', async () => {
        // Reset to first section when layout changes
        this.state.currentSection = 1;
        if (this.state.photos.length > 0) await this.arrangePhotos();
        this.updatePageCounter(); // Update pagination UI
    });
    
    this.dom.themeToggle.addEventListener('click', () => this.toggleTheme());

    this.dom.pdfExportBtn.addEventListener('click', () => this.exportToPDF());

    // New pagination event listeners (now for sections)
    this.dom.prevPageBtn.addEventListener('click', () => this.prevSection());
    this.dom.nextPageBtn.addEventListener('click', () => this.nextSection());

    // --- New Event Listeners for Save/Load ---
    this.dom.saveProjectBtn.addEventListener('click', () => this.saveProject());
    this.dom.loadProjectBtn.addEventListener('click', () => this.dom.loadProjectInput.click());
    this.dom.loadProjectInput.addEventListener('change', (e) => this.loadProject(e));

    // --- New Event Listeners for Find and Replace ---
    this.dom.findReplaceBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing it
        this.showFindReplaceDialog();
    });
    this.dom.closeFindReplaceBtn.addEventListener('click', () => {
        this.dom.findReplacePanel.classList.add('hidden'); // Ensure it closes
        this.clearFindHighlights(); // Clear highlights when closing
    });

    this.dom.findInput.addEventListener('input', (e) => {
        this.state.findText = e.target.value;
        this.clearFindHighlights(); // Clear highlights on new input
        this.state.currentOccurrenceIndex = -1; // Reset index
        this.updateFindStatus();
    });
    this.dom.findInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent new line in input
            this.findTextInPages(this.state.findText);
        }
    });
    this.dom.replaceInput.addEventListener('input', (e) => {
        this.state.replaceText = e.target.value;
    });
    this.dom.findNextBtn.addEventListener('click', () => this.findNextOccurrence());
    this.dom.replaceBtn.addEventListener('click', () => this.replaceCurrentOccurrence(this.state.replaceText));
    this.dom.replaceAllBtn.addEventListener('click', () => this.replaceAllOccurrences(this.state.findText, this.state.replaceText));

    // Close find/replace panel when clicking outside
    document.addEventListener('click', (e) => {
        // Check if the click is outside the panel AND not on the button that opens it
        if (!this.dom.findReplacePanel.classList.contains('hidden') && 
            !this.dom.findReplacePanel.contains(e.target) && 
            e.target !== this.dom.findReplaceBtn &&
            !this.dom.findReplaceBtn.contains(e.target)) { // Also check if click is inside the button's children
            this.dom.findReplacePanel.classList.add('hidden');
            this.clearFindHighlights(); // Clear highlights when closing
        }
    });
};

PhotoEditor.prototype.setupEditorEventListeners = function() {
    this.dom.closeEditorBtn.addEventListener('click', () => this.closeEditor());
    this.dom.cancelEditBtn.addEventListener('click', () => this.closeEditor());
    this.dom.saveEditBtn.addEventListener('click', () => this.saveEdits());
    
    this.dom.addTextBtn.addEventListener('click', () => this.addTextAnnotation());
    this.dom.addCircleBtn.addEventListener('click', () => this.addShapeAnnotation('circle'));
    this.dom.addRectangleBtn.addEventListener('click', () => this.addShapeAnnotation('rectangle'));
    this.dom.cropBtn.addEventListener('click', () => this.startCropping());
    this.dom.applyCropBtn.addEventListener('click', () => this.applyCrop());
    this.dom.cancelCropBtn.addEventListener('click', () => this.cancelCropping());
    
    this.dom.transparentFill.addEventListener('change', () => {
        this.dom.shapeFill.disabled = this.dom.transparentFill.checked;
        if (this.dom.transparentFill.checked) {
            this.dom.shapeFill.value = 'transparent';
        }
        if (this.state.activeAnnotation && this.state.activeAnnotation.type === 'shape') {
            this.state.activeAnnotation.element.style.backgroundColor = 
                this.dom.transparentFill.checked ? 'transparent' : this.dom.shapeFill.value;
            this.state.activeAnnotation.fill = 
                this.dom.transparentFill.checked ? 'transparent' : this.dom.shapeFill.value;
        }
    });
    
    this.dom.textContent.addEventListener('input', () => {
        if (this.state.activeAnnotation && this.state.activeAnnotation.type === 'text') {
            // Note: For pre tags, use textContent, not value
            this.state.activeAnnotation.element.textContent = this.dom.textContent.value;
            this.resizeTextarea(this.state.activeAnnotation.element);
        }
    });
    
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', () => this.handleMouseUp());
    
    this.dom.textColor.addEventListener('input', () => this.updateTextAnnotationProperty('color'));
    this.dom.textSize.addEventListener('input', () => this.updateTextAnnotationProperty('size'));
    this.dom.textFont.addEventListener('change', () => this.updateTextAnnotationProperty('font'));
    this.dom.shapeColor.addEventListener('input', () => this.updateShapeAnnotationProperty('color'));
    this.dom.shapeWidth.addEventListener('input', () => this.updateShapeAnnotationProperty('widthValue'));
    this.dom.shapeFill.addEventListener('input', () => {
        if (!this.dom.transparentFill.checked) {
            this.updateShapeAnnotationProperty('fill');
        }
    });
};

PhotoEditor.prototype.handleMouseMove = function(e) {
    if (this.state.isCropping) {
        this.updateCropSelection(e);
        return;
    }

    if (!this.state.isDragging && !this.state.isResizing) return;
    
    if (this.state.isDragging && this.state.activeAnnotation) {
        // Calculate position relative to the editorPreview, which contains the image
        const previewRect = this.dom.editorPreview.getBoundingClientRect();
        const x = e.clientX - this.state.startX - previewRect.left;
        const y = e.clientY - this.state.startY - previewRect.top;
        
        // Clamp to image bounds
        const clampedX = Math.max(0, Math.min(x, this.state.activeImageBounds.width - this.state.activeAnnotation.element.offsetWidth));
        const clampedY = Math.max(0, Math.min(y, this.state.activeImageBounds.height - this.state.activeAnnotation.element.offsetHeight));

        this.state.activeAnnotation.element.style.left = `${clampedX}px`;
        this.state.activeAnnotation.element.style.top = `${clampedY}px`;

        // Update activeAnnotation state with new clamped position
        this.state.activeAnnotation.x = clampedX;
        this.state.activeAnnotation.y = clampedY;

    } else if (this.state.isResizing && this.state.activeAnnotation) {
        let width = this.state.startWidth + (e.clientX - this.state.startX);
        let height = this.state.startHeight + (e.clientY - this.state.startY);

        // Clamp width/height to ensure it doesn't go beyond image bounds or become too small
        width = Math.max(30, width); // Minimum width
        height = Math.max(30, height); // Minimum height

        // Ensure resizing doesn't go beyond the right/bottom edge of the image
        const maxAllowedWidth = this.state.activeImageBounds.width - this.state.activeAnnotation.x;
        const maxAllowedHeight = this.state.activeImageBounds.height - this.state.activeAnnotation.y;

        width = Math.min(width, maxAllowedWidth);
        height = Math.min(height, maxAllowedHeight);
        
        this.state.activeAnnotation.element.style.width = `${width}px`;
        this.state.activeAnnotation.element.style.height = `${height}px`;

        // Update activeAnnotation state with new clamped dimensions
        this.state.activeAnnotation.width = width;
        this.state.activeAnnotation.height = height;
        
        if (this.state.activeAnnotation.type === 'text') {
            this.resizeTextarea(this.state.activeAnnotation.element);
        }
    }
};

PhotoEditor.prototype.handleMouseUp = function() {
    if (this.state.isCropping) {
        return;
    }
    
    this.state.isDragging = false;
    this.state.isResizing = false;
};

PhotoEditor.prototype.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeToggleIcon = this.dom.themeToggle.querySelector('i');

    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggleIcon) {
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        }
        localStorage.setItem('themePreference', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggleIcon) {
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        }
        localStorage.setItem('themePreference', 'dark');
    }
};
