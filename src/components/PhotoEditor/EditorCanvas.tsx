import React, { useRef, useEffect, useState } from 'react';
import { usePhotoEditor } from '../../context/PhotoContext';
import { Annotation } from '../../types';

const EditorCanvas: React.FC = () => {
  const { editorState, updateAnnotation, setActiveAnnotation } = usePhotoEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<{x:number;y:number}>({ x: 0, y: 0 });
  const [origRect, setOrigRect] = useState<{x:number;y:number;width:number;height:number}>({ x: 0, y: 0, width: 0, height: 0 });

  const photo = editorState.currentPhoto;
  const rotation = editorState.viewRotation || 0;

  const startDrag = (e: React.MouseEvent, ann: Annotation) => {
    setActiveAnnotation(ann);
    setDraggingId(ann.id);
    setStartPos({ x: e.clientX, y: e.clientY });
    setOrigRect({ x: ann.x, y: ann.y, width: ann.width, height: ann.height });
  };
  const startResize = (e: React.MouseEvent, ann: Annotation) => {
    e.stopPropagation();
    setActiveAnnotation(ann);
    setResizingId(ann.id);
    setStartPos({ x: e.clientX, y: e.clientY });
    setOrigRect({ x: ann.x, y: ann.y, width: ann.width, height: ann.height });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!photo) return;
      if (!draggingId && !resizingId) return;
      const dxPx = e.clientX - startPos.x;
      const dyPx = e.clientY - startPos.y;
      const dxImg = dxPx * (photo.originalWidth / canvasSize.width);
      const dyImg = dyPx * (photo.originalHeight / canvasSize.height);
      if (draggingId) {
        updateAnnotation(draggingId, {
          x: Math.max(0, Math.min(photo.originalWidth - origRect.width, origRect.x + dxImg)),
          y: Math.max(0, Math.min(photo.originalHeight - origRect.height, origRect.y + dyImg)),
        });
      } else if (resizingId) {
        updateAnnotation(resizingId, {
          width: Math.max(10, Math.min(photo.originalWidth - origRect.x, origRect.width + dxImg)),
          height: Math.max(10, Math.min(photo.originalHeight - origRect.y, origRect.height + dyImg)),
        });
      }
    };
    const onUp = () => {
      setDraggingId(null);
      setResizingId(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingId, resizingId, startPos.x, startPos.y, origRect.x, origRect.y, origRect.width, origRect.height, canvasSize.width, canvasSize.height, updateAnnotation, photo]);

  useEffect(() => {
    if (photo && imageRef.current) {
      const img = imageRef.current;
      
      const handleLoad = () => {
        setImageLoaded(true);
        
        // Calculate canvas size to fit the container while maintaining aspect ratio
        const container = canvasRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerWidth = containerRect.width - 32; // Padding
          const containerHeight = containerRect.height - 32; // Padding
          
          const rotated = Math.abs(((rotation % 360) + 360) % 360) % 180 === 90;
          const aspectRatio = rotated ? (photo.originalHeight / photo.originalWidth) : (photo.originalWidth / photo.originalHeight);
          
          let width, height;
          
          if (containerWidth / containerHeight > aspectRatio) {
            // Container is wider than image aspect ratio
            height = containerHeight;
            width = height * aspectRatio;
          } else {
            // Container is taller than image aspect ratio
            width = containerWidth;
            height = width / aspectRatio;
          }
          
          setCanvasSize({ width, height });
        }
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
        return () => img.removeEventListener('load', handleLoad);
      }
    }
  }, [photo, rotation]);

  if (!photo) return null;

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Main Image */}
      <div 
        className="relative bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <img
          ref={imageRef}
          src={photo.src}
          alt={photo.file.name}
          className="w-full h-full object-contain"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }}
          draggable={false}
        />

        {/* Annotations Layer */}
        {imageLoaded && photo.annotations && photo.annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute group"
            style={{
              left: `${(annotation.x / photo.originalWidth) * 100}%`,
              top: `${(annotation.y / photo.originalHeight) * 100}%`,
              width: `${(annotation.width / photo.originalWidth) * 100}%`,
              height: `${(annotation.height / photo.originalHeight) * 100}%`,
            }}
            onMouseDown={(e) => startDrag(e, annotation)}
          >
            {annotation.type === 'text' && (
              <div
                className="text-annotation cursor-move border border-transparent hover:border-blue-400 transition-colors bg-transparent"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateAnnotation(annotation.id, { text: (e.target as HTMLDivElement).innerText })}
                style={{
                  fontSize: `${(annotation.size || 16) * (canvasSize.width / photo.originalWidth)}px`,
                  color: annotation.color,
                  fontFamily: annotation.font,
                  lineHeight: '1.2',
                  padding: '2px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {annotation.text}
              </div>
            )}

            {annotation.type === 'shape' && (
              <div
                className="shape-annotation cursor-move"
                style={{
                  border: `${annotation.widthValue || 2}px solid ${annotation.color}`,
                  backgroundColor: annotation.fill === 'transparent' ? 'transparent' : annotation.fill,
                  borderRadius: annotation.shape === 'circle' ? '50%' : '0',
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
            {/* Resize handle */}
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-blue-500 rounded-sm cursor-se-resize"
              onMouseDown={(e) => startResize(e, annotation)}
            />
          </div>
        ))}

        {/* Crop Overlay */}
        {editorState.cropState.isActive && (
          <div className="absolute inset-0 bg-black/50">
            {/* Crop selection area */}
            <div
              className="absolute border-2 border-white bg-transparent"
              style={{
                left: `${(editorState.cropState.startX / photo.originalWidth) * 100}%`,
                top: `${(editorState.cropState.startY / photo.originalHeight) * 100}%`,
                width: `${((editorState.cropState.endX - editorState.cropState.startX) / photo.originalWidth) * 100}%`,
                height: `${((editorState.cropState.endY - editorState.cropState.startY) / photo.originalHeight) * 100}%`,
              }}
            >
              {/* Crop handles */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-gray-400"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-gray-400"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-gray-400"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-gray-400"></div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded">
        {Math.round(canvasSize.width)} × {Math.round(canvasSize.height)} px
        {canvasSize.width > 0 && (
          <span className="ml-2">
            ({Math.round((canvasSize.width / photo.originalWidth) * 100)}%)
          </span>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <button className="btn-icon btn-secondary bg-black/70 text-white hover:bg-black/80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-3m-1.5 1.5L21 21" />
          </svg>
        </button>
        <button className="btn-icon btn-secondary bg-black/70 text-white hover:bg-black/80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10h6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EditorCanvas;
