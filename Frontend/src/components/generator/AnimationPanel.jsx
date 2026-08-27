import { useBuilder } from '../../lib/BuilderContext.jsx';
import { ANIM_LABELS } from '../../lib/constants';

const inputCls = 'w-full bg-white/3 border border-white/8 rounded-lg px-2.5 py-2 text-[13px]';
const labelCls = 'block text-[11.5px] text-[var(--text-dim)] mb-1.5 font-medium';

export default function AnimationPanel() {
  const { elements, selectedId, updateAnimation, updateElement } = useBuilder();
  const el = elements.find((e) => e.id === selectedId);

  if (!el) {
    return <div className="text-[var(--text-dim)] text-[13px] text-center py-10 px-2.5">Select an element on the canvas to add an animation.</div>;
  }

  const a = el.animation;

  return (
    <div>
      <div className="mb-3.5">
        <label className={labelCls}>Animation Type</label>
        <select className={inputCls} value={a.type} onChange={(e) => updateAnimation(el.id, { type: e.target.value })}>
          {Object.entries(ANIM_LABELS).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </div>

      {a.type === 'typing' && (
        <div className="mb-3.5 text-[11.5px] text-[var(--text-dim)] leading-relaxed">
          The text in "Content" (Style tab) will type itself out on page load. Typing speed is fixed at a natural
          reading pace in the exported JS.
        </div>
      )}

      {a.type !== 'none' && a.type !== 'typing' && (
        <>
          <div className="flex gap-2.5 mb-3.5">
            <div className="flex-1">
              <label className={labelCls}>Duration (s)</label>
              <input type="number" step="0.1" className={inputCls} value={a.duration} onChange={(e) => updateAnimation(el.id, { duration: +e.target.value || 1 })} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Delay (s)</label>
              <input type="number" step="0.1" className={inputCls} value={a.delay} onChange={(e) => updateAnimation(el.id, { delay: +e.target.value || 0 })} />
            </div>
          </div>
          <div className="flex gap-2.5 mb-3.5">
            <div className="flex-1">
              <label className={labelCls}>Iterations</label>
              <input
                type="number"
                min="1"
                disabled={a.infinite}
                className={inputCls}
                value={a.iteration}
                onChange={(e) => updateAnimation(el.id, { iteration: +e.target.value || 1 })}
              />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Easing</label>
              <select className={inputCls} value={a.easing} onChange={(e) => updateAnimation(el.id, { easing: e.target.value })}>
                {['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-[12.5px] text-[var(--text-dim)]">
            <input type="checkbox" checked={a.infinite} onChange={(e) => updateAnimation(el.id, { infinite: e.target.checked })} />
            Loop infinitely
          </label>
        </>
      )}

      <button
        onClick={() => updateElement(el.id, { replayTick: (el.replayTick || 0) + 1 })}
        className="w-full mt-3 bg-white/4 border border-white/8 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/8 transition-colors"
      >
        ↻ Replay Animation
      </button>
    </div>
  );
}
