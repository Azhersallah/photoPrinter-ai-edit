import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PageLayout } from '../types';

export interface PDFExportOptions {
  format: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  quality: number; // 0.1 to 1
  scale: number; // Canvas scale
  margin: number; // Margin in mm
}

const defaultOptions: PDFExportOptions = {
  format: 'a4',
  orientation: 'portrait',
  quality: 0.9,
  scale: 2,
  margin: 10,
};

const formatSizes = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
};

export class PDFExporter {
  private options: PDFExportOptions;
  private pdf: jsPDF;

  constructor(options: Partial<PDFExportOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    
    const format = formatSizes[this.options.format];
    
    this.pdf = new jsPDF({
      orientation: this.options.orientation,
      unit: 'mm',
      format: [format.width, format.height],
    });
  }

  async exportPages(pageLayouts: PageLayout[], onProgress?: (progress: number) => void): Promise<Blob> {
    if (pageLayouts.length === 0) {
      throw new Error('No pages to export');
    }

    // Add body class to hide non-print elements
    document.body.classList.add('hide-on-export');

    try {
      for (let i = 0; i < pageLayouts.length; i++) {
        const pageLayout = pageLayouts[i];
        
        // Find the page element
        const pageElement = document.querySelector(`[data-page-id="${pageLayout.id}"]`) as HTMLElement;
        if (!pageElement) {
          console.warn(`Page element not found for layout ${pageLayout.id}`);
          continue;
        }

        // Temporarily hide page-level tools
        const pageTools = pageElement.querySelectorAll('.no-print, .page-level-tools');
        const originalDisplays: string[] = [];
        
        pageTools.forEach((tool, index) => {
          const htmlTool = tool as HTMLElement;
          originalDisplays[index] = htmlTool.style.display;
          htmlTool.style.display = 'none';
        });

        // Replace textareas and inputs with divs for better rendering
        const replacedElements = await this.replaceInputsWithDivs(pageElement);

        // Wait for any pending renders
        await this.waitForRender();

        try {
          // Capture the page
          const canvas = await html2canvas(pageElement, {
            scale: this.options.scale,
            logging: false,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: pageElement.offsetWidth,
            height: pageElement.offsetHeight,
          });

          // Convert to image data
          const imgData = canvas.toDataURL('image/jpeg', this.options.quality);

          // Add new page if not the first
          if (i > 0) {
            this.pdf.addPage();
          }

          // Calculate dimensions
          const format = formatSizes[this.options.format];
          const pageWidth = format.width - (this.options.margin * 2);
          const pageHeight = format.height - (this.options.margin * 2);

          // Add image to PDF
          this.pdf.addImage(
            imgData,
            'JPEG',
            this.options.margin,
            this.options.margin,
            pageWidth,
            pageHeight
          );

          // Report progress
          if (onProgress) {
            onProgress(((i + 1) / pageLayouts.length) * 100);
          }

        } finally {
          // Restore original elements
          this.restoreElements(replacedElements);
          
          // Restore page tools
          pageTools.forEach((tool, index) => {
            const htmlTool = tool as HTMLElement;
            htmlTool.style.display = originalDisplays[index] || '';
          });
        }
      }

      // Generate blob
      const pdfBlob = this.pdf.output('blob');
      return pdfBlob;

    } finally {
      // Remove export class
      document.body.classList.remove('hide-on-export');
    }
  }

  private async replaceInputsWithDivs(container: HTMLElement): Promise<Map<HTMLElement, HTMLElement>> {
    const replacedElements = new Map<HTMLElement, HTMLElement>();
    
    const inputs = container.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
    
    inputs.forEach((input) => {
      const htmlInput = input as HTMLInputElement | HTMLTextAreaElement;
      const div = document.createElement('div');
      
      // Copy styles
      const computedStyle = window.getComputedStyle(htmlInput);
      div.style.cssText = `
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
        white-space: pre-wrap;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        word-wrap: break-word;
      `;
      
      // Set content
      if (htmlInput.tagName === 'INPUT' || htmlInput.tagName === 'TEXTAREA') {
        div.textContent = htmlInput.value || '';
      } else {
        div.textContent = htmlInput.textContent || '';
      }
      
      // Replace element
      if (htmlInput.parentNode) {
        htmlInput.parentNode.replaceChild(div, htmlInput);
        replacedElements.set(div, htmlInput);
      }
    });

    return replacedElements;
  }

  private restoreElements(replacedElements: Map<HTMLElement, HTMLElement>) {
    replacedElements.forEach((original, replacement) => {
      if (replacement.parentNode) {
        replacement.parentNode.replaceChild(original, replacement);
      }
    });
  }

  private waitForRender(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 100);
      });
    });
  }

  async exportAndDownload(
    pageLayouts: PageLayout[], 
    filename: string = 'photo-printer-export.pdf',
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const blob = await this.exportPages(pageLayouts, onProgress);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async quickExport(
    pageLayouts: PageLayout[],
    options?: Partial<PDFExportOptions>
  ): Promise<Blob> {
    const exporter = new PDFExporter(options);
    return exporter.exportPages(pageLayouts);
  }
}

// Utility function for simple exports
export async function exportToPDF(
  pageLayouts: PageLayout[],
  filename?: string,
  options?: Partial<PDFExportOptions>,
  onProgress?: (progress: number) => void
): Promise<void> {
  const exporter = new PDFExporter(options);
  await exporter.exportAndDownload(pageLayouts, filename, onProgress);
}

// Print functionality
export function printPages(): void {
  // Collect currently rendered A4 pages only
  const pages = Array.from(document.querySelectorAll('.a4-page')) as HTMLElement[];
  if (pages.length === 0) return;

  // Create isolated print container with clones
  const container = document.createElement('div');
  container.id = 'print-root';
  pages.forEach((page) => {
    const clone = page.cloneNode(true) as HTMLElement;
    container.appendChild(clone);
  });

  // Hide everything else by setting display:none on body children
  const bodyChildren = Array.from(document.body.children);
  const originalDisplays = new Map<Element, string>();
  bodyChildren.forEach((el) => {
    if (el !== container) {
      originalDisplays.set(el, (el as HTMLElement).style.display);
      (el as HTMLElement).style.display = 'none';
    }
  });

  document.body.appendChild(container);

  const cleanup = () => {
    // Remove container and restore displays
    if (container.parentNode) container.parentNode.removeChild(container);
    bodyChildren.forEach((el) => {
      if (originalDisplays.has(el)) {
        (el as HTMLElement).style.display = originalDisplays.get(el) || '';
      }
    });
    document.body.classList.remove('printing');
    if (mql) {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      // @ts-ignore legacy Safari/Firefox
      else if (mql.removeListener) mql.removeListener(onChange);
    }
    window.removeEventListener('afterprint', cleanup);
  };

  const onChange = (e: MediaQueryListEvent) => {
    if (!e.matches) cleanup();
  };

  // @ts-ignore older browsers
  const mql: MediaQueryList | undefined = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('print') : undefined;
  if (mql) {
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    // @ts-ignore legacy
    else if (mql.addListener) mql.addListener(onChange);
  }

  window.addEventListener('afterprint', cleanup);

  // Trigger print
  document.body.classList.add('printing');
  setTimeout(() => window.print(), 50);
}

// Check if browser supports printing
export function canPrint(): boolean {
  return typeof window !== 'undefined' && 'print' in window;
}

// Get print settings
export function getPrintSettings() {
  return {
    supportsPrint: canPrint(),
    supportsDownload: typeof document !== 'undefined' && 'createElement' in document,
    maxRecommendedPages: 50, // Recommended max for performance
  };
}
