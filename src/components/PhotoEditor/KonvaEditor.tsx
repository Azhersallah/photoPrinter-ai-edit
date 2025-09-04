import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Circle, Text as KonvaText, Arrow, Line, Transformer } from 'react-konva';
import { Annotation, Photo } from '../../types';

interface KonvaEditorProps {
  photo: Photo;
  rotation: number;
  annotations: Annotation[];
  onChange: (id: string, updates: Partial<Annotation>) => void;
  onAdd: (ann: Omit<Annotation, 'id'>) => void;
  onSelect?: (id: string | null) => void;
  onDelete?: (id: string) => void;
}

const useHTMLImage = (src: string) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => setImg(image);
    image.src = src;
    return () => { setImg(null); };
  }, [src]);
  return img;
};

const KonvaEditor: React.FC<KonvaEditorProps> = ({ photo, rotation, annotations, onChange, onAdd, onSelect, onDelete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 500 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; value: string; x: number; y: number; width: number; fontSize: number; fontFamily: string } | null>(null);
  const select = (id: string | null) => { setSelectedId(id); onSelect?.(id); };
  const image = useHTMLImage(photo.src);

  // Fit image into container respecting rotation
  useEffect(() => {
    const resize = () => {
      const el = containerRef.current;
      if (!el || !image) return;
      const bounds = el.getBoundingClientRect();
      const cw = bounds.width;
      const ch = bounds.height;
      const rotated = Math.abs(((rotation % 360) + 360) % 360) % 180 === 90;
      const iw = rotated ? photo.originalHeight : photo.originalWidth;
      const ih = rotated ? photo.originalWidth : photo.originalHeight;
      const aspect = iw / ih;
      let w: number, h: number;
      if (cw / ch > aspect) { h = ch; w = h * aspect; } else { w = cw; h = w / aspect; }
      setStageSize({ width: Math.max(100, Math.floor(w)), height: Math.max(100, Math.floor(h)) });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [image, rotation, photo.originalWidth, photo.originalHeight]);

  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    const node = selectedId ? stageRef.current.findOne(`#node-${selectedId}`) : null;
    trRef.current.nodes(node ? [node] : []);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedId, annotations]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) onDelete?.(selectedId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, onDelete]);

  const onDragMove = (id: string, e: any) => {
    const node = e.target;
    const x = Math.max(0, Math.min(node.x(), stageSize.width - node.width())) * (photo.originalWidth / stageSize.width);
    const y = Math.max(0, Math.min(node.y(), stageSize.height - node.height())) * (photo.originalHeight / stageSize.height);
    onChange(id, { x, y });
  };

  const onTransformEnd = (id: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1); node.scaleY(1);
    const width = Math.max(10, node.width() * scaleX) * (photo.originalWidth / stageSize.width);
    const height = Math.max(10, node.height() * scaleY) * (photo.originalHeight / stageSize.height);
    const x = Math.max(0, node.x()) * (photo.originalWidth / stageSize.width);
    const y = Math.max(0, node.y()) * (photo.originalHeight / stageSize.height);
    onChange(id, { x, y, width, height });
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="relative" style={{ width: stageSize.width, height: stageSize.height }}>
        <Stage width={stageSize.width} height={stageSize.height} className="bg-white rounded-lg shadow" ref={stageRef}>
          <Layer>
          {image && (
            <KonvaImage
              image={image}
              x={stageSize.width / 2}
              y={stageSize.height / 2}
              offsetX={stageSize.width / 2}
              offsetY={stageSize.height / 2}
              width={stageSize.width}
              height={stageSize.height}
              rotation={rotation}
              listening={false}
            />
            )}
          </Layer>
          <Layer>
            {annotations.map((ann) => {
            const common = {
              id: `node-${ann.id}`,
              draggable: true,
              x: (ann.x / photo.originalWidth) * stageSize.width,
              y: (ann.y / photo.originalHeight) * stageSize.height,
              width: (ann.width / photo.originalWidth) * stageSize.width,
              height: (ann.height / photo.originalHeight) * stageSize.height,
              onDragMove: (e: any) => onDragMove(ann.id, e),
              onTransformEnd: (e: any) => onTransformEnd(ann.id, e),
              onClick: () => select(ann.id),
              onTap: () => select(ann.id),
            } as any;
            if (ann.type === 'text') {
              return (
                <KonvaText
                  {...common}
                  key={ann.id}
                  text={ann.text || ''}
                  fontFamily={ann.font}
                  fontSize={(ann.size || 16) * (stageSize.width / photo.originalWidth)}
                  fill={ann.color}
                  onDblClick={() => {
                    const x = (ann.x / photo.originalWidth) * stageSize.width;
                    const y = (ann.y / photo.originalHeight) * stageSize.height;
                    const width = Math.max(50, (ann.width / photo.originalWidth) * stageSize.width);
                    const fontSize = (ann.size || 16) * (stageSize.width / photo.originalWidth);
                    setEditing({ id: ann.id, value: ann.text || '', x, y, width, fontSize, fontFamily: ann.font || 'Calibri' });
                  }}
                />
              );
            }
            if (ann.shape === 'circle') {
              return (
                <Circle
                  {...common}
                  key={ann.id}
                  radius={Math.min(common.width, common.height) / 2}
                  fill={ann.fill === 'transparent' ? undefined : ann.fill}
                  stroke={ann.color}
                  strokeWidth={ann.widthValue || 2}
                />
              );
            }
            if (ann.shape === 'line') {
              const x1 = common.x, y1 = common.y, x2 = common.x + common.width, y2 = common.y + common.height;
              return (
                <React.Fragment key={ann.id}>
                  <Line
                    points={[x1, y1, x2, y2]}
                    stroke={ann.color}
                    strokeWidth={ann.widthValue || 2}
                    onClick={() => select(ann.id)}
                  />
                  {selectedId === ann.id && (
                    <>
                      <Circle x={x1} y={y1} radius={6} fill="#fff" stroke="#3b82f6" draggable onDragMove={(e) => {
                        const nx = e.target.x();
                        const ny = e.target.y();
                        const width = (x2 - nx) * (photo.originalWidth / stageSize.width);
                        const height = (y2 - ny) * (photo.originalHeight / stageSize.height);
                        const xImg = nx * (photo.originalWidth / stageSize.width);
                        const yImg = ny * (photo.originalHeight / stageSize.height);
                        onChange(ann.id, { x: xImg, y: yImg, width, height });
                      }} />
                      <Circle x={x2} y={y2} radius={6} fill="#fff" stroke="#3b82f6" draggable onDragMove={(e) => {
                        const nx = e.target.x();
                        const ny = e.target.y();
                        const width = (nx - x1) * (photo.originalWidth / stageSize.width);
                        const height = (ny - y1) * (photo.originalHeight / stageSize.height);
                        onChange(ann.id, { width, height });
                      }} />
                    </>
                  )}
                </React.Fragment>
              );
            }
            if (ann.shape === 'arrow') {
              const x1 = common.x, y1 = common.y, x2 = common.x + common.width, y2 = common.y + common.height;
              return (
                <React.Fragment key={ann.id}>
                  <Arrow
                    points={[x1, y1, x2, y2]}
                    stroke={ann.color}
                    fill={ann.color}
                    strokeWidth={ann.widthValue || 2}
                    onClick={() => select(ann.id)}
                  />
                  {selectedId === ann.id && (
                    <>
                      <Circle x={x1} y={y1} radius={6} fill="#fff" stroke="#3b82f6" draggable onDragMove={(e) => {
                        const nx = e.target.x();
                        const ny = e.target.y();
                        const width = (x2 - nx) * (photo.originalWidth / stageSize.width);
                        const height = (y2 - ny) * (photo.originalHeight / stageSize.height);
                        const xImg = nx * (photo.originalWidth / stageSize.width);
                        const yImg = ny * (photo.originalHeight / stageSize.height);
                        onChange(ann.id, { x: xImg, y: yImg, width, height });
                      }} />
                      <Circle x={x2} y={y2} radius={6} fill="#fff" stroke="#3b82f6" draggable onDragMove={(e) => {
                        const nx = e.target.x();
                        const ny = e.target.y();
                        const width = (nx - x1) * (photo.originalWidth / stageSize.width);
                        const height = (ny - y1) * (photo.originalHeight / stageSize.height);
                        onChange(ann.id, { width, height });
                      }} />
                    </>
                  )}
                </React.Fragment>
              );
            }
            return (
              <Rect
                {...common}
                key={ann.id}
                fill={ann.fill === 'transparent' ? undefined : ann.fill}
                stroke={ann.color}
                strokeWidth={ann.widthValue || 2}
              />
            );
          })}
          <Transformer ref={trRef} rotateEnabled={false} enabledAnchors={["top-left","top-right","bottom-left","bottom-right"]} />
        </Layer>
        </Stage>
        {editing && (
          <textarea
            style={{ position: 'absolute', left: editing.x, top: editing.y, width: editing.width, fontSize: editing.fontSize, fontFamily: editing.fontFamily, lineHeight: '1.2', padding: 4 }}
            className="bg-white text-gray-900 border border-blue-500 rounded shadow-sm"
            autoFocus
            value={editing.value}
            onChange={(e) => setEditing({ ...editing, value: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onChange(editing.id, { text: editing.value }); setEditing(null); } if (e.key === 'Escape') { setEditing(null); } }}
            onBlur={() => { onChange(editing.id, { text: editing.value }); setEditing(null); }}
          />
        )}
      </div>
    </div>
  );
};

export default KonvaEditor;
