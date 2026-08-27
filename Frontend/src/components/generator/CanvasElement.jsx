import { useEffect, useRef, useState } from 'react';
import { useBuilder } from '../../lib/BuilderContext.jsx';
import { SHADOWS } from '../../lib/constants';

function baseStyle(el) {
  const s = el.styles;
  const a = el.animation;
  const style = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    width: el.w,
    height: el.h,
    background: s.bg,
    color: s.color,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    padding: s.padding,
    borderRadius: s.radius,
    boxShadow: SHADOWS[s.shadow],
    border: el.type === 'input' ? '1px solid rgba(255,255,255,.12)' : 'none',
    cursor: 'move',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden',
  };
  if (a.type !== 'none' && a.type !== 'typing') {
    const iter = a.infinite ? 'infinite' : a.iteration;
    style.animation = `anim-${a.type} ${a.duration}s ${a.easing} ${a.delay}s ${iter} both`;
  }
  return style;
}

function TypingPreview({ text, fontSize }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    setShown('');
    const timer = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 65);
    return () => clearInterval(timer);
  }, [text]);
  return (
    <>
      <span>{shown}</span>
      <span
        className="inline-block ml-0.5"
        style={{ width: 2, height: Math.round(fontSize * 0.9), background: 'currentColor', animation: 'anim-blink 1s steps(1) infinite' }}
      />
    </>
  );
}

export default function CanvasElement({ el }) {
  const { selectedId, setSelectedId, updateElement } = useBuilder();
  const ref = useRef(null);
  const dragState = useRef(null);
  const resizeState = useRef(null);

  const onPointerDownMove = (e) => {
    e.stopPropagation();
    setSelectedId(el.id);
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y };
    const onMove = (ev) => {
      const d = dragState.current;
      if (!d) return;
      const x = Math.max(0, d.origX + (ev.clientX - d.startX));
      const y = Math.max(0, d.origY + (ev.clientY - d.startY));
      if (ref.current) {
        ref.current.style.left = x + 'px';
        ref.current.style.top = y + 'px';
      }
      dragState.current.lastX = x;
      dragState.current.lastY = y;
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const d = dragState.current;
      if (d && d.lastX !== undefined) updateElement(el.id, { x: d.lastX, y: d.lastY });
      dragState.current = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const onPointerDownResize = (e) => {
    e.stopPropagation();
    setSelectedId(el.id);
    resizeState.current = { startX: e.clientX, startY: e.clientY, origW: el.w, origH: el.h };
    const onMove = (ev) => {
      const r = resizeState.current;
      if (!r) return;
      const w = Math.max(30, r.origW + (ev.clientX - r.startX));
      const h = Math.max(24, r.origH + (ev.clientY - r.startY));
      if (ref.current) {
        ref.current.style.width = w + 'px';
        ref.current.style.height = h + 'px';
      }
      resizeState.current.lastW = w;
      resizeState.current.lastH = h;
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const r = resizeState.current;
      if (r && r.lastW !== undefined) updateElement(el.id, { w: r.lastW, h: r.lastH });
      resizeState.current = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  let content = null;
  if (el.type === 'image') {
    content = <img src={el.content} alt="" className="w-full h-full object-cover pointer-events-none block" />;
  } else if (el.type === 'input') {
    content = <input type="text" placeholder={el.content} readOnly className="w-full h-full outline-none pointer-events-none bg-transparent" />;
  } else if (el.type === 'card') {
    content = null;
  } else if (el.animation.type === 'typing') {
    content = <TypingPreview text={el.content} fontSize={el.styles.fontSize} />;
  } else {
    content = el.content;
  }

  return (
    <div
      ref={ref}
      style={baseStyle(el)}
      className={el.id === selectedId ? 'outline outline-2 outline-cyan-400 outline-offset-2' : ''}
      onMouseDown={onPointerDownMove}
    >
      {content}
      <div
        onMouseDown={onPointerDownResize}
        className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 rounded cursor-nwse-resize"
        style={{ background: 'var(--cyan)', border: '2px solid var(--bg)' }}
      />
    </div>
  );
}
