// export.js
PhotoEditor.prototype.exportToPDF = async function() {
    if (this.state.photos.length === 0) {
        this.showCustomDialog(getTranslation('noPhotosExport'), null, '', () => {});
        return;
    }

    // Save current titles and heights
    this.saveTitles();

    const originalButtonContent = this.dom.pdfExportBtn.innerHTML;
    const originalButtonDisabled = this.dom.pdfExportBtn.disabled;
    
    // Show loading overlay
    this.dom.loadingText.textContent = getTranslation('exporting');
    this.dom.loadingOverlay.classList.remove('hidden');
    
    this.dom.pdfExportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + getTranslation('exporting');
    this.dom.pdfExportBtn.disabled = true;

    // Store references to original text elements that will be replaced
    const replacedElementsMap = new Map(); // Map<originalElement, newDivElement>
    // Store references to page-level-tools elements and their original display styles
    const pageToolsToHide = [];

    try {
        await this.arrangePhotos(); // Ensure photos are arranged for printing

        // Add class to body to hide all non-print elements (general hiding)
        document.body.classList.add('hide-on-export');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pages = document.querySelectorAll('.a4-page');
        
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            
            // Temporarily hide page-level-tools for this specific page capture
            const currentPageTools = page.querySelector('.page-level-tools');
            if (currentPageTools) {
                pageToolsToHide.push({ element: currentPageTools, originalDisplay: currentPageTools.style.display });
                currentPageTools.style.display = 'none';
            }

            // Temporarily replace textareas/inputs with divs for proper rendering in html2canvas
            this._replaceTextElementsForPDF(page, replacedElementsMap);

            // Wait a moment for DOM changes to render
            await new Promise(resolve => setTimeout(resolve, 100)); 
            
            const canvas = await html2canvas(page, {
                scale: 2, // Use a higher scale for better quality
                logging: false,
                useCORS: true,
                allowTaint: true,
                async: true,
                // onclone is less reliable for structural changes, direct DOM manipulation is better
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            
            if (i > 0) {
                pdf.addPage();
            }
            
            // Add image to PDF (A4 dimensions: 210mm x 297mm)
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

            // Restore page-level-tools display for the next iteration or after loop
            if (currentPageTools) {
                currentPageTools.style.display = pageToolsToHide[pageToolsToHide.length - 1].originalDisplay;
                pageToolsToHide.pop(); // Remove from temporary storage
            }
        }
        
        pdf.save('photo-editor-export.pdf');
        this.showSuccessMessage(getTranslation('exportSuccess')); 
    } catch (error) {
        console.error('Error generating PDF:', error);
        this.showCustomDialog(getTranslation('errorGeneratingPDF'), null, '', () => {}); 
    } finally {
        // Ensure all page-level-tools are restored in case of error or early exit
        pageToolsToHide.forEach(({ element, originalDisplay }) => {
            element.style.display = originalDisplay;
        });

        // Restore original text elements
        this._restoreTextElementsAfterPDF(replacedElementsMap);

        // Remove the hide-on-export class from body
        document.body.classList.remove('hide-on-export');

        // Hide loading overlay
        this.dom.loadingOverlay.classList.add('hidden');

        // Restore original button state
        this.dom.pdfExportBtn.innerHTML = originalButtonContent;
        this.dom.pdfExportBtn.disabled = originalButtonDisabled;

        // Restore titles after export (this is for the UI, not the PDF content)
        this.restoreTitles();
    }
};

/**
 * Helper function to replace textareas and inputs with divs for PDF export.
 * This preserves line breaks and styling better in html2canvas.
 * @param {HTMLElement} page The current A4 page element.
 * @param {Map<HTMLElement, HTMLElement>} replacedElementsMap A map to store original elements and their replacements.
 */
PhotoEditor.prototype._replaceTextElementsForPDF = function(page, replacedElementsMap) {
    const textElements = page.querySelectorAll('.page-title-input, .layout-text-area');
    
    textElements.forEach(originalElement => {
        const newDiv = document.createElement('div');
        newDiv.textContent = originalElement.value; // Use textContent to preserve line breaks

        // Copy essential styles for rendering
        const computedStyle = window.getComputedStyle(originalElement);
        newDiv.style.cssText = `
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            font-weight: ${computedStyle.fontWeight};
            color: ${computedStyle.color};
            text-align: ${computedStyle.textAlign};
            direction: ${computedStyle.direction};
            line-height: ${computedStyle.lineHeight};
            padding: ${computedStyle.padding};
            margin: ${computedStyle.margin};
            width: ${computedStyle.width};
            height: ${computedStyle.height};
            box-sizing: ${computedStyle.boxSizing};
            border: ${computedStyle.border};
            background-color: ${computedStyle.backgroundColor};
            white-space: pre-wrap; /* Crucial for preserving line breaks */
            overflow: hidden; /* Hide scrollbars if any */
            display: flex; /* To center text vertically if needed */
            align-items: center;
            justify-content: center;
        `;
        
        // Match specific classes for print styles if necessary
        if (originalElement.classList.contains('page-title-input')) {
            newDiv.classList.add('page-title-input-pdf-temp'); // Add a unique class for print.css targeting
        }
        if (originalElement.classList.contains('layout-text-area')) {
            newDiv.classList.add('layout-text-area-pdf-temp'); // Add a unique class for print.css targeting
        }

        // Store the original element and its new replacement div
        replacedElementsMap.set(originalElement, newDiv);
        originalElement.parentNode.replaceChild(newDiv, originalElement);
    });
};

/**
 * Helper function to restore original textareas and inputs after PDF export.
 * @param {Map<HTMLElement, HTMLElement>} replacedElementsMap A map containing original elements and their replacements.
 */
PhotoEditor.prototype._restoreTextElementsAfterPDF = function(replacedElementsMap) {
    replacedElementsMap.forEach((newDiv, originalElement) => {
        if (newDiv.parentNode) {
            newDiv.parentNode.replaceChild(originalElement, newDiv);
        }
    });
    replacedElementsMap.clear(); // Clear the map after restoration
};


PhotoEditor.prototype.showSuccessMessage = function(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        font-family: 'UniQAIDAR 006';
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        direction: rtl;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
};
