export const DEFAULTS = {
  heading: { w: 320, h: 56, content: 'Your Heading', tag: 'h2',
    styles: { bg: 'transparent', color: '#F8FAFC', fontSize: 32, fontWeight: 700, padding: 6, radius: 0, shadow: 'none' } },
  text: { w: 280, h: 80, content: 'Add your text here. Click to select and edit it in the style panel.', tag: 'p',
    styles: { bg: 'transparent', color: '#CBD5E1', fontSize: 15, fontWeight: 400, padding: 6, radius: 0, shadow: 'none' } },
  button: { w: 160, h: 48, content: 'Click Me', tag: 'button',
    styles: { bg: '#8B5CF6', color: '#FFFFFF', fontSize: 15, fontWeight: 600, padding: 10, radius: 10, shadow: 'medium' } },
  card: { w: 280, h: 180, content: '', tag: 'div',
    styles: { bg: 'rgba(255,255,255,0.06)', color: '#F1F5F9', fontSize: 14, fontWeight: 400, padding: 18, radius: 16, shadow: 'soft' } },
  image: { w: 280, h: 180, content: 'https://picsum.photos/400/300', tag: 'img',
    styles: { bg: '#1E293B', color: '#FFFFFF', fontSize: 14, fontWeight: 400, padding: 0, radius: 12, shadow: 'soft' } },
  input: { w: 240, h: 44, content: 'Enter text...', tag: 'input',
    styles: { bg: '#111c34', color: '#E2E8F0', fontSize: 14, fontWeight: 400, padding: 10, radius: 8, shadow: 'none' } },
};

export const SHADOWS = {
  none: 'none',
  soft: '0 8px 20px -8px rgba(0,0,0,.35)',
  medium: '0 14px 30px -10px rgba(0,0,0,.5)',
  strong: '0 22px 46px -12px rgba(0,0,0,.65)',
};

export const ANIM_LABELS = {
  none: 'None', float: 'Float', fadein: 'Fade In', fadeout: 'Fade Out',
  slidetop: 'Slide from Top', slidebottom: 'Slide from Bottom',
  slideleft: 'Slide from Left', slideright: 'Slide from Right',
  scale: 'Scale In', rotate: 'Rotate In', bounce: 'Bounce', typing: 'Typing Text',
};

export const TYPE_LABEL = {
  heading: 'Heading', text: 'Text', button: 'Button', card: 'Card', image: 'Image', input: 'Input',
};

export const KEYFRAME_SRC = {
  float: `@keyframes anim-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-16px);}}`,
  fadein: `@keyframes anim-fadein{from{opacity:0;}to{opacity:1;}}`,
  fadeout: `@keyframes anim-fadeout{from{opacity:1;}to{opacity:0;}}`,
  slidetop: `@keyframes anim-slidetop{from{transform:translateY(-40px);opacity:0;}to{transform:translateY(0);opacity:1;}}`,
  slidebottom: `@keyframes anim-slidebottom{from{transform:translateY(40px);opacity:0;}to{transform:translateY(0);opacity:1;}}`,
  slideleft: `@keyframes anim-slideleft{from{transform:translateX(-40px);opacity:0;}to{transform:translateX(0);opacity:1;}}`,
  slideright: `@keyframes anim-slideright{from{transform:translateX(40px);opacity:0;}to{transform:translateX(0);opacity:1;}}`,
  scale: `@keyframes anim-scale{from{transform:scale(.6);opacity:0;}to{transform:scale(1);opacity:1;}}`,
  rotate: `@keyframes anim-rotate{from{transform:rotate(-180deg);opacity:0;}to{transform:rotate(0);opacity:1;}}`,
  bounce: `@keyframes anim-bounce{0%,100%{transform:translateY(0);}30%{transform:translateY(-22px);}50%{transform:translateY(0);}65%{transform:translateY(-10px);}80%{transform:translateY(0);}}`,
};

let idCounter = 1;
export function nextId() {
  return idCounter++;
}

export function newElement(type, x, y) {
  const d = DEFAULTS[type];
  return {
    id: nextId(),
    type,
    tag: d.tag,
    x: Math.max(0, Math.round(x - d.w / 2)),
    y: Math.max(0, Math.round(y - d.h / 2)),
    w: d.w,
    h: d.h,
    content: d.content,
    styles: { ...d.styles },
    animation: { type: 'none', duration: 1.2, delay: 0, iteration: 1, infinite: false, easing: 'ease-in-out' },
  };
}
