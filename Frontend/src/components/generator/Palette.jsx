const ITEMS = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'button', label: 'Button', icon: '▭' },
  { type: 'card', label: 'Card', icon: '▢' },
  { type: 'image', label: 'Image', icon: '▧' },
  { type: 'input', label: 'Input', icon: '▬' },
];

export default function Palette() {
  return (
    <div className="glass p-4">
      <div className="text-[11.5px] uppercase tracking-[.08em] text-[var(--text-dim)] font-semibold mb-3">Elements</div>
      {ITEMS.map((item) => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('text/plain', item.type)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/5 bg-white/2 mb-2 cursor-grab text-[13.5px] font-medium hover:border-purple-500/50 hover:bg-purple-500/8 transition-colors"
        >
          <div className="w-[26px] h-[26px] rounded-[7px] grad-btn flex items-center justify-center text-[13px] shrink-0">{item.icon}</div>
          {item.label}
        </div>
      ))}
    </div>
  );
}
