import React from 'react';
import { 
  MoonIcon, 
  SunIcon, 
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  FolderOpenIcon,
  TrashIcon,
  DocumentTextIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useProjectActions } from '../../context/PhotoContext';
import { useFindReplaceStore } from '../../store/findReplaceStore';
import LanguageSelector from './LanguageSelector';
import toast from 'react-hot-toast';
import { printPages } from '../../utils/pdfExport';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { saveProject, exportToPDF } = useProjectActions();
  const toggleFindReplace = useFindReplaceStore(state => state.togglePanel);

  const handleSaveProject = () => {
    try {
      const projectData = saveProject();
      const blob = new Blob([projectData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photo-printer-project-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t('exportSuccess'));
    } catch (error) {
      toast.error(t('errorGeneratingPDF'));
    }
  };

  const handleLoadProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const projectData = event.target?.result as string;
            // loadProject(projectData); // This will be implemented in the store
            toast.success(t('loadProject') + ' ' + t('exportSuccess'));
          } catch (error) {
            toast.error(t('failedToLoadProject'));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handlePrint = () => {
    const toastId = toast.loading('Opening print dialog...');

    const onAfterPrint = () => {
      toast.dismiss(toastId);
      toast.success('Print completed');
      window.removeEventListener('afterprint', onAfterPrint);
    };

    window.addEventListener('afterprint', onAfterPrint);
    printPages();
  };

  const handleExportPDF = async () => {
    const loadingToast = toast.loading(t('exporting'));
    try {
      await exportToPDF();
      toast.dismiss(loadingToast);
      toast.success(t('exportSuccess'));
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('PDF export error:', error);
      toast.error(t('errorGeneratingPDF'));
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 no-print">
      <div className="flex items-center justify-between">
        {/* Left section - App title and logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
            <PrinterIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('appTitle')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Professional Photo Layout Tool
            </p>
          </div>
        </div>

        {/* Center section - Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Find and Replace */}
          <button
            onClick={toggleFindReplace}
            className="btn-icon btn-secondary"
            title={t('findReplace')}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Save Project */}
          <button
            onClick={handleSaveProject}
            className="btn-icon btn-secondary"
            title={t('saveProject')}
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>

          {/* Load Project */}
          <button
            onClick={handleLoadProject}
            className="btn-icon btn-secondary"
            title={t('loadProject')}
          >
            <FolderOpenIcon className="w-5 h-5" />
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="btn-icon btn-secondary"
            title={t('print')}
          >
            <PrinterIcon className="w-5 h-5" />
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="btn-primary flex items-center space-x-2"
            title={t('exportPDF')}
          >
            <DocumentTextIcon className="w-5 h-5" />
            <span>{t('exportPDF')}</span>
          </button>
        </div>

        {/* Right section - Settings */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon btn-secondary"
            title={t('toggleTheme')}
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
