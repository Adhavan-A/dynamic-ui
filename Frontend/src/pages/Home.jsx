import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';




const FEATURES = [
  { ico: '🖱️', title: 'Visual Canvas', desc: 'Drag, drop, move and resize headings, buttons, cards, images, text and inputs directly on the canvas.' },
  { ico: '🎨', title: 'Style Panel', desc: 'Fine-tune colors, typography, spacing, radius and shadows with instant live preview.' },
  { ico: '🎬', title: 'Animation Builder', desc: 'Float, fade, slide, scale, rotate, bounce or type-on animations with full easing control.' },
  { ico: '⚡', title: 'Live Code Generator', desc: 'HTML, CSS and JS are generated in real time and shown in a syntax-highlighted editor.' },
  { ico: '📦', title: 'One-click Export', desc: 'Copy any snippet or download the whole project as a ready-to-run ZIP archive.' },
  { ico: '📱', title: 'Responsive by Default', desc: 'Every element and every page of the studio itself adapts cleanly down to mobile.' },
];

const HERO_DEMOS = [
  { name: 'Float', emoji: '🚀', css: 'anim-float 2.2s ease-in-out infinite' },
  { name: 'Bounce', emoji: '🏀', css: 'anim-bounce 1.2s ease-in-out infinite' },
  { name: 'Fade In', emoji: '✨', css: 'anim-fadein .9s ease-out both' },
  { name: 'Slide In', emoji: '📇', css: 'anim-slideleft .7s ease-out both' },
  { name: 'Scale In', emoji: '💎', css: 'anim-scale .8s ease-out both' },
  { name: 'Rotate In', emoji: '🌀', css: 'anim-rotate .8s ease-out both' },
];

function HeroDemo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_DEMOS.length), 2400);
    return () => clearInterval(timer);
  }, []);

  const demo = HERO_DEMOS[index];

  return (
    <>
      <div
        key={index}
        className="w-[120px] h-[120px] rounded-[22px] grad-btn mx-auto mt-5 flex items-center justify-center text-3xl"
        style={{ animation: demo.css, boxShadow: '0 20px 50px -15px rgba(139,92,246,.6)' }}
      >
        {demo.emoji}
      </div>
      <div className="text-center mt-4.5 text-[12.5px] text-[var(--text-dim)] font-semibold tracking-wide">
        Previewing: <span className="text-[var(--cyan)]">{demo.name}</span>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {HERO_DEMOS.map((d, i) => (
          <span
            key={d.name}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-4.5 bg-[var(--cyan)]' : 'w-1.5 bg-white/15'}`}
          />
        ))}
      </div>
    </>
  );
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <section>
      <div className="max-w-[1180px] mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[.08em] text-[var(--cyan)] bg-cyan-400/10 border border-cyan-400/25 px-3.5 py-1.5 rounded-full mb-7">
          ● No-code UI &amp; animation studio
        </div>
        <h1 className="text-[clamp(38px,6vw,68px)] leading-[1.05] font-bold tracking-tight mb-5">
          Design UI &amp; animations
          <br />
          <span className="grad-text">without writing a line of code.</span>
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-[620px] mx-auto mb-9 leading-relaxed">
          Drag components onto a canvas, style them visually, layer on floating, sliding, bouncing or typing
          animations — then export clean, production-ready HTML, CSS &amp; JS.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap mb-16">
          <button onClick={() => navigate('/generator')} className="grad-btn text-white px-7 py-3.5 rounded-xl font-semibold hover:-translate-y-0.5 transition-transform">
            Open Generator →
          </button>
          <button
            onClick={() => navigate('/templates')}
            className="bg-white/4 border border-white/8 px-6 py-3.5 rounded-xl font-semibold hover:bg-white/8 transition-colors"
          >
            Browse Templates
          </button>
        </div>

        <div className="max-w-[900px] mx-auto rounded-[22px] overflow-hidden">
          <div className="glass p-6">
            <div className="flex gap-3.5 items-center mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-auto text-xs text-[var(--text-dim)] mono">generator.html</span>
            </div>
            <HeroDemo />
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-8 mt-10 mb-24 grid grid-cols-3 gap-5 max-[820px]:grid-cols-1">
        {FEATURES.map((f) => (
          <div key={f.title} className="glass p-6 text-left">
            <div className="w-[42px] h-[42px] rounded-[11px] bg-purple-500/15 border border-purple-500/35 flex items-center justify-center text-lg mb-4">
              {f.ico}
            </div>
            <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
            <p className="m-0 text-[var(--text-dim)] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
