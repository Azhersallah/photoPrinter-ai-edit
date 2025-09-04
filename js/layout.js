PhotoEditor.prototype.sortPhotosByName = function() {
   this.state.photos.sort((a, b) => {
       const nameA = (a.name || a.fileName || '').toLowerCase();
       const nameB = (b.name || b.fileName || '').toLowerCase();
       return nameA.localeCompare(nameB);
   });
   this.arrangePhotos();
};

/**
 * Gets the number of photos for a given layout string.
 * @param {string} layout - The layout identifier (e.g., '1', '2text').
 * @returns {number} The number of photos for that layout.
 */
PhotoEditor.prototype.getPhotosForLayout = function(layout) {
    switch (layout) {
        case '1':
        case '1text':
            return 1;
        case '2':
        case '2text':
            return 2;
        case '4':
            return 4;
        default:
            // Fallback to global default for safety
            const defaultLayout = this.dom.photosPerPageSelect.value;
            switch(defaultLayout) {
                case '1': case '1text': return 1;
                case '2': case '2text': return 2;
                case '4': return 4;
                default: return 4;
            }
    }
};

/**
 * Gets the layout for a specific page, falling back to the global default.
 * @param {number} pageIndex - The 0-based index of the page.
 * @returns {string} The layout identifier for the page.
 */
PhotoEditor.prototype.getPageLayout = function(pageIndex) {
    return this.state.pageLayouts?.[pageIndex] || this.dom.photosPerPageSelect.value;
};


PhotoEditor.prototype.getPhotosPerPage = function() {
    const photosPerPageValue = this.dom.photosPerPageSelect.value;
    switch (photosPerPageValue) {
        case '1':
        case '1text':
            return 1;
        case '2':
        case '2text':
            return 2;
        case '4':
            return 4;
        default:
            return 4;
    }
};

/**
 * Calculates the total number of pages based on individual page layouts.
 * @returns {number} The total number of pages.
 */
PhotoEditor.prototype.getTotalPages = function() {
    if (!this.state.photos || this.state.photos.length === 0) return 1;

    let pageCount = 0;
    let photoIndex = 0;
    while(photoIndex < this.state.photos.length) {
       const layout = this.getPageLayout(pageCount);
       const photosOnPage = this.getPhotosForLayout(layout);
       photoIndex += photosOnPage;
       pageCount++;
    }
    return Math.max(1, pageCount);
};


PhotoEditor.prototype.getTotalSections = function() {
    return Math.max(1, Math.ceil(this.getTotalPages() / this.state.pagesPerSection));
};

/**
 * Recalculates the distribution of photos into pages based on individual layouts.
 * @returns {Array<Object>} An array of page data objects.
 */
PhotoEditor.prototype.recalculatePageDistribution = function() {
    const distribution = [];
    if (!this.state.photos || this.state.photos.length === 0) {
        distribution.push({
            layout: this.dom.photosPerPageSelect.value,
            photos: [],
            startIndex: 0,
        });
        return distribution;
    }

    let photoIndex = 0;
    let pageIndexCounter = 0;
    while(photoIndex < this.state.photos.length) {
        const layout = this.getPageLayout(pageIndexCounter);
        const photosOnPage = this.getPhotosForLayout(layout);
        const endIndex = Math.min(photoIndex + photosOnPage, this.state.photos.length);
        distribution.push({
            layout,
            photos: this.state.photos.slice(photoIndex, endIndex),
            startIndex: photoIndex,
        });
        photoIndex = endIndex;
        pageIndexCounter++;
    }
    return distribution;
};


PhotoEditor.prototype.insertNewPage = function(position, pageIndexFromCustomDialog = null) {
    const performInsertion = (targetPageIndex) => {
        const distribution = this.recalculatePageDistribution();
        let photoInsertionIndex;

        if (targetPageIndex >= distribution.length) {
            photoInsertionIndex = this.state.photos.length;
        } else {
            photoInsertionIndex = distribution[targetPageIndex].startIndex;
        }

        const newPageLayout = this.dom.photosPerPageSelect.value;
        const photosToInsert = this.getPhotosForLayout(newPageLayout);

        const emptyPhotos = [];
        for (let i = 0; i < photosToInsert; i++) {
            emptyPhotos.push({
                id: 'empty_' + Date.now() + '_' + i,
                src: this.createEmptyImageDataURL(),
                name: `Empty Slot ${i + 1}`,
                fileName: `Empty Slot ${i + 1}`,
                isEmpty: true,
                annotations: []
            });
        }

        this.state.photos.splice(photoInsertionIndex, 0, ...emptyPhotos);

        const newPageLayouts = {};
        for (const key in this.state.pageLayouts) {
            const oldPageIndex = parseInt(key, 10);
            if (oldPageIndex < targetPageIndex) {
                newPageLayouts[oldPageIndex] = this.state.pageLayouts[key];
            } else {
                newPageLayouts[oldPageIndex + 1] = this.state.pageLayouts[key];
            }
        }
        this.state.pageLayouts = newPageLayouts;

        this.arrangePhotos();
        this.updatePageCounter();
    };

    if (position === 'start') {
        performInsertion(0);
    } else if (position === 'end') {
        const totalPages = this.getTotalPages();
        performInsertion(totalPages);
    } else if (position === 'custom' && pageIndexFromCustomDialog !== null) {
        const pageIndex = parseInt(pageIndexFromCustomDialog, 10);
        if (!isNaN(pageIndex) && pageIndex >= 1) {
            performInsertion(pageIndex - 1);
        } else {
            this.showCustomDialog(getTranslation('invalidPageNumber'), null, '', function(){});
        }
    }
};


PhotoEditor.prototype._performPageInsertion = function(insertionIndex, photosPerPage) {
    for (let i = 0; i < photosPerPage; i++) {
        const emptyPhoto = {
            id: 'empty_' + Date.now() + '_' + i,
            src: this.createEmptyImageDataURL(),
            name: `Empty Slot ${i + 1}`,
            fileName: `Empty Slot ${i + 1}`,
            isEmpty: true,
            annotations: []
        };
        this.state.photos.splice(insertionIndex + i, 0, emptyPhoto);
    }
    this.state.totalPages = this.getTotalPages();
    this.state.totalSections = this.getTotalSections();
    this.state.currentSection = Math.ceil((insertionIndex / photosPerPage + 1) / this.state.pagesPerSection);
    if (this.state.currentSection === 0 && this.state.totalSections > 0) {
        this.state.currentSection = 1;
    } else if (this.state.totalSections === 0) {
        this.state.currentSection = 1;
    }
    this.arrangePhotos();
    this.updatePageCounter();
};

PhotoEditor.prototype.createEmptyImageDataURL = function() {
   const canvas = document.createElement('canvas');
   canvas.width = 400;
   canvas.height = 300;
   const ctx = canvas.getContext('2d');
   ctx.fillStyle = '#f8f9fa';
   ctx.fillRect(0, 0, 400, 300);
   ctx.strokeStyle = '#dee2e6';
   ctx.setLineDash([5, 5]);
   ctx.strokeRect(10, 10, 380, 280);
   ctx.fillStyle = '#6c757d';
   ctx.font = '16px Arial';
   ctx.textAlign = 'center';
   ctx.fillText('Empty Slot', 200, 140);
   ctx.fillText('Click to add photo', 200, 160);
   return canvas.toDataURL();
};

PhotoEditor.prototype.changePhoto = function(photoId, photoIndex) {
   const input = document.createElement('input');
   input.type = 'file';
   input.accept = 'image/*';
   input.style.display = 'none';
   input.addEventListener('change', (e) => {
       const file = e.target.files[0];
       if (file) {
           const reader = new FileReader();
           reader.onload = (event) => {
               const photoToReplace = this.state.photos.find(photo => photo.id === photoId);
               if (photoToReplace) {
                   const preservedText = this.getPhotoText(photoId);
                   const preservedRotation = this.state.rotations ? this.state.rotations[photoId] : 0;
                   photoToReplace.src = event.target.result;
                   photoToReplace.name = file.name;
                   photoToReplace.fileName = file.name;
                   photoToReplace.isEmpty = false;
                   photoToReplace.annotations = [];
                   this.arrangePhotos().then(() => {
                       if (preservedText) {
                           this.savePhotoText(photoId, preservedText);
                           const textArea = document.querySelector(`[data-photo-id="${photoId}"] + .text-area-container textarea`);
                           if (textArea) {
                               textArea.value = preservedText;
                           }
                       }
                       if (preservedRotation !== 0) {
                           if (!this.state.rotations) {
                               this.state.rotations = {};
                           }
                           this.state.rotations[photoId] = preservedRotation;
                           const canvas = document.querySelector(`[data-photo-id="${photoId}"] canvas`);
                           if (canvas) {
                               canvas.style.transform = `rotate(${preservedRotation}deg)`;
                           }
                       }
                   });
               }
           };
           reader.readAsDataURL(file);
       }
       document.body.removeChild(input);
   });
   document.body.appendChild(input);
   input.click();
};

PhotoEditor.prototype.arrangePhotos = async function() {
    
   this.saveAllTitles();

   this.dom.output.innerHTML = '';
   if (!this.state.photos || this.state.photos.length === 0) {
       this.dom.emptyState.classList.remove('hidden');
       this.dom.output.classList.add('hidden');
       this.updatePageCounter();
       return;
   }
   this.dom.emptyState.classList.add('hidden');
   this.dom.output.classList.remove('hidden');

   const pageDistribution = this.recalculatePageDistribution();
   
   this.state.totalPages = pageDistribution.length;
   this.state.totalSections = this.getTotalSections();

   if (this.state.currentSection > this.state.totalSections) {
       this.state.currentSection = this.state.totalSections;
   }
   if (this.state.currentSection < 1) {
       this.state.currentSection = 1;
   }

   const startPageIndex = (this.state.currentSection - 1) * this.state.pagesPerSection;
   const endPageIndex = Math.min(startPageIndex + this.state.pagesPerSection, this.state.totalPages);
   
   const imageLoadPromises = [];

   for (let pageIndex = startPageIndex; pageIndex < endPageIndex; pageIndex++) {
        const pageData = pageDistribution[pageIndex];
        const pagePhotos = pageData.photos;
        const layout = pageData.layout;
        const startIndex = pageData.startIndex;
       
        const photosPerPageValue = layout;
        let hasTextAreas = photosPerPageValue.includes('text');

        const page = document.createElement('div');
        page.className = 'a4-page';

        const pageContent = document.createElement('div');
        pageContent.className = 'page-content';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'page-title';
        const titleInput = document.createElement('textarea');
        titleInput.placeholder = getTranslation('pageTitle');
        titleInput.className = 'page-title-input';
        titleInput.style.resize = 'none';
        titleInput.style.overflow = 'hidden';
        titleInput.style.lineHeight = '1.4';
        titleInput.rows = 1;
        titleInput.dir = 'rtl';
        titleInput.value = this.state.savedTitles[pageIndex] || '';
        titleInput.addEventListener('input', () => {
           this.autoResizeTextarea(titleInput);
           if (!this.state.savedTitles) {
               this.state.savedTitles = {};
           }
           this.state.savedTitles[pageIndex] = titleInput.value;
        });
        titleInput.addEventListener('keydown', (e) => {
           if (e.key === 'Enter') {
               setTimeout(() => {
                   this.autoResizeTextarea(titleInput);
               }, 0);
           }
        });
        titleInput.addEventListener('paste', () => {
           setTimeout(() => {
               this.autoResizeTextarea(titleInput);
           }, 0);
        });
        setTimeout(() => {
           this.autoResizeTextarea(titleInput);
        }, 0);
        titleDiv.appendChild(titleInput);
        pageContent.appendChild(titleDiv);
        
        const pageTools = document.createElement('div');
        pageTools.className = 'page-level-tools';

        const layoutBtn = document.createElement('button');
        layoutBtn.className = 'layout-switcher-btn';
        layoutBtn.innerHTML = '<i class="fas fa-th-large"></i>';
        layoutBtn.title = getTranslation('changeLayout') || 'Change Layout';
        
        const popover = document.createElement('div');
        popover.className = 'layout-popover';

        const layouts = {
            '4': `4 ${getTranslation('photos') || 'Photos'}`,
            '2': `2 ${getTranslation('photos') || 'Photos'}`,
            '1': `1 ${getTranslation('photo') || 'Photo'}`,
            '2text': `2 ${getTranslation('photos') || 'Photos'} + ${getTranslation('text') || 'Text'}`,
            '1text': `1 ${getTranslation('photo') || 'Photo'} + ${getTranslation('text') || 'Text'}`,
        };

        for (const val in layouts) {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'layout-option';
            optionBtn.textContent = layouts[val];
            optionBtn.dataset.layout = val;
            if (val === layout) {
                optionBtn.classList.add('active');
            }
            optionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLayout = e.currentTarget.dataset.layout;
                this.state.pageLayouts[pageIndex] = newLayout;
                this.arrangePhotos();
            });
            popover.appendChild(optionBtn);
        }

        pageTools.appendChild(layoutBtn);
        pageTools.appendChild(popover);
        page.appendChild(pageTools);

        layoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.layout-popover.visible').forEach(p => {
                if (p !== popover) p.classList.remove('visible');
            });
            popover.classList.toggle('visible');
        });
        
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayFormatted = `${day}/${month}/${year}`;

        const footerContainer = document.createElement('div');
        footerContainer.className = 'page-footer-container';

        const dateElement = document.createElement('div');
        dateElement.className = 'footer-date';
        dateElement.textContent = todayFormatted;
        footerContainer.appendChild(dateElement);

        const pageNumberElement = document.createElement('div');
        pageNumberElement.className = 'page-number';
        const startNum = this.state.customStartPageNumber || 1;
        pageNumberElement.textContent = `( ${pageIndex + startNum} )`;
        footerContainer.appendChild(pageNumberElement);

        const logoContainer = document.createElement('div');
        logoContainer.className = 'page-logo';
        const logoImg = document.createElement('img');
        logoImg.src = this.state.logo;
        logoImg.alt = 'Logo';
        logoContainer.appendChild(logoImg);
        footerContainer.appendChild(logoContainer);

        const grid = document.createElement('div');
       
        let layoutClass;
        switch (photosPerPageValue) {
            case '1': layoutClass = 'layout-1x1'; break;
            case '2': layoutClass = 'layout-2x1'; break;
            case '4': layoutClass = 'layout-2x2'; break;
            case '1text': layoutClass = 'layout-1x1-text'; break;
            case '2text': layoutClass = 'layout-2x2-text'; break;
            default: layoutClass = 'layout-2x2';
        }
       
        grid.className = `photo-grid ${layoutClass}`;

        pagePhotos.forEach((photo, photoInPageIndex) => {
            const globalPhotoIndex = startIndex + photoInPageIndex;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'photo-wrapper';

            const photoContainer = document.createElement('div');
            photoContainer.className = 'photo-container';
            if (photo.isEmpty) {
               photoContainer.classList.add('empty-slot');
            }
            photoContainer.dataset.photoId = photo.id;
            photoContainer.dataset.photoIndex = globalPhotoIndex;
            photoContainer.dataset.globalIndex = globalPhotoIndex;
           
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⋮⋮';
            dragHandle.title = getTranslation('dragToReorder');
            photoContainer.appendChild(dragHandle);
            photoContainer.draggable = true;
            photoContainer.addEventListener('dragstart', (e) => {
               e.dataTransfer.setData('text/plain', globalPhotoIndex.toString());
               photoContainer.classList.add('dragging');
            });
            photoContainer.addEventListener('dragend', () => {
               photoContainer.classList.remove('dragging');
               document.querySelectorAll('.photo-container').forEach(container => {
                   container.classList.remove('drag-over');
               });
            });
            photoContainer.addEventListener('dragover', (e) => {
               e.preventDefault();
               if (!photoContainer.classList.contains('dragging')) {
                   photoContainer.classList.add('drag-over');
               }
            });
            photoContainer.addEventListener('dragleave', (e) => {
               if (!photoContainer.contains(e.relatedTarget)) {
                   photoContainer.classList.remove('drag-over');
               }
            });
            photoContainer.addEventListener('drop', (e) => {
               e.preventDefault();
               photoContainer.classList.remove('drag-over');
               const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
               const toIndex = globalPhotoIndex;
               if (fromIndex !== toIndex) {
                   this.movePhotoWithText(fromIndex, toIndex);
               }
            });
           
            const photoNumberBadge = document.createElement('div');
            photoNumberBadge.className = 'photo-number-badge';
            photoNumberBadge.textContent = globalPhotoIndex + 1;
            photoContainer.appendChild(photoNumberBadge);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const loadPromise = new Promise((resolve) => {
               img.onload = () => {
                   photo.originalWidth = img.naturalWidth;
                   photo.originalHeight = img.naturalHeight;
                   canvas.width = photo.originalWidth;
                   canvas.height = photo.originalHeight;
                   ctx.drawImage(img, 0, 0, photo.originalWidth, photo.originalHeight);

                   if (photo.annotations && photo.annotations.length > 0) {
                       photo.annotations.forEach(anno => {
                           if (anno.type === 'text') {
                               ctx.font = `${anno.size}px ${anno.font}`;
                               ctx.fillStyle = anno.color;
                               ctx.textAlign = 'right';
                               const textDrawX = anno.x + anno.width;

                               const lines = anno.text.split('\n');
                               lines.forEach((line, i) => {
                                   ctx.fillText(
                                       line,
                                       textDrawX,
                                       anno.y + anno.size + (i * anno.size * 1.2)
                                   );
                               });
                           } else if (anno.type === 'shape') {
                               ctx.strokeStyle = anno.color;
                               ctx.lineWidth = anno.widthValue;
                               ctx.fillStyle = anno.fill;
                               if (anno.shape === 'rectangle') {
                                   ctx.beginPath();
                                   ctx.rect(
                                       anno.x,
                                       anno.y,
                                       anno.width,
                                       anno.height
                                   );
                                   ctx.fill();
                                   ctx.stroke();
                               } else if (anno.shape === 'circle') {
                                   const centerX = anno.x + (anno.width / 2);
                                   const centerY = anno.y + (anno.height / 2);
                                   const radiusX = anno.width / 2;
                                   const radiusY = anno.height / 2;
                                   ctx.beginPath();
                                   ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                                   ctx.fill();
                                   ctx.stroke();
                               }
                           }
                       });
                   }

                   canvas.style.width = `auto`;
                   canvas.style.height = `auto`;

                   if (this.state.rotations[photo.id]) {
                       canvas.style.transform = `rotate(${this.state.rotations[photo.id]}deg)`;
                   }
                   resolve();
               };
               img.onerror = resolve;
               img.src = photo.src;
            });
            imageLoadPromises.push(loadPromise);
           
            if (photo.isEmpty) {
               photoContainer.style.cursor = 'pointer';
               photoContainer.addEventListener('click', () => {
                   this.changePhoto(photo.id, globalPhotoIndex);
               });
            }

            photoContainer.appendChild(canvas);

            const toolsDiv = document.createElement('div');
            toolsDiv.className = 'photo-tools';

            const editBtn = document.createElement('button');
            editBtn.className = 'tool-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = getTranslation('editPhoto');
            editBtn.setAttribute('data-icon-only', 'true');
            editBtn.addEventListener('click', (e) => {
               e.stopPropagation();
               this.openEditor(photo);
            });

            const changeBtn = document.createElement('button');
            changeBtn.className = 'tool-btn';
            changeBtn.innerHTML = '<i class="fa-solid fa-images"></i>';
            changeBtn.title = getTranslation('changePhoto');
            changeBtn.setAttribute('data-icon-only', 'true');
            changeBtn.addEventListener('click', (e) => {
               e.stopPropagation();
               this.changePhoto(photo.id, globalPhotoIndex);
            });

            const rotateLeftBtn = document.createElement('button');
            rotateLeftBtn.className = 'tool-btn';
            rotateLeftBtn.innerHTML = '<i class="fas fa-undo"></i>';
            rotateLeftBtn.title = getTranslation('rotateLeft');
            rotateLeftBtn.setAttribute('data-icon-only', 'true');
            rotateLeftBtn.addEventListener('click', (e) => {
               e.stopPropagation();
               this.rotatePhoto(photo.id, -90);
            });

            const rotateRightBtn = document.createElement('button');
            rotateRightBtn.className = 'tool-btn';
            rotateRightBtn.innerHTML = '<i class="fas fa-redo"></i>';
            rotateRightBtn.title = getTranslation('rotateRight');
            rotateRightBtn.setAttribute('data-icon-only', 'true');
            rotateRightBtn.addEventListener('click', (e) => {
               e.stopPropagation();
               this.rotatePhoto(photo.id, 90);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'tool-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = getTranslation('deletePhoto');
            deleteBtn.setAttribute('data-icon-only', 'true');
            deleteBtn.addEventListener('click', (e) => {
               e.stopPropagation();
               this.confirmDeletePhoto(photo.id, globalPhotoIndex);
            });

            toolsDiv.appendChild(editBtn);
            toolsDiv.appendChild(changeBtn);
            toolsDiv.appendChild(rotateLeftBtn);
            toolsDiv.appendChild(rotateRightBtn);
            toolsDiv.appendChild(deleteBtn);
            photoContainer.appendChild(toolsDiv);
            
            wrapper.appendChild(photoContainer);

            const insertionDiv = document.createElement('div');
            insertionDiv.className = 'insertion-point';
            const addBtn = document.createElement('button');
            addBtn.className = 'add-photo-here-btn';
            addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            addBtn.title = getTranslation('addPhotoHere');
            addBtn.dataset.insertionIndex = globalPhotoIndex + 1;

            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.insertionIndex, 10);
                this.promptForPhotoInsertion(index);
            });

            insertionDiv.appendChild(addBtn);
            wrapper.appendChild(insertionDiv);
            
            grid.appendChild(wrapper);

            if (hasTextAreas) {
               const textContainer = document.createElement('div');
               textContainer.className = 'text-area-container';
               textContainer.dataset.photoId = photo.id;
               textContainer.dataset.photoIndex = globalPhotoIndex;
               const textArea = document.createElement('textarea');
               textArea.className = 'layout-text-area';
               textArea.placeholder = getTranslation('textAreaPlaceholder');
               textArea.dir = 'rtl';
               textArea.disabled = false;
               if (this.state.photoTexts && this.state.photoTexts[photo.id]) {
                   textArea.value = this.state.photoTexts[photo.id];
               }
               textArea.addEventListener('input', () => {
                   this.savePhotoText(photo.id, textArea.value);
               });
               textContainer.appendChild(textArea);
               grid.appendChild(textContainer);
            }
        });

        const photosOnThisPage = this.getPhotosForLayout(layout);
        if (!hasTextAreas && pagePhotos.length < photosOnThisPage) {
            const emptySlotsToAdd = photosOnThisPage - pagePhotos.length;
            for (let i = 0; i < emptySlotsToAdd; i++) {
               const container = document.createElement('div');
               container.className = 'photo-container empty';
               grid.appendChild(container);
            }
        }
       
        pageContent.appendChild(grid);
        pageContent.appendChild(footerContainer);
        page.appendChild(pageContent);
        this.dom.output.appendChild(page);
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.page-level-tools')) {
            document.querySelectorAll('.layout-popover.visible').forEach(p => p.classList.remove('visible'));
        }
    }, { once: true });

    this.updatePageCounter();
    updateLanguage(currentLanguage);

    return Promise.all(imageLoadPromises);
};

PhotoEditor.prototype.deletePhotoWithText = function(photoId, photoIndex) {
   this.saveAllTitles();

   this.state.photos = this.state.photos.filter(photo => photo.id !== photoId);
   if (this.state.photoTexts && this.state.photoTexts[photoId]) {
       delete this.state.photoTexts[photoId];
   }
   if (this.state.rotations && this.state.rotations[photoId]) {
       delete this.state.rotations[photoId];
   }
   
   this.arrangePhotos();
   this.updatePageCounter();
   setTimeout(() => {
       const textAreas = document.querySelectorAll('.layout-text-area, .page-title-input');
       textAreas.forEach(textarea => {
           textarea.disabled = false;
           textarea.style.backgroundColor = 'white';
           textarea.style.cursor = 'text';
       });
   }, 100);
};

PhotoEditor.prototype.confirmDeletePhoto = function(photoId, photoIndex) {
   const photoNumber = photoIndex + 1;
   const confirmMessage = `${getTranslation('deletePhotoConfirm')} ${photoNumber}؟\n\n${getTranslation('deleteWithTextConfirm')}`;
   this.showCustomDialog(confirmMessage, null, '', (result) => {
       if (result) {
           this.deletePhotoWithText(photoId, photoIndex);
       }
   });
};

PhotoEditor.prototype.printWithRotations = function() {
   const originalTransforms = {};
   const canvases = document.querySelectorAll('.photo-grid canvas');
   canvases.forEach((canvas, index) => {
       const container = canvas.closest('.photo-container');
       if (container && container.dataset.photoId) {
           const photoId = container.dataset.photoId;
           originalTransforms[photoId] = canvas.style.transform;
           if (this.state.rotations && this.state.rotations[photoId]) {
               canvas.style.transform = `rotate(${this.state.rotations[photoId]}deg)`;
           }
       }
   });
   window.print();
   setTimeout(() => {
       canvases.forEach((canvas) => {
           const container = canvas.closest('.photo-container');
           if (container && container.dataset.photoId) {
               const photoId = container.dataset.photoId;
               if (originalTransforms[photoId] !== undefined) {
                   canvas.style.transform = originalTransforms[photoId];
               }
           }
       });
   }, 1000);
};

PhotoEditor.prototype.deletePhoto = function(photoId) {
   this.deletePhotoWithText(photoId);
};

PhotoEditor.prototype.savePhotoText = function(photoId, text) {
   if (!this.state.photoTexts) {
       this.state.photoTexts = {};
   }
   this.state.photoTexts[photoId] = text;
};

PhotoEditor.prototype.getPhotoText = function(photoId) {
   return this.state.photoTexts && this.state.photoTexts[photoId] ? this.state.photoTexts[photoId] : '';
};

PhotoEditor.prototype.movePhotoWithText = function(fromIndex, toIndex) {
   if (fromIndex === toIndex) return;
   const movedPhoto = this.state.photos.splice(fromIndex, 1)[0];
   this.state.photos.splice(toIndex, 0, movedPhoto);
   this.arrangePhotos();
};

PhotoEditor.prototype.rotatePhoto = function(photoId, degrees) {
   if (!this.state.rotations) {
       this.state.rotations = {};
   }
   this.state.rotations[photoId] = (this.state.rotations[photoId] || 0) + degrees;
   const canvas = document.querySelector(`[data-photo-id="${photoId}"] canvas`);
   if (canvas) {
       canvas.style.transform = `rotate(${this.state.rotations[photoId]}deg)`;
   }
};

PhotoEditor.prototype.updatePageCounter = function() {
    this.state.totalPages = this.getTotalPages();
    this.state.totalSections = this.getTotalSections();

    const startPageInCurrentSection = (this.state.currentSection - 1) * this.state.pagesPerSection + 1;
    const endPageInCurrentSection = Math.min(startPageInCurrentSection + this.state.pagesPerSection - 1, this.state.totalPages);

    let pageCounterText;
    if (this.state.totalPages === 0 || this.state.photos.length === 0) {
        pageCounterText = getTranslation('noPhotos');
    } else if (this.state.totalSections === 1 || this.state.totalPages <= this.state.pagesPerSection) {
        pageCounterText = getTranslation('pageOf')
            .replace('{currentPage}', this.state.currentPage)
            .replace('{totalPages}', this.state.totalPages);
    } else {
        pageCounterText = getTranslation('pagesRangeOfTotal')
            .replace('{startPage}', endPageInCurrentSection)
            .replace('{endPage}', "")
            .replace('{totalPages}', this.state.totalPages);
    }
    
    this.dom.pageCounter.textContent = pageCounterText;
    this.updatePageNavigationUI();
};


PhotoEditor.prototype.updatePageNavigationUI = function() {
    this.dom.pageNavigation.style.display = 'flex';
    this.state.totalPages = this.getTotalPages();
    this.state.totalSections = this.getTotalSections();

    if (this.state.totalSections > 1 && this.state.photos.length > 0) {
        this.dom.prevPageBtn.disabled = (this.state.currentSection <= 1);
        this.dom.nextPageBtn.disabled = (this.state.currentSection >= this.state.totalSections);
    } else {
        this.dom.prevPageBtn.disabled = true;
        this.dom.nextPageBtn.disabled = true;
    }
};


PhotoEditor.prototype.nextSection = function() {
    if (this.state.currentSection < this.state.totalSections) {
        this.state.currentSection++;
        this.arrangePhotos();
    }
};

PhotoEditor.prototype.prevSection = function() {
    if (this.state.currentSection > 1) {
        this.state.currentSection--;
        this.arrangePhotos();
    }
};

PhotoEditor.prototype.autoResizeTextarea = function(textarea) {
  const scrollTop = textarea.scrollTop;
  textarea.style.height = 'auto';
  const newHeight = Math.max(textarea.scrollHeight, parseInt(getComputedStyle(textarea).lineHeight, 10));
  textarea.style.height = newHeight + 'px';
  textarea.scrollTop = scrollTop;
  textarea.disabled = false;
  if (this.state.savingTitles) {
      const index = Array.from(document.querySelectorAll('.page-title-input')).indexOf(textarea);
      if (index >= 0) {
          this.state.savedTitleHeights[index] = textarea.style.height;
      }
  }
};

PhotoEditor.prototype.updateLanguagePlaceholders = function() {
  const titleInputs = document.querySelectorAll('.page-title-input');
  titleInputs.forEach(input => {
      input.placeholder = getTranslation('pageTitle');
      input.disabled = false;
  });
  const layoutTextAreas = document.querySelectorAll('.layout-text-area');
  layoutTextAreas.forEach(textarea => {
      textarea.placeholder = getTranslation('textAreaPlaceholder');
      textarea.disabled = false;
  });
};

PhotoEditor.prototype.initializePhotoEditor = function() {
  if (!this.state) {
      this.state = {
          photos: [],
          photoTexts: {},
          savedTitles: {},
          rotations: {},
          pageLayouts: {},
          currentPage: 1, 
          totalPages: 0, 
          pagesPerSection: 10, 
          currentSection: 1,
          totalSections: 0,
          customStartPageNumber: 1
      };
  }
  this.initializeDragAndDrop();
  if (this.state.photos && this.state.photos.length > 0) {
      this.sortPhotosByName();
  }
  setInterval(() => {
      const textAreas = document.querySelectorAll('.layout-text-area, .page-title-input');
      textAreas.forEach(textarea => {
          if (textarea.disabled) {
              textarea.disabled = false;
              textarea.style.backgroundColor = 'white';
              textarea.style.cursor = 'text';
          }
      });
  }, 1000);
  this.updatePageCounter();
};

PhotoEditor.prototype.sortPhotos = function() {
  this.sortPhotosByName();
};

PhotoEditor.prototype.restoreTitles = function() {
  if (!this.state.savedTitles) return;
  setTimeout(() => {
      const titleInputs = document.querySelectorAll('.page-title-input');
      const startPageIndex = (this.state.currentSection - 1) * this.state.pagesPerSection;
      titleInputs.forEach((input, index) => {
          const actualPageIndex = startPageIndex + index;
          if (this.state.savedTitles[actualPageIndex] !== undefined) {
              input.value = this.state.savedTitles[actualPageIndex];
              this.autoResizeTextarea(input);
          }
          input.disabled = false;
      });
  }, 100);
};


PhotoEditor.prototype.saveAllTitles = function() {
  const titleInputs = document.querySelectorAll('.page-title-input');
  if (!this.state.savedTitles) {
      this.state.savedTitles = {};
  }
  const startPageIndex = (this.state.currentSection - 1) * this.state.pagesPerSection;
  titleInputs.forEach((input, index) => {
      const actualPageIndex = startPageIndex + index;
      if (input.value.trim()) {
          this.state.savedTitles[actualPageIndex] = input.value.trim();
      } else {
          delete this.state.savedTitles[actualPageIndex];
      }
  });
};

PhotoEditor.prototype.clearPage = function(pageIndex) {
    const distribution = this.recalculatePageDistribution();
    if (pageIndex >= distribution.length) return;

    const pageToClear = distribution[pageIndex];
    const startIndex = pageToClear.startIndex;
    const numPhotosOnPage = pageToClear.photos.length;

    for (let i = 0; i < numPhotosOnPage; i++) {
        const photo = this.state.photos[startIndex + i];
        if (photo) {
            photo.src = this.createEmptyImageDataURL();
            photo.name = `Empty Slot ${i + 1}`;
            photo.fileName = `Empty Slot ${i + 1}`;
            photo.isEmpty = true;
            photo.annotations = [];
            if (this.state.photoTexts?.[photo.id]) {
                delete this.state.photoTexts[photo.id];
            }
            if (this.state.rotations?.[photo.id]) {
                delete this.state.rotations[photo.id];
            }
        }
    }
    
    if (this.state.savedTitles?.[pageIndex]) {
        delete this.state.savedTitles[pageIndex];
    }
    if (this.state.pageLayouts?.[pageIndex]) {
        delete this.state.pageLayouts[pageIndex];
    }

    this.arrangePhotos();
    this.updatePageCounter();
};

PhotoEditor.prototype.duplicatePage = function(pageIndex) {
    const distribution = this.recalculatePageDistribution();
    if (pageIndex >= distribution.length) return;

    const pageToDup = distribution[pageIndex];
    const photosToDup = pageToDup.photos;
    const layoutToDup = pageToDup.layout;

    const duplicatedPhotos = photosToDup.map(photo => {
        const newId = 'duplicate_' + Date.now() + '_' + Math.random();
        const duplicated = { ...photo, id: newId };
        if (this.state.photoTexts?.[photo.id]) {
            this.state.photoTexts[newId] = this.state.photoTexts[photo.id];
        }
        if (this.state.rotations?.[photo.id]) {
            this.state.rotations[newId] = this.state.rotations[photo.id];
        }
        return duplicated;
    });

    const insertionIndex = pageToDup.startIndex + pageToDup.photos.length;
    this.state.photos.splice(insertionIndex, 0, ...duplicatedPhotos);

    const newPageLayouts = {};
    const newSavedTitles = {};

    Object.keys(this.state.pageLayouts).forEach(key => {
        const oldPageIndex = parseInt(key, 10);
        if (oldPageIndex <= pageIndex) {
            newPageLayouts[oldPageIndex] = this.state.pageLayouts[key];
        } else {
            newPageLayouts[oldPageIndex + 1] = this.state.pageLayouts[key];
        }
    });
    newPageLayouts[pageIndex + 1] = layoutToDup;
    this.state.pageLayouts = newPageLayouts;

    Object.keys(this.state.savedTitles).forEach(key => {
        const oldPageIndex = parseInt(key, 10);
        if (oldPageIndex <= pageIndex) {
            newSavedTitles[oldPageIndex] = this.state.savedTitles[key];
        } else {
            newSavedTitles[oldPageIndex + 1] = this.state.savedTitles[key];
        }
    });

    if (this.state.savedTitles?.[pageIndex]) {
        newSavedTitles[pageIndex + 1] = this.state.savedTitles[pageIndex];
    }
    this.state.savedTitles = newSavedTitles;

    this.arrangePhotos();
    this.updatePageCounter();
};


window.ensureTextAreasEnabled = function() {
  const textAreas = document.querySelectorAll('.layout-text-area, .page-title-input');
  textAreas.forEach(textarea => {
      textarea.disabled = false;
      textarea.style.backgroundColor = 'white';
      textarea.style.cursor = 'text';
      textarea.style.pointerEvents = 'auto';
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setInterval(window.ensureTextAreasEnabled, 500);
});

document.addEventListener('click', window.ensureTextAreasEnabled);
document.addEventListener('input', window.ensureTextAreasEnabled);

PhotoEditor.prototype.addTextAreaEventListeners = function() {
  const observer = new MutationObserver(() => {
      window.ensureTextAreasEnabled();
  });
  observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'style']
  });
};

PhotoEditor.prototype.initialize = function() {
  this.initializePhotoEditor();
  this.addTextAreaEventListeners();
  setTimeout(() => {
      window.ensureTextAreasEnabled();
  }, 500);
};


PhotoEditor.prototype.saveProject = function() {
    this.saveAllTitles(); 

    const projectData = {
        version: '1.1.0', 
        photos: this.state.photos.map(p => ({
            id: p.id,
            src: p.src, 
            name: p.name,
            fileName: p.fileName,
            isEmpty: p.isEmpty,
            annotations: p.annotations || []
        })),
        photoTexts: this.state.photoTexts || {},
        savedTitles: this.state.savedTitles || {},
        rotations: this.state.rotations || {},
        pageLayouts: this.state.pageLayouts || {},
        layout: this.dom.photosPerPageSelect.value,
        globalTitle: this.dom.globalTitleInput.value,
        customStartPageNumber: this.state.customStartPageNumber || 1
    };

    const jsonString = JSON.stringify(projectData, null, 2); 
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'photo-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

PhotoEditor.prototype.loadProject = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const projectData = JSON.parse(e.target.result);

            if (!projectData.version || !projectData.photos) {
                this.showCustomDialog(getTranslation('invalidProjectFile'), null, '', () => {});
                return;
            }

            this.clearAllPhotos(true); 

            this.state.photos = projectData.photos;
            this.state.photoTexts = projectData.photoTexts || {};
            this.state.savedTitles = projectData.savedTitles || {};
            this.state.rotations = projectData.rotations || {};
            this.state.pageLayouts = projectData.pageLayouts || {};
            this.state.customStartPageNumber = projectData.customStartPageNumber || 1;
            
            this.dom.photosPerPageSelect.value = projectData.layout || '4';
            this.dom.globalTitleInput.value = projectData.globalTitle || '';

            this.state.currentSection = 1;
            this.arrangePhotos().then(() => {
                this.restoreTitles(); 
                this.updatePageCounter();
                console.log('Project loaded successfully.');
            });

        } catch (error) {
            console.error('Error loading project file:', error);
            this.showCustomDialog(getTranslation('failedToLoadProject'), null, '', () => {});
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
};

PhotoEditor.prototype.promptForPhotoInsertion = function(index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            this.insertPhotosAt(index, Array.from(files));
        }
        document.body.removeChild(input);
    });

    document.body.appendChild(input);
    input.click();
};

PhotoEditor.prototype.insertPhotosAt = function(index, files) {
    const newPhotos = [];
    let filesLoaded = 0;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const photo = {
                id: 'photo_' + Date.now() + '_' + Math.random(),
                src: event.target.result,
                name: file.name,
                fileName: file.name,
                isEmpty: false,
                annotations: []
            };
            newPhotos.push(photo);
            filesLoaded++;

            if (filesLoaded === files.length) {
                newPhotos.sort((a, b) => a.name.localeCompare(b.name));
                this.state.photos.splice(index, 0, ...newPhotos);
                this.arrangePhotos();
                this.updatePageCounter();
            }
        };
        reader.readAsDataURL(file);
    });
};
