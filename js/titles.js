// titles.js
PhotoEditor.prototype.applyGlobalTitle = function() {
    const title = this.dom.globalTitleInput.value;
    // No need to return if no title, empty title means clearing

    // Iterate through all existing savedTitles and update them
    // This ensures titles are applied to all conceptual pages, not just rendered ones
    // Use this.state.totalPages to iterate through all potential pages
    for (let i = 0; i < this.state.totalPages; i++) {
        this.state.savedTitles[i] = title;
    }

    // After updating the state, re-arrange photos to reflect changes on visible pages
    // This will also ensure autoResizeTextarea is called for visible titles
    this.arrangePhotos(); 
    
    // Also update any currently visible title inputs directly if arrangePhotos doesn't immediately re-render them all
    // (though arrangePhotos should handle this by rebuilding the DOM for the current section)
    const titleInputs = document.querySelectorAll('.page-title-input');
    titleInputs.forEach(input => {
        input.value = title;
        this.autoResizeTextarea(input);
    });
};

PhotoEditor.prototype.clearGlobalTitle = function() {
    this.dom.globalTitleInput.value = '';
    const titleInputs = document.querySelectorAll('.page-title-input');
    titleInputs.forEach(input => {
        input.value = '';
        this.autoResizeTextarea(input);
    });
};

PhotoEditor.prototype.saveTitles = function() {
    const titleInputs = document.querySelectorAll('.page-title-input');
    
    this.state.savedTitles = {};
    
    titleInputs.forEach((input, index) => {
        this.state.savedTitles[index] = input.value;
    });
};

PhotoEditor.prototype.restoreTitles = function() {
    if (this.state.savedTitles) {
        const titleInputs = document.querySelectorAll('.page-title-input');
        titleInputs.forEach((input, index) => {
            if (this.state.savedTitles[index] !== undefined) {
                input.value = this.state.savedTitles[index];
                if (this.state.savedTitleHeights && this.state.savedTitleHeights[index]) {
                    input.style.height = this.state.savedTitleHeights[index];
                }
                this.autoResizeTextarea(input);
            }
        });
    }
};