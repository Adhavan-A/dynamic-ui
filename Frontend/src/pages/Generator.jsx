import { useState } from 'react';
import { useBuilder } from '../lib/BuilderContext.jsx';
import Palette from '../components/generator/Palette.jsx';
import LayersPanel from '../components/generator/LayersPanel.jsx';
import Canvas from '../components/generator/Canvas.jsx';
import StylePanel from '../components/generator/StylePanel.jsx';
import AnimationPanel from '../components/generator/AnimationPanel.jsx';
import CodeDrawer from '../components/generator/CodeDrawer.jsx';

export default function Generator() {
  const { elements, resetCanvas, showToast } = useBuilder();
  const [sideTab, setSideTab] = useState('style');
  const [codeOpen, setCodeOpen] = useState(false);

  const onReset = () => {
    if (elements.length && !window.confirm('Clear the entire canvas? This cannot be undone.')) return;
    resetCanvas();
  };

  const saveToBackend = async () => {
    if (!elements || elements.length === 0) {
      if (showToast) {
        showToast('Canvas is empty! Add some elements first.', 'error');
      } else {
        alert('Canvas is empty! Add some elements first.');
      }
      return;
    }

    const name = window.prompt('Enter a name for this template:');
    if (!name) return;

    const token = localStorage.getItem('token');
    const isGuest = !token;
    
    if (isGuest) {
      const confirmGuest = window.confirm(
        ' You are using Guest Mode.\n\nThis template will be saved publicly and visible to everyone.\n\nWould you like to Login instead to save privately?'
      );
      if (confirmGuest) {
        window.location.href = '/login';
        return;
      }
    }

    try {
      const cleanElements = JSON.parse(JSON.stringify(elements));
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization token if logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8000/api/templates', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: name,
          components: cleanElements,
          styles: {}
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save');
      }
      
      const result = await response.json();
      console.log('✅ Saved successfully:', result);
      
      if (showToast) {
        showToast(isGuest ? '✅ Saved as Guest!' : '✅ Template saved successfully!');
      } else {
        alert(isGuest ? 'Saved as Guest!' : 'Template saved successfully!');
      }
      
    } catch (error) {
      console.error('❌ SAVE ERROR:', error);
      if (showToast) {
        showToast('Error saving template: ' + error.message, 'error');
      } else {
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <section>
      <div className="grid grid-cols-[230px_1fr_300px] gap-3.5 p-4 h-[calc(100vh-65px)] min-h-[640px] max-[1100px]:grid-cols-1 max-[1100px]:h-auto">
        {/* Left column */}
        <div className="flex flex-col gap-3.5 min-h-0">
          <Palette />
          <LayersPanel />
        </div>

        {/* Center: canvas */}
        <div className="flex flex-col gap-3.5 min-h-0">
          <div className="glass flex items-center justify-between px-3.5 py-2.5">
            <div className="text-xs text-[var(--text-dim)]">🖱️ Drag elements from the left onto the canvas</div>
            <div className="flex gap-2">
              <button onClick={() => setCodeOpen(true)} className="bg-white/4 border border-white/8 px-3.5 py-2 rounded-lg text-xs font-medium hover:bg-white/9 transition-colors">
                &lt;/&gt; View Code
              </button>
              
              {/* Save Button */}
              <button 
                onClick={saveToBackend} 
                className="bg-green-500/10 border border-green-500/30 px-3.5 py-2 rounded-lg text-xs font-medium text-green-300 hover:bg-green-500/20 transition-colors flex items-center gap-1"
              >
                💾 Save
              </button>
              
              <button onClick={onReset} className="bg-white/4 border border-white/8 px-3.5 py-2 rounded-lg text-xs font-medium hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-300 transition-colors">
                Reset
              </button>
            </div>
          </div>
          <Canvas />
        </div>

        {/* Right: style / animation */}
        <div className="min-h-0 overflow-auto">
          <div className="glass p-4">
            <div className="flex gap-1.5 p-1.5 bg-white/3 rounded-xl mb-3.5 border border-white/5">
              <button
                onClick={() => setSideTab('style')}
                className={`flex-1 text-center px-1.5 py-2 rounded-lg text-[12.5px] font-semibold ${sideTab === 'style' ? 'bg-white/9 text-white' : 'text-[var(--text-dim)]'}`}
              >
                Style
              </button>
              <button
                onClick={() => setSideTab('anim')}
                className={`flex-1 text-center px-1.5 py-2 rounded-lg text-[12.5px] font-semibold ${sideTab === 'anim' ? 'bg-white/9 text-white' : 'text-[var(--text-dim)]'}`}
              >
                Animation
              </button>
            </div>
            {sideTab === 'style' ? <StylePanel /> : <AnimationPanel />}
          </div>
        </div>
      </div>

      <CodeDrawer open={codeOpen} setOpen={setCodeOpen} />
    </section>
  );
}