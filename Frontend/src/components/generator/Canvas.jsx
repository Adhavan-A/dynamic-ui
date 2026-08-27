import { useRef, useState } from 'react';
import { useBuilder } from '../../lib/BuilderContext.jsx';
import { DEFAULTS } from '../../lib/constants';
import CanvasElement from './CanvasElement.jsx';

export default function Canvas() {
  const { elements, addElement, setSelectedId } = useBuilder();
  const canvasRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData('text/plain');
    if (!type || !DEFAULTS[type]) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + canvasRef.current.scrollLeft;
    const y = e.clientY - rect.top + canvasRef.current.scrollTop;
    addElement(type, x, y);
  };

  return (
    <div
      ref={canvasRef}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onMouseDown={(e) => { if (e.target === canvasRef.current) setSelectedId(null); }}
      className={`bg-grid flex-1 relative rounded-[18px] overflow-auto border border-dashed ${
        dragOver ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/8'
      }`}
    >
      <div className="relative w-full min-h-full">
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--text-dim)] text-[13.5px] text-center pointer-events-none px-6">
            Canvas is empty — drag an element here to begin
          </div>
        )}
        {elements.map((el) => (
          <CanvasElement key={`${el.id}-${el.replayTick || 0}`} el={el} />
        ))}
      </div>
    </div>
  );
}
