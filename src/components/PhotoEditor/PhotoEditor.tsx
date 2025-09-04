import React from 'react';
import { XMarkIcon, PlusIcon, Square2StackIcon, CircleStackIcon, ArrowLongRightIcon, MinusIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { usePhotoEditor } from '../../context/PhotoContext';
import { useLanguage } from '../../context/LanguageContext';
import KonvaEditor from './KonvaEditor';

const PhotoEditor: React.FC = () => {
  const { t } = useLanguage();
  const { editorState, closeEditor, addAnnotation, updateAnnotation, setActiveAnnotation, removeAnnotation } = usePhotoEditor();

  if (!editorState.isOpen || !editorState.currentPhoto) return null;

  const addText = () => addAnnotation({ type: 'text', x: 50, y: 50, width: 200, height: 60, color: '#000', text: t('enterYourTextHere'), size: 24, font: 'Calibri' });
  const addRect = () => addAnnotation({ type: 'shape', shape: 'rectangle', x: 60, y: 60, width: 200, height: 120, color: '#2563eb', widthValue: 3, fill: 'transparent' });
  const addCircle = () => addAnnotation({ type: 'shape', shape: 'circle', x: 120, y: 80, width: 120, height: 120, color: '#ef4444', widthValue: 3, fill: 'transparent' });
  const addLine = () => addAnnotation({ type: 'shape', shape: 'line', x: 80, y: 80, width: 200, height: 0, color: '#10b981', widthValue: 3, fill: 'transparent' });
  const addArrow = () => addAnnotation({ type: 'shape', shape: 'arrow', x: 80, y: 120, width: 200, height: 0, color: '#f59e0b', widthValue: 3, fill: 'transparent' });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm">
            <button onClick={addText} className="btn-secondary">+ {t('text')}</button>
            <button onClick={addRect} className="btn-secondary">{t('rectangle')}</button>
            <button onClick={addCircle} className="btn-secondary">{t('circle')}</button>
            <button onClick={addLine} className="btn-secondary">{t('line') || 'Line'}</button>
            <button onClick={addArrow} className="btn-secondary">{t('arrow') || 'Arrow'}</button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            {/* Color */}
            <label className="text-xs text-gray-600 dark:text-gray-300">Color
              <input type="color" className="ml-2 align-middle" value={(editorState.activeAnnotation as any)?.color || '#000000'} onChange={(e) => {
                const sel = editorState.activeAnnotation; if (!sel) return;
                updateAnnotation(sel.id, { color: e.target.value });
              }} />
            </label>
            {/* Stroke width (shapes/lines) */}
            <label className="text-xs text-gray-600 dark:text-gray-300">Stroke
              <input type="number" min={1} max={20} value={(editorState.activeAnnotation as any)?.widthValue || 3} className="ml-2 w-16 form-input py-1" onChange={(e) => {
                const v = parseInt(e.target.value || '1', 10);
                const sel = editorState.activeAnnotation; if (!sel) return;
                updateAnnotation(sel.id, { widthValue: v });
              }} />
            </label>
            {/* Font size (text) */}
            <label className="text-xs text-gray-600 dark:text-gray-300">Font Size
              <input type="number" min={8} max={128} value={(editorState.activeAnnotation as any)?.size || 24} className="ml-2 w-16 form-input py-1" onChange={(e) => {
                const v = parseInt(e.target.value || '16', 10);
                const sel = editorState.activeAnnotation; if (!sel) return;
                updateAnnotation(sel.id, { size: v });
              }} />
            </label>
            {/* Text content (only for text) */}
            {editorState.activeAnnotation?.type === 'text' && (
              <>
                <input
                  className="form-input text-xs w-56"
                  value={(editorState.activeAnnotation as any)?.text || ''}
                  onChange={(e) => {
                    const sel = editorState.activeAnnotation; if (!sel) return;
                    updateAnnotation(sel.id, { text: e.target.value });
                  }}
                  placeholder={t('enterYourTextHere')}
                />
                <select
                  className="form-select text-xs w-40"
                  value={(editorState.activeAnnotation as any)?.font || 'Calibri'}
                  onChange={(e) => {
                    const sel = editorState.activeAnnotation; if (!sel) return;
                    updateAnnotation(sel.id, { font: e.target.value });
                  }}
                >
                  <option value="Noto Naskh Arabic">Noto Naskh Arabic</option>
                  <option value="Calibri">Calibri</option>
                  <option value="UniQAIDAR 006">UniQAIDAR 006</option>
                  <option value="Arial">Arial</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </>
            )}
          </div>
          <button onClick={closeEditor} className="btn-icon btn-secondary" title={t('close')}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <KonvaEditor
            photo={editorState.currentPhoto}
            rotation={editorState.viewRotation || 0}
            annotations={editorState.currentPhoto.annotations || []}
            onChange={(id, updates) => updateAnnotation(id, updates)}
            onAdd={(ann) => addAnnotation(ann)}
            onSelect={(id) => {
              const ann = (editorState.currentPhoto?.annotations || []).find(a => a.id === id);
              if (ann) setActiveAnnotation(ann);
            }}
            onDelete={(id) => removeAnnotation(id)}
          />
        </div>

        <div className="flex items-center justify-end p-3 border-t border-gray-200 dark:border-gray-700">
          <button onClick={closeEditor} className="btn-primary">{t('saveChanges')}</button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
