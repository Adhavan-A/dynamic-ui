import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);

export default function CodeBlock({ code, lang }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted');
      hljs.highlightElement(ref.current);
    }
  }, [code, lang]);

  return (
    <pre className="m-0 text-[12.5px] leading-relaxed !bg-transparent !p-3.5">
      <code ref={ref} className={`language-${lang}`}>
        {code}
      </code>
    </pre>
  );
}
