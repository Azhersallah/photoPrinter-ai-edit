// crop.js
PhotoEditor.prototype.startCropping = function() {
    this.cancelCropping();
    this.state.isCropping = true;
    this.state.isDrawingCrop = false;
    this.state.isResizingCrop = false;
    this.state.resizeHandle = null;
    this.dom.cropControls.style.display = 'block';
    
    this.createCropUI();
    
    this.addCropEventListeners();
};

PhotoEditor.prototype.createCropUI = function() {
    const preview = this.dom.editorPreview;
    
    const cropOverlay = document.createElement('div');
    cropOverlay.className = 'crop-overlay';
    cropOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        pointer-events: none;
        z-index: 10;
    `;
    preview.appendChild(cropOverlay);
    
    const cropSelection = document.createElement('div');
    cropSelection.className = 'crop-selection';
    cropSelection.style.cssText = `
        position: absolute;
        border: 2px dashed #fff;
        background: transparent;
        cursor: move;
        z-index: 11;
        min-width: 20px;
        min-height: 20px;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
        display: none;
    `;
    preview.appendChild(cropSelection);
    
    this.createCropHandles(cropSelection);
    
    this.state.cropElement = cropSelection;
    this.state.cropOverlay = cropOverlay;
};

PhotoEditor.prototype.createCropHandles = function(cropSelection) {
    const handles = [
        { pos: 'nw', cursor: 'nw-resize', style: 'top: -5px; left: -5px;' },
        { pos: 'ne', cursor: 'ne-resize', style: 'top: -5px; right: -5px;' },
        { pos: 'sw', cursor: 'sw-resize', style: 'bottom: -5px; left: -5px;' },
        { pos: 'se', cursor: 'se-resize', style: 'bottom: -5px; right: -5px;' },
        { pos: 'n', cursor: 'n-resize', style: 'top: -5px; left: 50%; transform: translateX(-50%);' },
        { pos: 's', cursor: 's-resize', style: 'bottom: -5px; left: 50%; transform: translateX(-50%);' },
        { pos: 'e', cursor: 'e-resize', style: 'top: 50%; right: -5px; transform: translateY(-50%);' },
        { pos: 'w', cursor: 'w-resize', style: 'top: 50%; left: -5px; transform: translateY(-50%);' }
    ];
    
    handles.forEach(({ pos, cursor, style }) => {
        const handle = document.createElement('div');
        handle.className = `crop-handle crop-handle-${pos}`;
        handle.dataset.position = pos;
        handle.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 50%;
            z-index: 12;
            cursor: ${cursor};
            ${style}
        `;
        
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.startResizingCrop(e, pos);
        });
        
        cropSelection.appendChild(handle);
    });
};

PhotoEditor.prototype.addCropEventListeners = function() {
    const preview = this.dom.editorPreview;
    
    this.cropMouseDownHandler = this.handleCropStart.bind(this);
    preview.addEventListener('mousedown', this.cropMouseDownHandler);
    
    this.cropKeyHandler = (e) => {
        if (e.key === 'Escape' && this.state.isCropping) {
            this.cancelCropping();
        }
    };
    document.addEventListener('keydown', this.cropKeyHandler);
};

PhotoEditor.prototype.removeCropEventListeners = function() {
    const preview = this.dom.editorPreview;
    
    if (this.cropMouseDownHandler) {
        preview.removeEventListener('mousedown', this.cropMouseDownHandler);
        delete this.cropMouseDownHandler;
    }
    
    if (this.cropKeyHandler) {
        document.removeEventListener('keydown', this.cropKeyHandler);
        delete this.cropKeyHandler;
    }
    
    if (this.cropMoveHandler) {
        document.removeEventListener('mousemove', this.cropMoveHandler);
        delete this.cropMoveHandler;
    }
    
    if (this.cropEndHandler) {
        document.removeEventListener('mouseup', this.cropEndHandler);
        delete this.cropEndHandler;
    }
};

PhotoEditor.prototype.handleCropStart = function(e) {
    if (!this.state.isCropping) return;
    
    if (e.target.closest('.crop-selection')) {
        this.startMovingCrop(e);
        return;
    }
    
    if (e.target.classList.contains('crop-handle')) {
        return; 
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const preview = this.dom.editorPreview;
    const rect = preview.getBoundingClientRect();
    const img = preview.querySelector('img');
    
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    
    if (e.clientX < imgRect.left || e.clientX > imgRect.right || 
        e.clientY < imgRect.top || e.clientY > imgRect.bottom) {
        return;
    }
    
    this.state.isDrawingCrop = true;
    
    this.state.cropStartX = e.clientX - rect.left;
    this.state.cropStartY = e.clientY - rect.top;
    this.state.cropEndX = this.state.cropStartX;
    this.state.cropEndY = this.state.cropStartY;
    
    this.updateCropSelection();
    this.state.cropElement.style.display = 'block';
    
    this.cropMoveHandler = this.handleCropMove.bind(this);
    this.cropEndHandler = this.handleCropEnd.bind(this);
    
    document.addEventListener('mousemove', this.cropMoveHandler);
    document.addEventListener('mouseup', this.cropEndHandler);
};

PhotoEditor.prototype.startMovingCrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.state.isMovingCrop = true;
    
    const rect = this.dom.editorPreview.getBoundingClientRect();
    const cropRect = this.state.cropElement.getBoundingClientRect();
    
    this.state.moveStartX = e.clientX - cropRect.left;
    this.state.moveStartY = e.clientY - cropRect.top;
    
    this.cropMoveHandler = this.handleCropMove.bind(this);
    this.cropEndHandler = this.handleCropEnd.bind(this);
    
    document.addEventListener('mousemove', this.cropMoveHandler);
    document.addEventListener('mouseup', this.cropEndHandler);
};

PhotoEditor.prototype.startResizingCrop = function(e, position) {
    e.preventDefault();
    e.stopPropagation();
    
    this.state.isResizingCrop = true;
    this.state.resizeHandle = position;
    
    const cropRect = this.state.cropElement.getBoundingClientRect();
    const previewRect = this.dom.editorPreview.getBoundingClientRect();
    
    this.state.initialCropLeft = cropRect.left - previewRect.left;
    this.state.initialCropTop = cropRect.top - previewRect.top;
    this.state.initialCropWidth = cropRect.width;
    this.state.initialCropHeight = cropRect.height;
    this.state.initialMouseX = e.clientX;
    this.state.initialMouseY = e.clientY;
    
    this.cropMoveHandler = this.handleCropMove.bind(this);
    this.cropEndHandler = this.handleCropEnd.bind(this);
    
    document.addEventListener('mousemove', this.cropMoveHandler);
    document.addEventListener('mouseup', this.cropEndHandler);
};

PhotoEditor.prototype.handleCropMove = function(e) {
    if (!this.state.isCropping) return;
    
    e.preventDefault();
    
    if (this.state.isDrawingCrop) {
        this.handleDrawingMove(e);
    } else if (this.state.isMovingCrop) {
        this.handleMovingMove(e);
    } else if (this.state.isResizingCrop) {
        this.handleResizingMove(e);
    }
};

PhotoEditor.prototype.handleDrawingMove = function(e) {
    const preview = this.dom.editorPreview;
    const rect = preview.getBoundingClientRect();
    const img = preview.querySelector('img');
    
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    
    const relativeX = Math.max(imgRect.left - rect.left, 
                     Math.min(imgRect.right - rect.left, e.clientX - rect.left));
    const relativeY = Math.max(imgRect.top - rect.top, 
                     Math.min(imgRect.bottom - rect.top, e.clientY - rect.top));
    
    this.state.cropEndX = relativeX;
    this.state.cropEndY = relativeY;
    
    this.updateCropSelection();
};

PhotoEditor.prototype.handleMovingMove = function(e) {
    const preview = this.dom.editorPreview;
    const previewRect = preview.getBoundingClientRect();
    const img = preview.querySelector('img');
    
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const cropWidth = this.state.cropElement.offsetWidth;
    const cropHeight = this.state.cropElement.offsetHeight;
    
    let newLeft = e.clientX - previewRect.left - this.state.moveStartX;
    let newTop = e.clientY - previewRect.top - this.state.moveStartY;
    
    const imgLeft = imgRect.left - previewRect.left;
    const imgTop = imgRect.top - previewRect.top;
    const imgRight = imgRect.right - previewRect.left;
    const imgBottom = imgRect.bottom - previewRect.top;
    
    newLeft = Math.max(imgLeft, Math.min(imgRight - cropWidth, newLeft));
    newTop = Math.max(imgTop, Math.min(imgBottom - cropHeight, newTop));
    
    this.state.cropElement.style.left = `${newLeft}px`;
    this.state.cropElement.style.top = `${newTop}px`;
    
    this.state.cropStartX = newLeft;
    this.state.cropStartY = newTop;
    this.state.cropEndX = newLeft + cropWidth;
    this.state.cropEndY = newTop + cropHeight;

    this.updateCropOverlay(newLeft, newTop, cropWidth, cropHeight);
};

PhotoEditor.prototype.handleResizingMove = function(e) {
    const deltaX = e.clientX - this.state.initialMouseX;
    const deltaY = e.clientY - this.state.initialMouseY;
    
    let newLeft = this.state.initialCropLeft;
    let newTop = this.state.initialCropTop;
    let newWidth = this.state.initialCropWidth;
    let newHeight = this.state.initialCropHeight;
    
    const position = this.state.resizeHandle;
    const img = this.dom.editorPreview.querySelector('img');
    if (!img) return;
    
    const imgRect = img.getBoundingClientRect();
    const previewRect = this.dom.editorPreview.getBoundingClientRect();
    const imgLeft = imgRect.left - previewRect.left;
    const imgTop = imgRect.top - previewRect.top;
    const imgRight = imgRect.right - previewRect.left;
    const imgBottom = imgRect.bottom - previewRect.top;
    
    switch (position) {
        case 'nw':
            newLeft = Math.max(imgLeft, Math.min(this.state.initialCropLeft + deltaX, this.state.initialCropLeft + this.state.initialCropWidth - 20));
            newTop = Math.max(imgTop, Math.min(this.state.initialCropTop + deltaY, this.state.initialCropTop + this.state.initialCropHeight - 20));
            newWidth = this.state.initialCropWidth - (newLeft - this.state.initialCropLeft);
            newHeight = this.state.initialCropHeight - (newTop - this.state.initialCropTop);
            break;
        case 'ne':
            newTop = Math.max(imgTop, Math.min(this.state.initialCropTop + deltaY, this.state.initialCropTop + this.state.initialCropHeight - 20));
            newWidth = Math.max(20, Math.min(imgRight - this.state.initialCropLeft, this.state.initialCropWidth + deltaX));
            newHeight = this.state.initialCropHeight - (newTop - this.state.initialCropTop);
            break;
        case 'sw':
            newLeft = Math.max(imgLeft, Math.min(this.state.initialCropLeft + deltaX, this.state.initialCropLeft + this.state.initialCropWidth - 20));
            newWidth = this.state.initialCropWidth - (newLeft - this.state.initialCropLeft);
            newHeight = Math.max(20, Math.min(imgBottom - this.state.initialCropTop, this.state.initialCropHeight + deltaY));
            break;
        case 'se':
            newWidth = Math.max(20, Math.min(imgRight - this.state.initialCropLeft, this.state.initialCropWidth + deltaX));
            newHeight = Math.max(20, Math.min(imgBottom - this.state.initialCropTop, this.state.initialCropHeight + deltaY));
            break;
        case 'n':
            newTop = Math.max(imgTop, Math.min(this.state.initialCropTop + deltaY, this.state.initialCropTop + this.state.initialCropHeight - 20));
            newHeight = this.state.initialCropHeight - (newTop - this.state.initialCropTop);
            break;
        case 's':
            newHeight = Math.max(20, Math.min(imgBottom - this.state.initialCropTop, this.state.initialCropHeight + deltaY));
            break;
        case 'e':
            newWidth = Math.max(20, Math.min(imgRight - this.state.initialCropLeft, this.state.initialCropWidth + deltaX));
            break;
        case 'w':
            newLeft = Math.max(imgLeft, Math.min(this.state.initialCropLeft + deltaX, this.state.initialCropLeft + this.state.initialCropWidth - 20));
            newWidth = this.state.initialCropWidth - (newLeft - this.state.initialCropLeft);
            break;
    }
    
    this.state.cropElement.style.left = `${newLeft}px`;
    this.state.cropElement.style.top = `${newTop}px`;
    this.state.cropElement.style.width = `${newWidth}px`;
    this.state.cropElement.style.height = `${newHeight}px`;
    
    this.state.cropStartX = newLeft;
    this.state.cropStartY = newTop;
    this.state.cropEndX = newLeft + newWidth;
    this.state.cropEndY = newTop + newHeight;
    
    this.updateCropOverlay(newLeft, newTop, newWidth, newHeight);
};

PhotoEditor.prototype.updateCropCoordinates = function() {
    if (!this.state.cropElement) return;
    
    const rect = this.state.cropElement.getBoundingClientRect();
    const previewRect = this.dom.editorPreview.getBoundingClientRect();
    
    this.state.cropStartX = rect.left - previewRect.left;
    this.state.cropStartY = rect.top - previewRect.top;
    this.state.cropEndX = this.state.cropStartX + rect.width;
    this.state.cropEndY = this.state.cropStartY + rect.height;
};

PhotoEditor.prototype.handleCropEnd = function(e) {
    if (!this.state.isCropping) return;
    
    e.preventDefault();
    
    if (this.cropMoveHandler) {
        document.removeEventListener('mousemove', this.cropMoveHandler);
        delete this.cropMoveHandler;
    }
    
    if (this.cropEndHandler) {
        document.removeEventListener('mouseup', this.cropEndHandler);
        delete this.cropEndHandler;
    }
    
    this.updateCropCoordinates();
    
    this.state.isDrawingCrop = false;
    this.state.isMovingCrop = false;
    this.state.isResizingCrop = false;
    this.state.resizeHandle = null;
    
    if (this.state.cropElement.style.display !== 'none') {
        const width = this.state.cropElement.offsetWidth;
        const height = this.state.cropElement.offsetHeight;
        
        if (width < 20 || height < 20) {
            // Using showCustomDialog instead of alert
            this.showCustomDialog('The selected area is too small!', null, '', () => {});
            this.state.cropElement.style.display = 'none';
        }
    }
};

PhotoEditor.prototype.updateCropSelection = function() {
    if (!this.state.cropElement) return;
    
    const left = Math.min(this.state.cropStartX, this.state.cropEndX);
    const top = Math.min(this.state.cropStartY, this.state.cropEndY);
    const width = Math.abs(this.state.cropEndX - this.state.cropStartX);
    const height = Math.abs(this.state.cropEndY - this.state.cropStartY);
    
    this.state.cropElement.style.left = `${left}px`;
    this.state.cropElement.style.top = `${top}px`;
    this.state.cropElement.style.width = `${width}px`;
    this.state.cropElement.style.height = `${height}px`;
    
    this.updateCropOverlay(left, top, width, height);
};

PhotoEditor.prototype.updateCropOverlay = function(left, top, width, height) {
    if (!this.state.cropOverlay) return;
    
    this.state.cropOverlay.style.clipPath = `polygon(
        0% 0%, 
        0% 100%, 
        ${left}px 100%, 
        ${left}px ${top}px, 
        ${left + width}px ${top}px, 
        ${left + width}px ${top + height}px, 
        ${left}px ${top + height}px, 
        ${left}px 100%, 
        100% 100%, 
        100% 0%
    )`;
};

PhotoEditor.prototype.applyCrop = function() {
    if (!this.state.isCropping || !this.state.cropElement || !this.state.currentEditingPhoto) {
        this.showCustomDialog('هیچ ناوچەیەک بۆ کرۆپ کردن هەڵنەبژێردراوە!', null, '', () => {});
        return;
    }
    
    if (this.state.cropElement.style.display === 'none') {
        this.showCustomDialog('تکایە ناوچەیەک بۆ کرۆپ کردن هەڵبژێرە!', null, '', () => {});
        return;
    }
    
    const width = this.state.cropElement.offsetWidth;
    const height = this.state.cropElement.offsetHeight;
    
    if (width < 20 || height < 20) {
        this.showCustomDialog('ناوچەی هەڵبژێردراو زۆر بچووکە!', null, '', () => {});
        return;
    }
    
    const previewImg = this.dom.editorPreview.querySelector('img');
    if (!previewImg) return;
    
    const originalText = this.dom.applyCropBtn.innerHTML;
    this.dom.applyCropBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> کرۆپ دەکرێت...';
    this.dom.applyCropBtn.disabled = true;
    
    setTimeout(() => {
        try {
            this.processCropImage(previewImg);
        } catch (error) {
            console.error('هەڵەیەک لە کرۆپ کردندا:', error);
            this.showCustomDialog('هەڵەیەک لە کرۆپ کردندا ڕوویدا!', null, '', () => {});
        } finally {
            this.dom.applyCropBtn.innerHTML = originalText;
            this.dom.applyCropBtn.disabled = false;
        }
    }, 100);
};

PhotoEditor.prototype.processCropImage = function(previewImg) {
    const imgRect = previewImg.getBoundingClientRect();
    const previewRect = this.dom.editorPreview.getBoundingClientRect();
    const cropRect = this.state.cropElement.getBoundingClientRect();
    
    // Calculate scale factors from original image dimensions to current displayed image dimensions
    const scaleXOriginalToDisplay = imgRect.width / this.state.currentEditingPhoto.originalWidth;
    const scaleYOriginalToDisplay = imgRect.height / this.state.currentEditingPhoto.originalHeight;

    // Calculate crop area in original image coordinates
    // cropLeft/Top are relative to editorPreview's top-left.
    // We need to subtract the image's top-left relative to editorPreview to get crop relative to image.
    const cropLeftRelativeToImageDisplay = cropRect.left - imgRect.left;
    const cropTopRelativeToImageDisplay = cropRect.top - imgRect.top;
    
    const xOriginal = cropLeftRelativeToImageDisplay / scaleXOriginalToDisplay;
    const yOriginal = cropTopRelativeToImageDisplay / scaleYOriginalToDisplay;
    const widthOriginal = cropRect.width / scaleXOriginalToDisplay;
    const heightOriginal = cropRect.height / scaleYOriginalToDisplay;
    
    const finalX = Math.max(0, Math.min(xOriginal, this.state.currentEditingPhoto.originalWidth));
    const finalY = Math.max(0, Math.min(yOriginal, this.state.currentEditingPhoto.originalHeight));
    const finalWidth = Math.min(widthOriginal, this.state.currentEditingPhoto.originalWidth - finalX);
    const finalHeight = Math.min(heightOriginal, this.state.currentEditingPhoto.originalHeight - finalY);
    
    const canvas = document.createElement('canvas');
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    const tempImg = new Image();
    tempImg.onload = () => {
        ctx.drawImage(
            tempImg,
            finalX, finalY, finalWidth, finalHeight, // Source rectangle
            0, 0, finalWidth, finalHeight            // Destination rectangle
        );
        
        // Update the photo object with the new cropped image data and dimensions
        this.state.currentEditingPhoto.src = canvas.toDataURL('image/jpeg', 0.9);
        this.state.currentEditingPhoto.originalWidth = finalWidth;
        this.state.currentEditingPhoto.originalHeight = finalHeight;
        
        // Update the displayed image in the editor preview
        previewImg.src = this.state.currentEditingPhoto.src;
        previewImg.onload = () => {
            // After the new cropped image is loaded and displayed,
            // update annotations and the activeImageBounds
            this.cleanupAnnotationsAfterCrop(finalX, finalY, finalWidth, finalHeight, scaleXOriginalToDisplay, scaleYOriginalToDisplay);
            
            this.cancelCropping();
            
            this.showSuccessMessage('وێنەکە بە سەرکەوتوویی کرۆپ کرا!');
        };
    };
    
    tempImg.src = this.state.currentEditingPhoto.src;
};

PhotoEditor.prototype.cleanupAnnotationsAfterCrop = function(cropX, cropY, cropWidth, cropHeight, scaleXOriginalToDisplay, scaleYOriginalToDisplay) {
    this.state.annotations = this.state.annotations.filter(annotation => {
        const annotationElement = annotation.element;
        const previewRect = this.dom.editorPreview.getBoundingClientRect();
        
        // Calculate the annotation's current position and size relative to the *displayed image*
        // This is necessary because annotation.x/y/width/height are relative to the image's display bounds.
        const annotationDisplayX = annotation.x;
        const annotationDisplayY = annotation.y;
        const annotationDisplayWidth = annotation.width;
        const annotationDisplayHeight = annotation.height;

        // Convert annotation display coordinates to *original image coordinates* for comparison with crop area
        const annotationOriginalX = annotationDisplayX / scaleXOriginalToDisplay;
        const annotationOriginalY = annotationDisplayY / scaleYOriginalToDisplay;
        const annotationOriginalWidth = annotationDisplayWidth / scaleXOriginalToDisplay;
        const annotationOriginalHeight = annotationDisplayHeight / scaleYOriginalToDisplay;
        
        // Check if the annotation, in original image coordinates, is within the cropped area
        // Using intersection logic: if no overlap, it's outside.
        const isInCropArea = (
            annotationOriginalX < cropX + cropWidth &&
            annotationOriginalX + annotationOriginalWidth > cropX &&
            annotationOriginalY < cropY + cropHeight &&
            annotationOriginalY + annotationOriginalHeight > cropY
        );
        
        if (!isInCropArea) {
            annotationElement.remove();
            return false;
        }
        
        // If annotation is in the crop area, update its position and size relative to the new cropped image's display
        const previewImg = this.dom.editorPreview.querySelector('img');
        const newImgRect = previewImg.getBoundingClientRect();
        const newPreviewScaleX = newImgRect.width / cropWidth; // Scale from cropped original width to new display width
        const newPreviewScaleY = newImgRect.height / cropHeight; // Scale from cropped original height to new display height

        // Calculate new annotation position relative to the new *displayed image*'s top-left
        // (annotationOriginalX - cropX) gives its position relative to the cropped section's original top-left
        const newAnnoX = (annotationOriginalX - cropX) * newPreviewScaleX;
        const newAnnoY = (annotationOriginalY - cropY) * newPreviewScaleY;
        const newAnnoWidth = annotationOriginalWidth * newPreviewScaleX;
        const newAnnoHeight = annotationOriginalHeight * newPreviewScaleY;

        // Apply new position and size to the DOM element
        annotationElement.style.left = `${newAnnoX + (newImgRect.left - previewRect.left)}px`;
        annotationElement.style.top = `${newAnnoY + (newImgRect.top - previewRect.top)}px`;
        annotationElement.style.width = `${newAnnoWidth}px`;
        annotationElement.style.height = `${newAnnoHeight}px`;

        // Update the annotation object's stored relative coordinates and dimensions
        // These are now relative to the *newly displayed (cropped) image's* top-left.
        annotation.x = newAnnoX;
        annotation.y = newAnnoY;
        annotation.width = newAnnoWidth;
        annotation.height = newAnnoHeight;
        
        // For text annotations, re-adjust font size and textarea height
        if (annotation.type === 'text') {
            // Re-scale font size based on the change in image height ratio
            // Old displayed image height for the photo was based on original photo height
            // New displayed image height is newImgRect.height
            // So, scale font size based on the ratio of new displayed height to old displayed height
            const oldDisplayHeight = this.state.currentEditingPhoto.displayHeight; // This should be updated in openEditor for consistency
            if (oldDisplayHeight) { // Ensure oldDisplayHeight is available
                annotation.size = annotation.size * (newImgRect.height / oldDisplayHeight);
                annotation.element.style.fontSize = `${annotation.size}px`;
                this.resizeTextarea(annotation.element); // Adjust height to fit new font size and content
            }
        } else if (annotation.type === 'shape') {
            // Re-scale border width based on the smaller of the two new scales
            annotation.widthValue = annotation.widthValue * Math.min(newPreviewScaleX, newPreviewScaleY);
            annotation.element.style.borderWidth = `${annotation.widthValue}px`;
        }

        return true;
    });

    // AFTER all annotations are processed and the new cropped image is loaded in the preview,
    // update the activeImageBounds to reflect the new cropped image's display dimensions.
    const previewImg = this.dom.editorPreview.querySelector('img');
    if (previewImg) {
        const imgRect = previewImg.getBoundingClientRect();
        const previewRect = this.dom.editorPreview.getBoundingClientRect();
        this.state.activeImageBounds = {
            left: imgRect.left - previewRect.left,
            top: imgRect.top - previewRect.top,
            width: imgRect.width,
            height: imgRect.height
        };
    }
};

PhotoEditor.prototype.cancelCropping = function() {
    if (!this.state.isCropping) return;
    
    this.state.isCropping = false;
    this.state.isDrawingCrop = false;
    this.state.isMovingCrop = false;
    this.state.isResizingCrop = false;
    this.state.resizeHandle = null;
    this.dom.cropControls.style.display = 'none';
    
    this.removeCropEventListeners();
    
    const cropOverlay = this.dom.editorPreview.querySelector('.crop-overlay');
    const cropSelection = this.dom.editorPreview.querySelector('.crop-selection');
    
    if (cropOverlay) cropOverlay.remove();
    if (cropSelection) cropSelection.remove();
    
    this.state.cropElement = null;
    this.state.cropOverlay = null;
    this.state.cropStartX = 0;
    this.state.cropStartY = 0;
    this.state.cropEndX = 0;
    this.state.cropEndY = 0;
};
