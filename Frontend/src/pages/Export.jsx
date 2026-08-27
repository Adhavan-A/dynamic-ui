import JSZip from 'jszip';
import CodeBlock from '../components/CodeBlock.jsx';
import { useBuilder } from '../lib/BuilderContext.jsx';
import { generateHTML, generateCSS, generateJS } from '../lib/codegen.js';

export default function Export() {
  const { elements, resetCanvas, showToast } = useBuilder();
  const html = generateHTML(elements);
  const css = generateCSS(elements);
  const js = generateJS(elements);

  const copy = (label, text) => {
    navigator.clipboard.writeText(text).then(() => showToast(label + ' copied to clipboard'));
  };

  const onReset = () => {
    if (elements.length && !window.confirm('Clear the entire canvas? This cannot be undone.')) return;
    resetCanvas();
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dynamic-ui-project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Project downloaded as ZIP');
  };

  const blocks = [
    { file: 'index.html', code: html, lang: 'xml' },
    { file: 'style.css', code: css, lang: 'css' },
    { file: 'script.js', code: js, lang: 'javascript' },
  ];

  return (
    <section className="max-w-[1180px] mx-auto px-8 py-14">
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-6">
        <h2 className="m-0 text-[28px]">Preview &amp; export</h2>
        <div className="flex gap-2.5">
          <button onClick={onReset} className="bg-white/4 border border-white/8 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/8 transition-colors">
            Reset canvas
          </button>
          <button onClick={downloadZip} className="grad-btn text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-transform">
            ⬇ Download ZIP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4.5 max-[920px]:grid-cols-1">
        {blocks.map((b) => (
          <div key={b.file} className="glass overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <strong className="text-[13px]">{b.file}</strong>
              <button onClick={() => copy(b.file, b.code)} className="bg-white/5 border border-white/8 text-[var(--text-dim)] px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold hover:text-white hover:bg-white/10">
                Copy
              </button>
            </div>
            <div className="max-h-[420px] overflow-auto">
              <CodeBlock code={b.code} lang={b.lang} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
