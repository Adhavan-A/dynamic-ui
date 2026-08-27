import { SHADOWS, KEYFRAME_SRC } from './constants';

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

const TAG = { heading: 'h2', text: 'p', button: 'button', card: 'div', image: 'img', input: 'input' };

export function generateHTML(elements) {
  const body = elements
    .map((el) => {
      const cls = `el-${el.id}`;
      if (el.type === 'image') return `  <img class="${cls}" src="${el.content}" alt="">`;
      if (el.type === 'input') return `  <input class="${cls}" type="text" placeholder="${escapeHtml(el.content)}">`;
      if (el.type === 'card') return `  <div class="${cls}"></div>`;
      if (el.animation.type === 'typing') {
        return `  <${TAG[el.type]} class="${cls}" data-typing="${escapeHtml(el.content)}"></${TAG[el.type]}>`;
      }
      return `  <${TAG[el.type]} class="${cls}">${escapeHtml(el.content)}</${TAG[el.type]}>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Dynamic UI</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="canvas">
${body || '  <!-- no elements yet -->'}
</div>
<script src="script.js"></script>
</body>
</html>`;
}

export function generateCSS(elements) {
  const used = new Set();
  const rules = elements
    .map((el) => {
      const s = el.styles;
      let css =
        `.el-${el.id}{\n` +
        `  position:absolute;\n  left:${el.x}px;\n  top:${el.y}px;\n  width:${el.w}px;\n  height:${el.h}px;\n` +
        `  background:${s.bg};\n  color:${s.color};\n  font-size:${s.fontSize}px;\n  font-weight:${s.fontWeight};\n` +
        `  padding:${s.padding}px;\n  border-radius:${s.radius}px;\n  box-shadow:${SHADOWS[s.shadow]};\n  border:none;\n`;
      if (el.animation.type !== 'none' && el.animation.type !== 'typing') {
        used.add(el.animation.type);
        const a = el.animation;
        const iter = a.infinite ? 'infinite' : a.iteration;
        css += `  animation: anim-${a.type} ${a.duration}s ${a.easing} ${a.delay}s ${iter} both;\n`;
      }
      css += `}`;
      return css;
    })
    .join('\n\n');

  const keyframes = [...used].map((k) => KEYFRAME_SRC[k]).join('\n');
  const hasTyping = elements.some((e) => e.animation.type === 'typing');

  return `* { box-sizing: border-box; }
body { margin:0; font-family: 'Inter', sans-serif; background:#0F172A; }
.canvas { position: relative; width: 100%; min-height: 100vh; overflow: hidden; }

${rules || '/* no elements yet */'}
${keyframes ? '\n' + keyframes : ''}
${hasTyping ? `
.typing-caret{display:inline-block;width:2px;margin-left:2px;background:currentColor;animation:anim-blink 1s steps(1) infinite;}
@keyframes anim-blink{0%,50%{opacity:1;}51%,100%{opacity:0;}}` : ''}`;
}

export function generateJS(elements) {
  const typingEls = elements.filter((e) => e.animation.type === 'typing');
  if (!typingEls.length) {
    return `// No JavaScript needed for this design.
// Add a "Typing Text" animation to an element to generate a typing-effect script here.`;
  }
  return `// Typing text effect
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('[data-typing]');
  targets.forEach((el) => {
    const text = el.getAttribute('data-typing');
    const caret = document.createElement('span');
    caret.className = 'typing-caret';
    caret.style.height = getComputedStyle(el).fontSize;
    let i = 0;
    function type() {
      el.textContent = text.slice(0, i);
      el.appendChild(caret);
      i++;
      if (i <= text.length) setTimeout(type, 65);
    }
    type();
  });
});`;
}
