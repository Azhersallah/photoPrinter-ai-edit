import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const shortcuts: KeyboardShortcut[] = [
  // File operations
  {
    key: 's',
    ctrlKey: true,
    action: () => document.getElementById('saveProjectBtn')?.click(),
    description: 'Save Project',
    category: 'File',
  },
  {
    key: 'o',
    ctrlKey: true,
    action: () => document.getElementById('loadProjectBtn')?.click(),
    description: 'Open Project',
    category: 'File',
  },
  {
    key: 'p',
    ctrlKey: true,
    action: () => {
      const event = new Event('beforeprint');
      window.dispatchEvent(event);
      window.print();
    },
    description: 'Print',
    category: 'File',
  },
  {
    key: 'e',
    ctrlKey: true,
    shiftKey: true,
    action: () => document.getElementById('pdfExportBtn')?.click(),
    description: 'Export PDF',
    category: 'File',
  },

  // Photo operations
  {
    key: 'n',
    ctrlKey: true,
    action: () => document.getElementById('selectPhotosBtn')?.click(),
    description: 'Add New Photos',
    category: 'Photos',
  },
  {
    key: 'a',
    ctrlKey: true,
    action: () => {
      const event = new CustomEvent('selectAllPhotos');
      window.dispatchEvent(event);
    },
    description: 'Select All Photos',
    category: 'Photos',
  },
  {
    key: 'Delete',
    action: () => {
      const event = new CustomEvent('deleteSelectedPhotos');
      window.dispatchEvent(event);
    },
    description: 'Delete Selected Photos',
    category: 'Photos',
  },

  // View operations
  {
    key: 'f',
    ctrlKey: true,
    action: () => {
      const event = new CustomEvent('toggleFindReplace');
      window.dispatchEvent(event);
    },
    description: 'Find and Replace',
    category: 'View',
  },
  {
    key: '1',
    ctrlKey: true,
    action: () => {
      const event = new CustomEvent('setLayout', { detail: '1' });
      window.dispatchEvent(event);
    },
    description: 'Set 1 Photo Layout',
    category: 'Layout',
  },
  {
    key: '2',
    ctrlKey: true,
    action: () => {
      const event = new CustomEvent('setLayout', { detail: '2' });
      window.dispatchEvent(event);
    },
    description: 'Set 2 Photos Layout',
    category: 'Layout',
  },
  {
    key: '4',
    ctrlKey: true,
    action: () => {
      const event = new CustomEvent('setLayout', { detail: '4' });
      window.dispatchEvent(event);
    },
    description: 'Set 4 Photos Layout',
    category: 'Layout',
  },

  // Theme and UI
  {
    key: 'd',
    ctrlKey: true,
    shiftKey: true,
    action: () => {
      const event = new CustomEvent('toggleTheme');
      window.dispatchEvent(event);
    },
    description: 'Toggle Dark Mode',
    category: 'Interface',
  },

  // Help
  {
    key: '?',
    shiftKey: true,
    action: () => {
      const event = new CustomEvent('showKeyboardShortcuts');
      window.dispatchEvent(event);
    },
    description: 'Show Keyboard Shortcuts',
    category: 'Help',
  },
];

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      const matchingShortcut = shortcuts.find((shortcut) => {
        return (
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.metaKey === event.metaKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        event.stopPropagation();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export const getShortcutString = (shortcut: KeyboardShortcut): string => {
  const parts = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.metaKey) parts.push('Cmd');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
};

export const groupShortcutsByCategory = () => {
  const grouped: Record<string, KeyboardShortcut[]> = {};
  
  shortcuts.forEach((shortcut) => {
    if (!grouped[shortcut.category]) {
      grouped[shortcut.category] = [];
    }
    grouped[shortcut.category].push(shortcut);
  });
  
  return grouped;
};
