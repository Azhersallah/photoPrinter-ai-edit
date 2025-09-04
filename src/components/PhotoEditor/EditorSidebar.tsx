import React, { useState } from 'react';
import { 
  PlusIcon,
  ScissorsIcon,
  PaintBrushIcon,
  Squares2X2Icon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';
import { usePhotoEditor } from '../../context/PhotoContext';

type ActiveTool = 'text' | 'shapes' | 'crop' | null;

const EditorSidebar: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const { editorState, addAnnotation, startCrop, applyCrop, cancelCrop } = usePhotoEditor();
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  
  // Text tool state
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [textSize, setTextSize] = useState(16);
  const [textFont, setTextFont] = useState('Noto Naskh Arabic');
  
  // Shape tool state
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle'>('rectangle');
  const [shapeColor, setShapeColor] = useState('#FF0000');
  const [shapeWidth, setShapeWidth] = useState(2);
  const [shapeFill, setShapeFill] = useState('transparent');
  const [transparentFill, setTransparentFill] = useState(true);

  const handleAddText = () => {
    if (!editorState.currentPhoto) return;
    
    const annotation = {
      type: 'text' as const,
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      color: textColor,
      text: textContent || t('enterYourTextHere'),
      size: textSize,
      font: textFont,
    };
    
    addAnnotation(annotation);
  };

  const handleAddShape = () => {
    if (!editorState.currentPhoto) return;
    
    const annotation = {
      type: 'shape' as const,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      color: shapeColor,
      shape: shapeType,
      widthValue: shapeWidth,
      fill: transparentFill ? 'transparent' : shapeFill,
    };
    
    addAnnotation(annotation);
  };

  const handleStartCrop = () => {
    if (!editorState.currentPhoto) return;
    startCrop(editorState.currentPhoto);
    setActiveTool('crop');
  };

  const handleApplyCrop = async () => {
    await applyCrop();
    setActiveTool(null);
  };

  const handleCancelCrop = () => {
    cancelCrop();
    setActiveTool(null);
  };

  const fontOptions = [
    { value: 'Noto Naskh Arabic', label: t('notoNaskh') },
    { value: 'Calibri', label: t('calibri') },
    { value: 'UniQAIDAR 006', label: t('uniQaidar') },
    { value: 'Arial', label: t('arial') },
    { value: 'Courier New', label: t('courierNew') },
    { value: 'Georgia', label: t('georgia') },
  ];

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Tools Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Editing Tools
        </h3>
      </div>

      {/* Tools Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Text Tool */}
        <div className="space-y-4">
          <button
            onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
              activeTool === 'text'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <PaintBrushIcon className="w-5 h-5" />
              <span className="font-medium">{t('text')}</span>
            </div>
            <PlusIcon className={`w-4 h-4 transition-transform ${activeTool === 'text' ? 'rotate-45' : ''}`} />
          </button>

          {activeTool === 'text' && (
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('textContent')}
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={t('enterYourTextHere')}
                  className="form-textarea h-20"
                  dir="auto"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('textColor')}
                  </label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('fontSize')}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">{textSize}px</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('fontFamily')}
                </label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                  className="form-select"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddText}
                className="btn-primary w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('addText')}
              </button>
            </div>
          )}
        </div>

        {/* Shape Tool */}
        <div className="space-y-4">
          <button
            onClick={() => setActiveTool(activeTool === 'shapes' ? null : 'shapes')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
              activeTool === 'shapes'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Squares2X2Icon className="w-5 h-5" />
              <span className="font-medium">{t('shapes')}</span>
            </div>
            <PlusIcon className={`w-4 h-4 transition-transform ${activeTool === 'shapes' ? 'rotate-45' : ''}`} />
          </button>

          {activeTool === 'shapes' && (
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shape Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShapeType('rectangle')}
                    className={`p-2 rounded border ${
                      shapeType === 'rectangle'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {t('rectangle')}
                  </button>
                  <button
                    onClick={() => setShapeType('circle')}
                    className={`p-2 rounded border ${
                      shapeType === 'circle'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {t('circle')}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('borderColor')}
                  </label>
                  <input
                    type="color"
                    value={shapeColor}
                    onChange={(e) => setShapeColor(e.target.value)}
                    className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('borderWidth')}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={shapeWidth}
                    onChange={(e) => setShapeWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">{shapeWidth}px</div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id="transparentFill"
                    checked={transparentFill}
                    onChange={(e) => setTransparentFill(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="transparentFill" className="text-sm text-gray-700 dark:text-gray-300">
                    {t('transparentFill')}
                  </label>
                </div>
                
                {!transparentFill && (
                  <input
                    type="color"
                    value={shapeFill}
                    onChange={(e) => setShapeFill(e.target.value)}
                    className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                )}
              </div>
              
              <button
                onClick={handleAddShape}
                className="btn-primary w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add {shapeType}
              </button>
            </div>
          )}
        </div>

        {/* Crop Tool */}
        <div className="space-y-4">
          <button
            onClick={handleStartCrop}
            disabled={editorState.cropState.isActive}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
              editorState.cropState.isActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            } disabled:opacity-50`}
          >
            <ScissorsIcon className="w-5 h-5" />
            <span className="font-medium">{t('crop')}</span>
          </button>

          {editorState.cropState.isActive && (
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click and drag on the image to select the area to crop.
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleApplyCrop}
                  className="btn-primary flex-1 text-sm"
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  {t('apply')}
                </button>
                <button
                  onClick={handleCancelCrop}
                  className="btn-secondary flex-1 text-sm"
                >
                  <XMarkIcon className="w-4 h-4 mr-1" />
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
