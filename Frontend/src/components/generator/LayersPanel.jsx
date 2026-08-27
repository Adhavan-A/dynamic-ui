import { useBuilder } from '../../lib/BuilderContext.jsx';
import { TYPE_LABEL } from '../../lib/constants';

export default function LayersPanel() {
  const { elements, selectedId, setSelectedId, moveLayer, deleteElement } = useBuilder();

  return (
    <div className="glass p-4 flex-1 min-h-0 flex flex-col">
      <div className="text-[11.5px] uppercase tracking-[.08em] text-[var(--text-dim)] font-semibold mb-3 flex items-center justify-between">
        Layers <span className="mono">{elements.length}</span>
      </div>
      <div className="overflow-auto flex-1">
        {elements.length === 0 && (
          <div className="text-[var(--text-dim)] text-[12.5px] text-center py-5 px-1.5">
            No elements yet.
            <br />
            Drag something onto the canvas.
          </div>
        )}
        {elements.map((el, idx) => (
          <div
            key={el.id}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12.5px] mb-1.5 border ${
              el.id === selectedId ? 'border-cyan-400/50 bg-cyan-400/8' : 'border-transparent bg-white/2'
            }`}
          >
            <span
              onClick={() => setSelectedId(el.id)}
              className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
            >
              {TYPE_LABEL[el.type]} #{el.id}
            </span>
            <button title="Move up" onClick={() => moveLayer(el.id, -1)} className="text-[var(--text-dim)] hover:text-white hover:bg-white/8 rounded px-1">▲</button>
            <button title="Move down" onClick={() => moveLayer(el.id, 1)} className="text-[var(--text-dim)] hover:text-white hover:bg-white/8 rounded px-1">▼</button>
            <button title="Delete" onClick={() => deleteElement(el.id)} className="text-[var(--text-dim)] hover:text-white hover:bg-white/8 rounded px-1">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
