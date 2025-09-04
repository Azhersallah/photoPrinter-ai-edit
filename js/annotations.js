PhotoEditor.prototype.addTextAnnotation = function() {
    const imageBounds = this.state.activeImageBounds;
    // Calculate initial center of the image area for placement
    const initialX = imageBounds.width / 2;
    const initialY = imageBounds.height / 2;

    this.createTextAnnotation(
        this.dom.textContent.value || getTranslation('doubleClickToEdit'),
        initialX,
        initialY,
        this.dom.textColor.value,
        this.dom.textSize.value,
        this.dom.textFont.value,
        true
    );
};

PhotoEditor.prototype.createTextAnnotation = function(text, x, y, color, size, font, isNew, initialWidth, initialHeight) {
    // Changed from 'textarea' to 'pre'
    const pre = document.createElement('pre');
    pre.className = 'annotation text-annotation';
    pre.textContent = text; // Use textContent for pre tag
    pre.style.position = 'absolute';

    pre.style.color = color;
    pre.style.fontSize = `${size}px`;
    pre.style.fontFamily = font;
    pre.dir = 'rtl'; // Assuming RTL for text

    // Make the pre tag editable
    pre.contentEditable = true;
    pre.spellcheck = false; // Disable spellcheck to avoid visual clutter

    pre.style.display = 'inline-block';
    // Round initial dimensions for better consistency
    pre.style.width = initialWidth ? `${Math.round(initialWidth)}px` : 'auto'; 
    pre.style.height = initialHeight ? `${Math.round(initialHeight)}px` : 'auto'; 

    this.dom.editorPreview.appendChild(pre);

    const imageBounds = this.state.activeImageBounds;
    // Position the pre element relative to the image bounds within the editor preview
    // Note: For new annotations, positioning is adjusted after initial measurement (see below in isNew block)
    pre.style.left = `${Math.round(x + imageBounds.left)}px`;
    pre.style.top = `${Math.round(y + imageBounds.top)}px`;

    const annotation = {
        element: pre,
        type: 'text',
        text: text, // Store the initial text
        x: Math.round(x), // x relative to image's top-left, rounded
        y: Math.round(y), // y relative to image's top-left, rounded
        width: Math.round(initialWidth || pre.offsetWidth), // Store initial dimensions or current if auto, rounded
        height: Math.round(initialHeight || pre.offsetHeight),
        color: color,
        size: size,
        font: font,
        rotation: 0
    };

    this.setupAnnotation(pre, annotation, isNew);

    if (isNew) {
        this.state.annotations.push(annotation);
        this.selectAnnotation(annotation);
        
        // For new annotations, adjust placement after element has its initial size
        // If dir is RTL, align the right side of the text box to the image's center
        // Otherwise, center the text box
        if (pre.dir === 'rtl') {
            // `x` here is the horizontal center of the image area
            const initialRightX = x; 
            const actualLeft = initialRightX - pre.offsetWidth; // Calculate left based on right-alignment
            const actualTop = y - pre.offsetHeight / 2; // Vertically centered

            pre.style.left = `${Math.round(actualLeft + imageBounds.left)}px`;
            pre.style.top = `${Math.round(actualTop + imageBounds.top)}px`;

            annotation.x = Math.round(actualLeft); // Update annotation's x relative to image's top-left
            annotation.y = Math.round(actualTop); // Update annotation's y relative to image's top-left
        } else {
            // Original LTR centering logic: center the element
            const centerX = x - pre.offsetWidth / 2;
            const centerY = y - pre.offsetHeight / 2;
            pre.style.left = `${Math.round(centerX + imageBounds.left)}px`;
            pre.style.top = `${Math.round(centerY + imageBounds.top)}px`;
            annotation.x = Math.round(centerX);
            annotation.y = Math.round(centerY);
        }
    }

    // Listen for changes when contenteditable is used
    pre.addEventListener('input', () => {
        annotation.text = pre.textContent; // Update stored text
        // Update annotation dimensions to reflect current element size, rounded.
        annotation.width = Math.round(pre.offsetWidth);
        annotation.height = Math.round(pre.offsetHeight);
    });

    // Add a blur listener to ensure updates if content is changed and focus is lost without 'input' event (e.g., paste)
    pre.addEventListener('blur', () => {
        annotation.text = pre.textContent;
        annotation.width = Math.round(pre.offsetWidth);
        annotation.height = Math.round(pre.offsetHeight);
    });

    return annotation;
};

PhotoEditor.prototype.addShapeAnnotation = function(shape) {
    const imageBounds = this.state.activeImageBounds;
    const initialWidth = Math.min(imageBounds.width * 0.3, 150);
    const initialHeight = Math.min(imageBounds.height * 0.3, 150);
    const initialX = imageBounds.width / 2 - initialWidth / 2;
    const initialY = imageBounds.height / 2 - initialHeight / 2;

    this.createShapeAnnotation(
        shape,
        initialX,
        initialY,
        initialWidth,
        initialHeight,
        this.dom.shapeColor.value,
        this.dom.shapeWidth.value,
        this.dom.transparentFill.checked ? 'transparent' : this.dom.shapeFill.value,
        true
    );
};

PhotoEditor.prototype.createShapeAnnotation = function(shape, x, y, width, height, color, widthValue, fill, isNew) {
    const div = document.createElement('div');
    div.className = `annotation shape-annotation`;
    div.style.position = 'absolute';

    div.style.left = `${Math.round(x + this.state.activeImageBounds.left)}px`;
    div.style.top = `${Math.round(y + this.state.activeImageBounds.top)}px`;
    div.style.width = `${Math.round(width)}px`;
    div.style.height = `${Math.round(height)}px`;

    div.style.borderColor = color;
    div.style.borderWidth = `${widthValue}px`;
    div.style.backgroundColor = fill;
    div.style.borderStyle = 'solid';

    if (shape === 'circle') {
        div.style.borderRadius = '50%';
    }

    const annotation = {
        element: div,
        type: 'shape',
        shape: shape,
        x: Math.round(x), // x relative to image's top-left, rounded
        y: Math.round(y), // y relative to image's top-left, rounded
        width: Math.round(width),
        height: Math.round(height),
        color: color,
        widthValue: widthValue,
        fill: fill,
        rotation: 0
    };

    this.setupAnnotation(div, annotation, isNew);
    this.dom.editorPreview.appendChild(div);

    if (isNew) {
        this.state.annotations.push(annotation);
        this.selectAnnotation(annotation);
    }

    return annotation;
};

PhotoEditor.prototype.setupAnnotation = function(element, annotation, isNew) {
    const controls = document.createElement('div');
    controls.className = 'annotation-controls';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'annotation-control-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = getTranslation('delete');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        element.remove();
        this.state.annotations = this.state.annotations.filter(a => a !== annotation);
        if (this.state.activeAnnotation === annotation) {
            this.state.activeAnnotation = null;
        }
    });

    controls.appendChild(deleteBtn);
    element.appendChild(controls);

    // DRAG LOGIC
    element.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('annotation-control-btn') || e.target.classList.contains('resize-handle')) return; // Exclude resize handles
        if (this.state.isCropping) return;

        this.state.isDragging = true;
        this.state.activeAnnotation = annotation;
        this.selectAnnotation(annotation);

        const rect = element.getBoundingClientRect();
        this.state.startX = e.clientX - rect.left;
        this.state.startY = e.clientY - rect.top;

        e.preventDefault();

        // Bind and store the move and up handlers to `this` context
        this._boundAnnotationMouseMoveHandler = this.handleAnnotationMouseMove.bind(this, element, annotation);
        this._boundAnnotationMouseUpHandler = this.handleAnnotationMouseUp.bind(this);

        document.addEventListener('mousemove', this._boundAnnotationMouseMoveHandler);
        document.addEventListener('mouseup', this._boundAnnotationMouseUpHandler);
    });

    // RESIZE LOGIC
    // Handle size defined in editor.css is 10px, so half is 5px for offset
    const handleOffset = '5px'; 
    const handles = [
        { pos: 'nw', cursor: 'nwse-resize', style: `top: -${handleOffset}; left: -${handleOffset};` },
        { pos: 'n', cursor: 'ns-resize', style: `top: -${handleOffset}; left: calc(50% - ${handleOffset});` },
        { pos: 'ne', cursor: 'nesw-resize', style: `top: -${handleOffset}; right: -${handleOffset};` }, 
        { pos: 'w', cursor: 'ew-resize', style: `top: calc(50% - ${handleOffset}); left: -${handleOffset};` },
        { pos: 'e', cursor: 'ew-resize', style: `top: calc(50% - ${handleOffset}); right: -${handleOffset};` }, 
        { pos: 'sw', cursor: 'nesw-resize', style: `bottom: -${handleOffset}; left: -${handleOffset};` },
        { pos: 's', cursor: 'ns-resize', style: `bottom: -${handleOffset}; left: calc(50% - ${handleOffset});` },
        { pos: 'se', cursor: 'nwse-resize', style: `bottom: -${handleOffset}; right: -${handleOffset};` }
    ];

    handles.forEach(({ pos, cursor, style }) => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-handle-${pos}`;
        handle.dataset.position = pos;
        handle.style.cssText = `
            position: absolute;
            cursor: ${cursor};
            ${style}
        `; // Styles are now primarily handled by CSS classes

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            if (this.state.isCropping) return;

            this.state.isResizing = true;
            this.state.activeAnnotation = annotation;
            this.selectAnnotation(annotation);

            this.state.startX = e.clientX;
            this.state.startY = e.clientY;
            this.state.startWidth = element.offsetWidth;
            this.state.startHeight = element.offsetHeight;
            this.state.startLeft = parseInt(element.style.left, 10);
            this.state.startTop = parseInt(element.style.top, 10);
            this.state.resizeHandle = pos;

            // Bind and store the resize move and up handlers
            this._boundAnnotationResizeMouseMoveHandler = this.handleAnnotationResizeMouseMove.bind(this, element, annotation);
            this._boundAnnotationResizeMouseUpHandler = this.handleAnnotationResizeMouseUp.bind(this);

            document.addEventListener('mousemove', this._boundAnnotationResizeMouseMoveHandler);
            document.addEventListener('mouseup', this._boundAnnotationResizeMouseUpHandler);
        });

        element.appendChild(handle);
    });
};

// New methods for handling drag and resize separately
PhotoEditor.prototype.handleAnnotationMouseMove = function(element, annotation, moveEvent) {
    if (this.state.isDragging) {
        const previewRect = this.dom.editorPreview.getBoundingClientRect();
        const imageBounds = this.state.activeImageBounds;
        const margin = 5; // Margin from the image bounds

        let newLeft = moveEvent.clientX - previewRect.left - this.state.startX;
        let newTop = moveEvent.clientY - previewRect.top - this.state.startY;

        // Clamp newLeft within image bounds with margin
        newLeft = Math.max(imageBounds.left + margin, Math.min(newLeft, imageBounds.left + imageBounds.width - element.offsetWidth - margin));
        // Clamp newTop within image bounds with margin
        newTop = Math.max(imageBounds.top + margin, Math.min(newTop, imageBounds.top + imageBounds.height - element.offsetHeight - margin));

        element.style.left = `${Math.round(newLeft)}px`;
        element.style.top = `${Math.round(newTop)}px`;

        // Update annotation's x, y relative to image's top-left, rounded
        annotation.x = Math.round(newLeft - imageBounds.left);
        annotation.y = Math.round(newTop - imageBounds.top);
    }
};

PhotoEditor.prototype.handleAnnotationMouseUp = function() {
    this.state.isDragging = false;
    document.removeEventListener('mousemove', this._boundAnnotationMouseMoveHandler);
    document.removeEventListener('mouseup', this._boundAnnotationMouseUpHandler);
    this._boundAnnotationMouseMoveHandler = null;
    this._boundAnnotationMouseUpHandler = null;
};

PhotoEditor.prototype.handleAnnotationResizeMouseMove = function(element, annotation, moveEvent) {
    if (this.state.isResizing) {
        const deltaX = moveEvent.clientX - this.state.startX;
        const deltaY = moveEvent.clientY - this.state.startY;
        const imageBounds = this.state.activeImageBounds;
        const margin = 5; // Margin from the image bounds

        let newLeft = this.state.startLeft;
        let newTop = this.state.startTop;
        let newWidth = this.state.startWidth;
        let newHeight = this.state.startHeight;

        const minSize = 20;

        switch (this.state.resizeHandle) {
            case 'nw':
                newLeft = this.state.startLeft + deltaX;
                newTop = this.state.startTop + deltaY;
                newWidth = this.state.startWidth - deltaX;
                newHeight = this.state.startHeight - deltaY;
                break;
            case 'n':
                newTop = this.state.startTop + deltaY;
                newHeight = this.state.startHeight - deltaY;
                break;
            case 'ne':
                newTop = this.state.startTop + deltaY;
                newWidth = this.state.startWidth + deltaX;
                newHeight = this.state.startHeight - deltaY;
                break;
            case 'w':
                newLeft = this.state.startLeft + deltaX;
                newWidth = this.state.startWidth - deltaX;
                break;
            case 'e':
                newWidth = this.state.startWidth + deltaX;
                break;
            case 'sw':
                newLeft = this.state.startLeft + deltaX;
                newWidth = this.state.startWidth - deltaX;
                newHeight = this.state.startHeight + deltaY;
                break;
            case 's':
                newHeight = this.state.startHeight + deltaY;
                break;
            case 'se':
                newWidth = this.state.startWidth + deltaX;
                newHeight = this.state.startHeight + deltaY;
                break;
        }

        // Apply minimum size constraints
        newWidth = Math.max(minSize, newWidth);
        newHeight = Math.max(minSize, newHeight);

        // Clamp dimensions and positions to stay within image bounds
        // This is a more robust clamping that handles all 8 directions
        const maxLeft = imageBounds.left + imageBounds.width - minSize - margin;
        const maxTop = imageBounds.top + imageBounds.height - minSize - margin;

        newLeft = Math.max(imageBounds.left + margin, newLeft);
        newTop = Math.max(imageBounds.top + margin, newTop);

        // Adjust width/height if newLeft/newTop clamping reduced available space
        newWidth = Math.min(newWidth, imageBounds.left + imageBounds.width - newLeft - margin);
        newHeight = Math.min(newHeight, imageBounds.top + imageBounds.height - newTop - margin);
        
        // Final check to ensure newWidth/newHeight do not go below minSize after clamping
        newWidth = Math.max(minSize, newWidth);
        newHeight = Math.max(minSize, newHeight);


        // Apply the new dimensions and position to the element, rounded
        element.style.left = `${Math.round(newLeft)}px`;
        element.style.top = `${Math.round(newTop)}px`;
        element.style.width = `${Math.round(newWidth)}px`;
        element.style.height = `${Math.round(newHeight)}px`;

        // Update the annotation object's properties (relative to image's top-left), rounded
        annotation.x = Math.round(newLeft - imageBounds.left);
        annotation.y = Math.round(newTop - imageBounds.top);
        annotation.width = Math.round(newWidth);
        annotation.height = Math.round(newHeight);

        // Special handling for text annotations to resize the textarea content correctly
        if (annotation.type === 'text') {
            this.resizeTextarea(element);
        }
    }
};

PhotoEditor.prototype.handleAnnotationResizeMouseUp = function() {
    this.state.isResizing = false;
    document.removeEventListener('mousemove', this._boundAnnotationResizeMouseMoveHandler);
    document.removeEventListener('mouseup', this._boundAnnotationResizeMouseUpHandler);
    this._boundAnnotationResizeMouseMoveHandler = null;
    this._boundAnnotationResizeMouseUpHandler = null;
};

PhotoEditor.prototype.selectAnnotation = function(annotation) {
    if (this.state.activeAnnotation && this.state.activeAnnotation.element) {
        this.state.activeAnnotation.element.classList.remove('active');
    }

    this.state.activeAnnotation = annotation;
    if (annotation && annotation.element) {
        annotation.element.classList.add('active');
    }

    if (annotation.type === 'text') {
        this.dom.textContent.value = annotation.element.textContent; // Changed from .value to .textContent
        this.dom.textColor.value = annotation.color;
        this.dom.textSize.value = annotation.size;
        this.dom.textFont.value = annotation.font;
    } else {
        this.dom.shapeColor.value = annotation.color;
        this.dom.shapeWidth.value = annotation.widthValue;
        this.dom.shapeFill.value = annotation.fill;
        this.dom.transparentFill.checked = annotation.fill === 'transparent';
        this.dom.shapeFill.disabled = this.dom.transparentFill.checked;
    }
};

PhotoEditor.prototype.updateTextAnnotationProperty = function(property) {
    if (this.state.activeAnnotation && this.state.activeAnnotation.type === 'text') {
        const value = this.dom[`text${property.charAt(0).toUpperCase() + property.slice(1)}`].value;
        const element = this.state.activeAnnotation.element; // This is now a <pre> tag

        switch(property) {
            case 'color':
                element.style.color = value;
                break;
            case 'size':
                element.style.fontSize = `${value}px`;
                this.resizeTextarea(element); // Re-evaluate size based on new font size
                break;
            case 'font':
                element.style.fontFamily = value;
                this.resizeTextarea(element); // Re-evaluate size based on new font
                break;
        }

        // Always ensure the annotation's data reflects the current element's state after style changes, rounded
        this.state.activeAnnotation.text = element.textContent;
        this.state.activeAnnotation.width = Math.round(element.offsetWidth);
        this.state.activeAnnotation.height = Math.round(element.offsetHeight);
        this.state.activeAnnotation[property] = value;
    }
};

PhotoEditor.prototype.updateShapeAnnotationProperty = function(property) {
    if (this.state.activeAnnotation && this.state.activeAnnotation.type === 'shape') {
        const element = this.state.activeAnnotation.element;
        let value;

        switch(property) {
            case 'color':
                value = this.dom.shapeColor.value;
                element.style.borderColor = value;
                this.state.activeAnnotation.color = value;
                break;

            case 'width':
            case 'widthValue':
                value = this.dom.shapeWidth.value;
                element.style.borderWidth = `${value}px`;
                this.state.activeAnnotation.widthValue = parseFloat(value);
                break;

            case 'fill':
                if (this.dom.transparentFill.checked) {
                    value = 'transparent';
                    this.dom.shapeFill.disabled = true;
                } else {
                    value = this.dom.shapeFill.value;
                    this.dom.shapeFill.disabled = false;
                }
                element.style.backgroundColor = value;
                this.state.activeAnnotation.fill = value;
                break;
        }
    }
};