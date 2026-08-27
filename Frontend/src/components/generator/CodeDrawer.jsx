import { useState } from 'react';
import CodeBlock from '../CodeBlock.jsx';
import { useBuilder } from '../../lib/BuilderContext.jsx';
import { generateHTML, generateCSS, generateJS } from '../../lib/codegen.js';

const TABS = [
  { id: 'html', label: 'HTML', lang: 'xml' },
  { id: 'css', label: 'CSS', lang: 'css' },
  { id: 'js', label: 'JS', lang: 'javascript' },
];

export default function CodeDrawer({ open, setOpen }) {
  const { elements } = useBuilder();
  const [tab, setTab] = useState('html');
  const code = { html: generateHTML(elements), css: generateCSS(elements), js: generateJS(elements) };
  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div
      className={`fixed left-0 right-0 bottom-0 bg-[#0b1324] border-t border-white/8 z-[150] max-h-[52vh] flex flex-col transition-transform duration-300 ${
        open ? 'translate-y-0' : 'translate-y-[calc(100%-44px)]'
      }`}
    >
      <div onClick={() => setOpen((o) => !o)} className="flex items-center justify-between px-4.5 py-2.5 cursor-pointer border-b border-white/5">
        <div className="flex items-center gap-2.5 text-[12.5px] font-semibold text-[var(--text-dim)]">
          ▲ Live Code <span className="mono opacity-60">— HTML / CSS / JS</span>
        </div>
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                tab === t.id ? 'grad-btn text-white' : 'bg-white/4 border border-white/5 text-[var(--text-dim)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-auto px-1 pb-1">
        <CodeBlock code={code[tab]} lang={activeTab.lang} />
      </div>
    </div>
  );
}
