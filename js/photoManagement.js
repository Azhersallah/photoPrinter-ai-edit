// photoManagement.js
PhotoEditor.prototype.deletePhoto = function(photoId) {
    // Changed to use this.showCustomDialog instead of native confirm
    this.showCustomDialog(window.getTranslation('deleteConfirm'), null, '', (result) => {
        if (result) {
            this.state.photos = this.state.photos.filter(photo => photo.id !== photoId);
            delete this.state.rotations[photoId];
            this.arrangePhotos();
        }
    });
};

PhotoEditor.prototype.rotatePhoto = function(photoId, degrees) {
    if (!this.state.rotations[photoId]) this.state.rotations[photoId] = 0;
    this.state.rotations[photoId] += degrees;
    
    const container = document.querySelector(`.photo-container[data-photo-id="${photoId}"]`);
    if (container) {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.transform = `rotate(${this.state.rotations[photoId]}deg)`;
        }
    }
};

PhotoEditor.prototype.clearAllPhotos = function() {
    if (this.state.photos.length === 0) return;
    // Changed to use this.showCustomDialog instead of native confirm
    this.showCustomDialog(window.getTranslation('clearAllConfirm'), null, '', (result) => {
        if (result) {
            this.state.photos = [];
            this.state.rotations = {};
            this.state.savedTitles = {};
            this.state.savedSubtitles = {};
            this.dom.output.innerHTML = '';
            this.dom.emptyState.classList.remove('hidden');
            this.dom.output.classList.add('hidden');
            this.dom.globalTitleInput.value = '';
        }
    });
};
