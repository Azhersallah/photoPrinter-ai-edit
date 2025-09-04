// Initialize text area protection immediately
document.addEventListener('DOMContentLoaded', function() {
    // Force enable text areas function
    window.ensureTextAreasEnabled = function() {
        const textAreas = document.querySelectorAll('.layout-text-area, .page-title-input');
        textAreas.forEach(textarea => {
            textarea.disabled = false;
            textarea.style.backgroundColor = 'white';
            textarea.style.cursor = 'text';
            textarea.style.pointerEvents = 'auto';
        });
    };

    // Run immediately and set interval
    window.ensureTextAreasEnabled();
    setInterval(window.ensureTextAreasEnabled, 500);

    // Add event listener for sort button
    document.getElementById('sortPhotosBtn')?.addEventListener('click', function() {
        if (window.photoEditor && typeof window.photoEditor.sortPhotos === 'function') {
            window.photoEditor.sortPhotos();
        }
    });

    function convertArabicToWesternNumerals(str) {
        if (typeof str !== 'string') {
            return str;
        }
        // This array handles both Eastern Arabic and Sorani Kurdish numerals
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const westernNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let convertedStr = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const arabicIndex = arabicNumerals.indexOf(char);
            if (arabicIndex !== -1) {
                convertedStr += westernNumerals[arabicIndex];
            } else {
                convertedStr += char;
            }
        }
        return convertedStr;
    }

    function showCustomDialog(message, inputType = null, defaultValue = '', callback) {
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
        messageElement.style.marginBottom = '5px';

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
        buttonContainer.style.marginTop = '5px';
        buttonContainer.style.gap = '10px';

        const okButton = document.createElement('button');
        okButton.textContent = window.getTranslation('ok');
        okButton.className = 'btn btn-primary';
        okButton.style.flex = '1';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = window.getTranslation('cancel');
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

        okButton.addEventListener('click', function() {
            dialogOverlay.remove();
            callback(inputType !== null ? inputElement.value : true);
        });

        cancelButton.addEventListener('click', function() {
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
    window.showCustomDialog = showCustomDialog;


    document.getElementById('insertPageStartBtn')?.addEventListener('click', function() {
        if (window.photoEditor && typeof window.photoEditor.insertNewPage === 'function') {
            window.photoEditor.insertNewPage('start');
        }
    });

    document.getElementById('insertPageEndBtn')?.addEventListener('click', function() {
        if (window.photoEditor && typeof window.photoEditor.insertNewPage === 'function') {
            window.photoEditor.insertNewPage('end');
        }
    });

    document.getElementById('insertPageCustomBtn')?.addEventListener('click', function() {
        if (window.photoEditor && typeof window.photoEditor.insertNewPage === 'function') {
            showCustomDialog(window.getTranslation('promptPageNumberInsert'), 'number', '', function(pageNumber) {
                const convertedPageNumber = convertArabicToWesternNumerals(pageNumber);
                if (convertedPageNumber !== null && convertedPageNumber.trim() !== '') {
                    const parsedNumber = parseInt(convertedPageNumber, 10);
                    if (!isNaN(parsedNumber) && parsedNumber >= 0) {
                        window.photoEditor.insertNewPage('custom', parsedNumber);
                    } else {
                        showCustomDialog(window.getTranslation('invalidPageNumber'), null, '', function(){});
                    }
                } else if (pageNumber !== null) {
                    showCustomDialog(window.getTranslation('invalidPageNumber'), null, '', function(){});
                }
            });
        }
    });

    document.getElementById('clearPageBtn')?.addEventListener('click', function() {
        if (window.photoEditor && typeof window.photoEditor.clearPage === 'function') {
            showCustomDialog(window.getTranslation('promptPageNumberClear'), 'number', '', function(pageNumber) {
                const convertedPageNumber = convertArabicToWesternNumerals(pageNumber);
                if (convertedPageNumber !== null && convertedPageNumber.trim() !== '') {
                    const parsedNumber = parseInt(convertedPageNumber, 10);
                    if (!isNaN(parsedNumber) && parsedNumber >= 1) {
                        window.photoEditor.clearPage(parsedNumber - 1);
                    } else {
                        showCustomDialog(window.getTranslation('invalidPageNumber'), null, '', function(){});
                    }
                } else if (pageNumber !== null) {
                    showCustomDialog(window.getTranslation('invalidPageNumber'), null, '', function(){});
                }
            });
        }
    });

    document.getElementById('duplicatePageBtn')?.addEventListener('click', function() {
        if (window.photoEditor && typeof window.photoEditor.duplicatePage === 'function') {
            showCustomDialog(window.getTranslation('promptPageNumberDuplicate'), 'number', '', function(pageNumber) {
                const convertedPageNumber = convertArabicToWesternNumerals(pageNumber);
                if (convertedPageNumber !== null && convertedPageNumber.trim() !== '') {
                    const parsedNumber = parseInt(convertedPageNumber, 10);
                    if (!isNaN(parsedNumber) && parsedNumber >= 1) {
                        window.photoEditor.duplicatePage(parsedNumber - 1);
                    } else {
                        showCustomDialog(window.getTranslation('invalidPageNumber'), null, '', function(){});
                    }
                } else if (pageNumber !== null) {
                    showCustomDialog(window.getTranslation('invalidPageNumber'), null, '', function(){});
                }
            });
        }
    });

    document.getElementById('customStartPageNumberBtn')?.addEventListener('click', function() {
        if (window.photoEditor) {
            const promptText = window.getTranslation('promptCustomStartPageNumber');
            const currentStart = window.photoEditor.state.customStartPageNumber || 1;

            showCustomDialog(promptText, 'number', currentStart, function(pageNumber) {
                if (pageNumber === null) return;
                const convertedPageNumber = convertArabicToWesternNumerals(pageNumber);
                let newStartNumber = parseInt(convertedPageNumber, 10);
                if (convertedPageNumber.trim() === '' || isNaN(newStartNumber) || newStartNumber < 1) {
                    newStartNumber = 1;
                }
                window.photoEditor.state.customStartPageNumber = newStartNumber;
                window.photoEditor.arrangePhotos();
            });
        }
    });
    
    // **FIXED EVENT LISTENER**
    // Event listener for setting pages per section
    document.getElementById('setPagesPerSectionBtn')?.addEventListener('click', function() {
        if (window.photoEditor) {
            const input = document.getElementById('pagesPerSectionInput');
            
            // First, convert the input value from Kurdish/Arabic numerals
            const convertedValue = convertArabicToWesternNumerals(input.value);
            
            // Then, parse the converted value
            let value = parseInt(convertedValue, 10);
            
            if (isNaN(value) || value < 1) {
                value = 1; // Default to 1 if input is invalid or less than 1
            }
            
            // Update the input field with the standard Western number for consistency
            input.value = value;
            
            window.photoEditor.state.pagesPerSection = value;
            window.photoEditor.state.currentSection = 1; // Reset to the first section
            window.photoEditor.arrangePhotos();
        }
    });
});

const originalSetAttribute = HTMLElement.prototype.setAttribute;
HTMLElement.prototype.setAttribute = function(name, value) {
    if (name === 'disabled' && (this.classList.contains('layout-text-area') || this.classList.contains('page-title-input'))) {
        return;
    }
    return originalSetAttribute.call(this, name, value);
};
