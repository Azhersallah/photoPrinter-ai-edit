// dragAndDrop.js - Fixed version to prevent blinking
PhotoEditor.prototype.initDragAndDrop = function() {
    let dragCounter = 0; // Counter to track drag enter/leave events
    
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const highlight = () => {
        this.dom.dragOverlay.classList.add('active');
        this.dom.dropZone.classList.add('drop-zone--active');
    };

    const unhighlight = () => {
        this.dom.dragOverlay.classList.remove('active');
        this.dom.dropZone.classList.remove('drop-zone--active');
    };

    // Handle dragenter - increment counter and show overlay
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter++;
        if (dragCounter === 1) {
            highlight();
        }
    };

    // Handle dragleave - decrement counter and hide overlay when counter reaches 0
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter--;
        if (dragCounter === 0) {
            unhighlight();
        }
    };

    // Handle dragover - just prevent default
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Handle drop - reset counter and process files
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter = 0;
        unhighlight();
        
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            this.dom.fileInput.files = files;
            const event = new Event('change');
            this.dom.fileInput.dispatchEvent(event);
        }
    };

    // Add event listeners to document instead of dropZone to catch all events
    document.addEventListener('dragenter', handleDragEnter, false);
    document.addEventListener('dragleave', handleDragLeave, false);
    document.addEventListener('dragover', handleDragOver, false);
    document.addEventListener('drop', handleDrop, false);
};

PhotoEditor.prototype.handleFileSelect = function(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Don't clear existing photos - just add new ones
    // this.state.photos = [];
    // this.state.rotations = {};
    // this.dom.output.innerHTML = '';
    
    files.sort((a, b) => a.name.localeCompare(b.name));
    
    const imageFiles = files.filter(f => f.type.match('image.*'));
    if (imageFiles.length === 0) return;
    
    // Get current photo count for unique IDs
    const currentPhotoCount = this.state.photos.length;
    
    let loadedCount = 0;
    imageFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Check if photo already exists (by name) to avoid duplicates
            const existingPhoto = this.state.photos.find(photo => photo.name === file.name);
            if (!existingPhoto) {
                this.state.photos.push({
                    id: `photo-${currentPhotoCount + index}-${Date.now()}`,
                    src: event.target.result,
                    name: file.name,
                    annotations: []
                });
            }
            
            loadedCount++;
            if (loadedCount === imageFiles.length) {
                this.arrangePhotos();
            }
        };
        reader.readAsDataURL(file);
    });
    
    // Clear the file input so the same files can be selected again if needed
    e.target.value = '';
};
