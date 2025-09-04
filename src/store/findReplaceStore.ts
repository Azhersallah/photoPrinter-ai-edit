import { create } from 'zustand';
import { FindReplaceState, FoundOccurrence } from '../types';

interface FindReplaceStore extends FindReplaceState {
  // Actions
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setFindText: (text: string) => void;
  setReplaceText: (text: string) => void;
  findTextInPages: (searchText: string) => void;
  findNext: () => void;
  findPrevious: () => void;
  replaceCurrentOccurrence: (replaceText: string) => void;
  replaceAllOccurrences: (findText: string, replaceText: string) => void;
  clearHighlights: () => void;
  reset: () => void;
}

const createInitialState = (): FindReplaceState => ({
  isOpen: false,
  findText: '',
  replaceText: '',
  foundOccurrences: [],
  currentOccurrenceIndex: -1,
});

export const useFindReplaceStore = create<FindReplaceStore>((set, get) => ({
  // Initial state
  ...createInitialState(),

  // Actions
  openPanel: () => {
    set({ isOpen: true });
  },

  closePanel: () => {
    get().clearHighlights();
    set({ 
      isOpen: false,
      foundOccurrences: [],
      currentOccurrenceIndex: -1,
    });
  },

  togglePanel: () => {
    const { isOpen } = get();
    if (isOpen) {
      get().closePanel();
    } else {
      get().openPanel();
    }
  },

  setFindText: (text: string) => {
    set({ findText: text });
    // Clear previous search results when find text changes
    if (text === '') {
      get().clearHighlights();
      set({ foundOccurrences: [], currentOccurrenceIndex: -1 });
    }
  },

  setReplaceText: (text: string) => {
    set({ replaceText: text });
  },

  findTextInPages: (searchText: string) => {
    get().clearHighlights();
    
    if (!searchText.trim()) {
      set({ foundOccurrences: [], currentOccurrenceIndex: -1 });
      return;
    }

    const foundOccurrences: FoundOccurrence[] = [];
    const lowerSearchText = searchText.toLowerCase();

    // Find in page titles
    const titleInputs = document.querySelectorAll('.page-title-input, .layout-text-area, [contenteditable="true"]');
    
    titleInputs.forEach((element) => {
      const htmlElement = element as HTMLElement;
      let textContent = '';
      
      // Handle different types of elements
      if (htmlElement.tagName === 'INPUT' || htmlElement.tagName === 'TEXTAREA') {
        textContent = (htmlElement as HTMLInputElement | HTMLTextAreaElement).value;
      } else {
        textContent = htmlElement.textContent || '';
      }

      const lowerTextContent = textContent.toLowerCase();
      let lastIndex = 0;

      while (lastIndex < lowerTextContent.length) {
        const foundIndex = lowerTextContent.indexOf(lowerSearchText, lastIndex);
        if (foundIndex === -1) break;

        foundOccurrences.push({
          element: htmlElement,
          originalText: textContent,
          startIndex: foundIndex,
          endIndex: foundIndex + searchText.length,
        });

        lastIndex = foundIndex + searchText.length;
      }
    });

    set({
      foundOccurrences,
      currentOccurrenceIndex: foundOccurrences.length > 0 ? 0 : -1,
    });

    // Highlight the first occurrence if found
    if (foundOccurrences.length > 0) {
      get().highlightCurrentOccurrence();
    }
  },

  findNext: () => {
    const { foundOccurrences, currentOccurrenceIndex } = get();
    
    if (foundOccurrences.length === 0) return;

    const nextIndex = (currentOccurrenceIndex + 1) % foundOccurrences.length;
    set({ currentOccurrenceIndex: nextIndex });
    get().highlightCurrentOccurrence();
  },

  findPrevious: () => {
    const { foundOccurrences, currentOccurrenceIndex } = get();
    
    if (foundOccurrences.length === 0) return;

    const prevIndex = currentOccurrenceIndex <= 0 
      ? foundOccurrences.length - 1 
      : currentOccurrenceIndex - 1;
    
    set({ currentOccurrenceIndex: prevIndex });
    get().highlightCurrentOccurrence();
  },

  replaceCurrentOccurrence: (replaceText: string) => {
    const { foundOccurrences, currentOccurrenceIndex, findText } = get();
    
    if (foundOccurrences.length === 0 || currentOccurrenceIndex === -1) return;

    const currentMatch = foundOccurrences[currentOccurrenceIndex];
    const element = currentMatch.element;

    // Get current text content
    let currentText = '';
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      currentText = (element as HTMLInputElement | HTMLTextAreaElement).value;
    } else {
      currentText = element.textContent || '';
    }

    // Replace the text
    const before = currentText.substring(0, currentMatch.startIndex);
    const after = currentText.substring(currentMatch.endIndex);
    const newText = before + replaceText + after;

    // Update the element
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      (element as HTMLInputElement | HTMLTextAreaElement).value = newText;
    } else {
      element.textContent = newText;
    }

    // Trigger input event to notify any listeners
    element.dispatchEvent(new Event('input', { bubbles: true }));

    // Re-search to update indices
    get().findTextInPages(findText);
  },

  replaceAllOccurrences: (findText: string, replaceText: string) => {
    if (!findText.trim()) return;

    // Re-search to get the latest occurrences
    get().findTextInPages(findText);
    
    const { foundOccurrences } = get();
    let replacementCount = 0;

    // Process replacements from end to start to maintain correct indices
    const sortedOccurrences = [...foundOccurrences].sort((a, b) => b.startIndex - a.startIndex);
    
    // Group by element to process all replacements for each element at once
    const elementGroups = new Map<HTMLElement, FoundOccurrence[]>();
    
    sortedOccurrences.forEach(occurrence => {
      const elementOccurrences = elementGroups.get(occurrence.element) || [];
      elementOccurrences.push(occurrence);
      elementGroups.set(occurrence.element, elementOccurrences);
    });

    elementGroups.forEach((occurrences, element) => {
      let currentText = '';
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        currentText = (element as HTMLInputElement | HTMLTextAreaElement).value;
      } else {
        currentText = element.textContent || '';
      }

      // Apply all replacements for this element
      let newText = currentText;
      occurrences.forEach(occurrence => {
        const before = newText.substring(0, occurrence.startIndex);
        const after = newText.substring(occurrence.endIndex);
        newText = before + replaceText + after;
        replacementCount++;
        
        // Adjust subsequent occurrence indices for this element
        const lengthDiff = replaceText.length - findText.length;
        occurrences.forEach(laterOccurrence => {
          if (laterOccurrence.startIndex < occurrence.startIndex) {
            laterOccurrence.startIndex += lengthDiff;
            laterOccurrence.endIndex += lengthDiff;
          }
        });
      });

      // Update the element
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        (element as HTMLInputElement | HTMLTextAreaElement).value = newText;
      } else {
        element.textContent = newText;
      }

      // Trigger input event
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Clear search results after replacement
    get().clearHighlights();
    set({ foundOccurrences: [], currentOccurrenceIndex: -1 });

    return replacementCount;
  },

  clearHighlights: () => {
    // Remove highlight classes from all elements
    document.querySelectorAll('.find-active-match').forEach(el => {
      el.classList.remove('find-active-match');
    });
  },

  highlightCurrentOccurrence: () => {
    get().clearHighlights();
    
    const { foundOccurrences, currentOccurrenceIndex } = get();
    
    if (foundOccurrences.length === 0 || currentOccurrenceIndex === -1) return;

    const currentMatch = foundOccurrences[currentOccurrenceIndex];
    const element = currentMatch.element;
    
    // Add highlight class
    element.classList.add('find-active-match');
    
    // Scroll into view
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });

    // Focus the element if it's an input
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      (element as HTMLInputElement | HTMLTextAreaElement).focus();
      
      // Set selection to the found text
      try {
        (element as HTMLInputElement | HTMLTextAreaElement).setSelectionRange(
          currentMatch.startIndex,
          currentMatch.endIndex
        );
      } catch (e) {
        // Ignore selection errors
      }
    }
  },

  reset: () => {
    get().clearHighlights();
    set(createInitialState());
  },
}));
