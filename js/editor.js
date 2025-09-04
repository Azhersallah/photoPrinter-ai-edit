// Helper function for text wrapping on canvas
function getWrappedLines(context, text, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';

    // Temporarily save original direction if you're going to change it for measurement
    const originalDirection = context.direction;
    // Set direction for correct measurement if it's an RTL context
    // This assumes context.direction is already set to 'rtl' before calling getWrappedLines for RTL text.

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    
    // Restore original direction if it was changed
    // context.direction = originalDirection; // Re-enable if you explicitly change it inside this function

    return lines;
}

// editor.js
PhotoEditor.prototype.openEditor = function (photo) {
    this.state.currentEditingPhoto = photo;
    this.state.annotations = []; // Initialize as an empty array for the current session

    this.dom.editorPreview.innerHTML = '';

    const img = document.createElement('img');
    img.src = photo.src;
    img.style.maxWidth = '100%';
    img.maxHeight = '100%';
    img.style.objectFit = 'contain';
    img.style.position = 'absolute'; // Ensure image itself is positioned within preview for correct relative calculations
    img.style.left = '50%'; // Center image horizontally
    img.style.top = '50%';  // Center image vertically
    img.style.transform = 'translate(-50%, -50%)'; // Use transform for centering to avoid layout shifts

    // Append the image to the preview first so its dimensions can be calculated
    this.dom.editorPreview.appendChild(img);

    img.onload = () => {
        photo.originalWidth = img.naturalWidth;
        photo.originalHeight = img.naturalHeight;

        const imgRect = img.getBoundingClientRect();
        const previewRect = this.dom.editorPreview.getBoundingClientRect();

        // Calculate the bounding box of the displayed image relative to the editorPreview container
        // These bounds define the usable area for annotations
        this.state.activeImageBounds = {
            left: imgRect.left - previewRect.left,
            top: imgRect.top - previewRect.top,
            width: imgRect.width,
            height: imgRect.height
        };

        photo.displayWidth = imgRect.width;
        photo.displayHeight = imgRect.height;

        // If there are existing annotations, re-create them and add them to the active state
        if (photo.annotations && photo.annotations.length > 0) {
            photo.annotations.forEach(anno => {
                // Annotations stored in photo.annotations are relative to original image size.
                // Convert them to current displayed image size for rendering in the editor.
                const scaleX = imgRect.width / photo.originalWidth;
                const scaleY = imgRect.height / photo.originalHeight;

                // These are the coordinates and dimensions relative to the *displayed image's* top-left corner
                const displayX = anno.x * scaleX;
                const displayY = anno.y * scaleY;
                const displayWidth = anno.width * scaleX;
                const displayHeight = anno.height * scaleY;

                let recreatedAnnotation;
                if (anno.type === 'text') {
                    recreatedAnnotation = this.createTextAnnotation(
                        anno.text || getTranslation('enterYourTextHere'), // Use translation
                        displayX, // Pass display-relative x
                        displayY, // Pass display-relative y
                        anno.color,
                        anno.size * scaleY, // Scale font size for display
                        anno.font,
                        false, // Not a new annotation being created by user interaction
                        displayWidth, // Pass display width
                        displayHeight // Pass display height
                    );
                } else if (anno.type === 'shape') {
                    recreatedAnnotation = this.createShapeAnnotation(
                        anno.shape,
                        displayX, // Pass display-relative x
                        displayY, // Pass display-relative y
                        displayWidth, // Pass display width
                        displayHeight, // Pass display height
                        anno.color,
                        anno.widthValue * Math.min(scaleX, scaleY), // Scale border width
                        anno.fill,
                        false // Not a new annotation being created by user interaction
                    );
                }
                // Add the recreated annotation to the active state for the current editing session
                if (recreatedAnnotation) {
                    this.state.annotations.push(recreatedAnnotation);
                }
            });
        }
    };

    this.dom.editorOverlay.style.display = 'flex';
};

PhotoEditor.prototype.closeEditor = function () {
    this.dom.editorOverlay.style.display = 'none';
    this.state.currentEditingPhoto = null;
    this.state.annotations = [];
    this.state.activeAnnotation = null;
    this.state.activeImageBounds = null; // Clear image bounds when closing editor
    this.cancelCropping();
};

PhotoEditor.prototype.saveEdits = function () {
    if (this.state.currentEditingPhoto) {
        const previewImg = this.dom.editorPreview.querySelector('img');
        if (!previewImg) return;

        const imgRect = previewImg.getBoundingClientRect(); // Bounding box of the currently displayed image

        // Calculate scale factors to convert from displayed image dimensions to original image dimensions
        const scaleX = this.state.currentEditingPhoto.originalWidth / imgRect.width;
        const scaleY = this.state.currentEditingPhoto.originalHeight / imgRect.height;

        this.state.currentEditingPhoto.annotations = this.state.annotations.map(anno => {
            // Annotations in this.state.annotations have 'x', 'y', 'width', 'height' relative to
            // the *displayed image's* top-left.
            // We need to scale them back to the *original image's* coordinate system for saving.
            let x = Math.round(anno.x * scaleX);
            let y = Math.round(anno.y * scaleY);
            let width = Math.round(anno.width * scaleX);
            let height = Math.round(anno.height * scaleY);

            // 1. Ensure dimensions are non-negative and have a minimum size
            width = Math.max(1, width); // Minimum 1 pixel
            height = Math.max(1, height); // Minimum 1 pixel

            // 2. Clamp dimensions to not exceed original image bounds (if they start outside or are too large)
            width = Math.min(width, this.state.currentEditingPhoto.originalWidth);
            height = Math.min(height, this.state.currentEditingPhoto.originalHeight);

            // 3. Clamp position (x, y) to ensure top-left is within original image bounds
            x = Math.max(0, x);
            y = Math.max(0, y);

            // 4. Adjust position again if the annotation extends beyond the right/bottom edge
            // This ensures the *entire* annotation fits within the original image
            x = Math.min(x, this.state.currentEditingPhoto.originalWidth - width);
            y = Math.min(y, this.state.currentEditingPhoto.originalHeight - height);

            const savedAnnotation = {
                type: anno.type,
                x: x,
                y: y,
                width: width,
                height: height,
                color: anno.color,
                // Adjust widthValue for shapes based on the smaller scale factor to maintain proportion
                widthValue: anno.widthValue * Math.min(scaleX, scaleY),
                fill: anno.fill
            };

            if (anno.type === 'text') {
                // Text annotations save the actual text content from the element
                savedAnnotation.text = anno.element.textContent;
                // Scale font size back to original image scale and round
                savedAnnotation.size = Math.round(anno.size * scaleY); 
                savedAnnotation.font = anno.font;
            } else if (anno.type === 'shape') {
                savedAnnotation.shape = anno.shape;
            }

            return savedAnnotation;
        });

        this.updateEditedPhoto(this.state.currentEditingPhoto);
    }
    this.closeEditor();
};

PhotoEditor.prototype.updateEditedPhoto = function (photo) {
    const containers = document.querySelectorAll(`.photo-container[data-photo-id="${photo.id}"]`);

    containers.forEach(container => {
        const canvas = document.createElement('canvas');
        canvas.width = photo.originalWidth;
        canvas.height = photo.originalHeight;
        const ctx = canvas.getContext('2d');

        const tempImg = new Image();
        tempImg.onload = () => {
            ctx.drawImage(tempImg, 0, 0, photo.originalWidth, photo.originalHeight);

            if (photo.annotations && photo.annotations.length > 0) {
                photo.annotations.forEach(anno => {
                    // These annotations are already in original image coordinates
                    const drawX = Math.round(anno.x); // Ensure integer
                    const drawY = Math.round(anno.y); // Ensure integer
                    const drawWidth = Math.round(anno.width); // Ensure integer
                    const drawHeight = Math.round(anno.height); // Ensure integer

                    if (anno.type === 'text') {
                        ctx.font = `${anno.size}px ${anno.font}`;
                        ctx.fillStyle = anno.color;

                        // IMPORTANT: Set text direction for canvas rendering
                        ctx.direction = 'rtl'; 
                        ctx.textAlign = 'right'; 
                        
                        const textDrawX = drawX + drawWidth; // Right edge of the text box for right alignment

                        // Wrap text based on calculated annotation width
                        const lines = getWrappedLines(ctx, anno.text, drawWidth);
                        const lineHeight = anno.size * 1.2; // 1.2 times font size for line height

                        lines.forEach((line, i) => {
                            ctx.fillText(
                                line,
                                Math.round(textDrawX), // X-coordinate for right alignment, rounded
                                Math.round(drawY + anno.size + (i * lineHeight)) // Y-coordinate with line spacing, rounded
                            );
                        });
                        // Reset direction after drawing text to avoid affecting other elements if any
                        ctx.direction = 'inherit'; 
                        ctx.textAlign = 'left'; // Reset to default for other elements
                    } else if (anno.type === 'shape') {
                        ctx.strokeStyle = anno.color;
                        ctx.lineWidth = anno.widthValue;

                        // Smaller margin for shapes
                        const margin = 1; // Changed from 2 to 1

                        const boundedDrawX = drawX + margin;
                        const boundedDrawY = drawY + margin;
                        const boundedDrawWidth = drawWidth - (2 * margin);
                        const boundedDrawHeight = drawHeight - (2 * margin);

                        if (anno.fill !== 'transparent') {
                            ctx.fillStyle = anno.fill;
                            ctx.fillRect(boundedDrawX, boundedDrawY, boundedDrawWidth, boundedDrawHeight); // Draw filled rectangle for shapes
                        }

                        if (anno.shape === 'rectangle') {
                            ctx.beginPath();
                            ctx.rect(
                                boundedDrawX,
                                boundedDrawY,
                                boundedDrawWidth,
                                boundedDrawHeight
                            );
                            ctx.stroke();

                        } else if (anno.shape === 'circle') {
                            const centerX = boundedDrawX + (boundedDrawWidth / 2);
                            const centerY = boundedDrawY + (boundedDrawHeight / 2);
                            const radiusX = boundedDrawWidth / 2;
                            const radiusY = boundedDrawHeight / 2;

                            ctx.beginPath();
                            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                            ctx.stroke();
                        }
                    }
                });
            }

            const existingCanvas = container.querySelector('canvas');
            if (existingCanvas) {
                container.replaceChild(canvas, existingCanvas);
            } else {
                container.appendChild(canvas);
            }

            if (this.state.rotations[photo.id]) {
                canvas.style.transform = `rotate(${this.state.rotations[photo.id]}deg)`;
            }

            // Adjust canvas display size to fit container while maintaining aspect ratio
            const containerWidth = container.offsetWidth; // Use actual container width
            const containerHeight = container.offsetHeight; // Use actual container height
            const aspectRatio = photo.originalWidth / photo.originalHeight;

            if (aspectRatio > 1) { // Landscape
                canvas.style.width = `${containerWidth}px`;
                canvas.style.height = `${containerWidth / aspectRatio}px`;
            } else { // Portrait or Square
                canvas.style.height = `${containerHeight}px`;
                canvas.style.width = `${containerHeight * aspectRatio}px`;
            }
        };
        tempImg.src = photo.src;
    });
};
