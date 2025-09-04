import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PhotoProvider } from './context/PhotoContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useKeyboardShortcuts } from './utils/keyboardShortcuts';
import { useKeyboardEvents } from './hooks/useKeyboardEvents';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import PhotoEditor from './components/PhotoEditor/PhotoEditor';
import FindReplacePanel from './components/FindReplace/FindReplacePanel';
import KeyboardShortcutsModal from './components/common/KeyboardShortcutsModal';
import StatusBar from './components/common/StatusBar';
import BatchOperations from './components/common/BatchOperations';

function AppContent() {
  // Enable keyboard shortcuts and events
  useKeyboardShortcuts();
  useKeyboardEvents();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden min-h-0">
      {/* Native app window controls */}
      <div className="window-controls h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 no-print">
        <div className="flex items-center space-x-2">
          <div className="window-button close"></div>
          <div className="window-button minimize"></div>
          <div className="window-button maximize"></div>
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Photo Printer Pro
        </div>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      {/* Header */}
      <Header />

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <MainContent />
      </div>

      {/* Status bar */}
      <StatusBar />

      {/* Overlays and Modals */}
      <PhotoEditor />
      <FindReplacePanel />
      <KeyboardShortcutsModal />
      <BatchOperations />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          // Apply readable colors in both themes
          className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg',
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PhotoProvider>
          <AppContent />
        </PhotoProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
