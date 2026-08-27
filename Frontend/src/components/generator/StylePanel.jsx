import { useBuilder } from '../../lib/BuilderContext.jsx';
import { SHADOWS } from '../../lib/constants';
import { contrastRatio } from '../../lib/contrast';

function toHex(c) {
  if (!c || c === 'transparent') return '#0f172a';
  if (c.startsWith('#')) return c.length === 7 ? c : '#0f172a';
  if (c.startsWith('rgba') || c.startsWith('rgb')) {
    const m = c.match(/\d+/g);
    if (!m) return '#0f172a';
    return '#' + m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
  }
  return '#0f172a';
}

const inputCls = 'w-full bg-white/3 border border-white/8 rounded-lg px-2.5 py-2 text-[13px]';
const labelCls = 'block text-[11.5px] text-[var(--text-dim)] mb-1.5 font-medium';

export default function StylePanel() {
  const { elements, selectedId, updateElement, updateStyle } = useBuilder();
  const el = elements.find((e) => e.id === selectedId);

  if (!el) {
    return <div className="text-[var(--text-dim)] text-[13px] text-center py-10 px-2.5">Select an element on the canvas to edit its style.</div>;
  }

  const s = el.styles;
  const showContent = ['heading', 'text', 'button', 'input'].includes(el.type);
  const isImage = el.type === 'image';
  const ratio = contrastRatio(toHex(s.color), toHex(s.bg));
  const lowContrast = ratio < 3;
  const weakContrast = !lowContrast && ratio < 4.5;

  return (
    <div>
      {(showContent || isImage) && (
        <div className="mb-3.5">
          <label className={labelCls}>{isImage ? 'Image URL' : el.type === 'input' ? 'Placeholder' : 'Content'}</label>
          {isImage ? (
            <input type="text" className={inputCls} value={el.content} onChange={(e) => updateElement(el.id, { content: e.target.value })} />
          ) : (
            <textarea className={`${inputCls} resize-y min-h-[52px]`} value={el.content} onChange={(e) => updateElement(el.id, { content: e.target.value })} />
          )}
        </div>
      )}

      <div className="flex gap-2.5 mb-3.5">
        <div className="flex-1">
          <label className={labelCls}>Width (px)</label>
          <input type="number" className={inputCls} value={el.w} onChange={(e) => updateElement(el.id, { w: Math.max(20, +e.target.value || el.w) })} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Height (px)</label>
          <input type="number" className={inputCls} value={el.h} onChange={(e) => updateElement(el.id, { h: Math.max(20, +e.target.value || el.h) })} />
        </div>
      </div>

      <div className="flex gap-2.5 mb-3.5">
        <div className="flex-1">
          <label className={labelCls}>Background</label>
          <input type="color" className="w-full h-[34px] border border-white/8 rounded-lg p-0.5" value={toHex(s.bg)} onChange={(e) => updateStyle(el.id, { bg: e.target.value })} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Text Color</label>
          <input type="color" className="w-full h-[34px] border border-white/8 rounded-lg p-0.5" value={toHex(s.color)} onChange={(e) => updateStyle(el.id, { color: e.target.value })} />
        </div>
      </div>

      {(lowContrast || weakContrast) && (
        <div
          className={`flex items-start gap-1.5 -mt-2 mb-3.5 text-[11.5px] leading-snug rounded-lg px-2.5 py-2 border ${
            lowContrast ? 'text-red-300 bg-red-500/10 border-red-500/25' : 'text-amber-300 bg-amber-500/10 border-amber-500/25'
          }`}
        >
          <span>{lowContrast ? '⚠' : '⚡'}</span>
          <span>
            {lowContrast
              ? 'Low contrast — this text will be hard to read against its background.'
              : 'Contrast is a bit weak. Fine for large text, but small text may strain to read.'}
          </span>
        </div>
      )}

      <div className="flex gap-2.5 mb-3.5">
        <div className="flex-1">
          <label className={labelCls}>Font Size (px)</label>
          <input type="number" className={inputCls} value={s.fontSize} onChange={(e) => updateStyle(el.id, { fontSize: +e.target.value || s.fontSize })} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Font Weight</label>
          <select className={inputCls} value={s.fontWeight} onChange={(e) => updateStyle(el.id, { fontWeight: +e.target.value })}>
            {[400, 500, 600, 700, 800].map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2.5 mb-3.5">
        <div className="flex-1">
          <label className={labelCls}>Padding (px)</label>
          <input type="number" className={inputCls} value={s.padding} onChange={(e) => updateStyle(el.id, { padding: +e.target.value || 0 })} />
        </div>
        <div className="flex-1">
          <label className={labelCls}>Radius (px)</label>
          <input type="number" className={inputCls} value={s.radius} onChange={(e) => updateStyle(el.id, { radius: +e.target.value || 0 })} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Shadow</label>
        <select className={inputCls} value={s.shadow} onChange={(e) => updateStyle(el.id, { shadow: e.target.value })}>
          {Object.keys(SHADOWS).map((k) => (
            <option key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
