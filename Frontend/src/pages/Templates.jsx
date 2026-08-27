import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '../lib/BuilderContext.jsx';
import { TEMPLATES } from '../data/templates.js';

export default function Templates() {
  const { elements, loadElements, showToast } = useBuilder();
  const navigate = useNavigate();
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved templates from backend when page loads
  useEffect(() => {
    fetchSavedTemplates();
  }, []);

  const fetchSavedTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch('http://localhost:8000/api/templates', {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to fetch templates');
      const result = await response.json();
      
      setSavedTemplates(result.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      if (showToast) {
        showToast('Failed to load templates', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Use a backend template
  const useSavedTemplate = async (tpl) => {
    if (elements.length && !window.confirm('Loading a template replaces your current canvas. Continue?')) return;
    
    // Parse the JSON strings back to objects
    const parsedComponents = typeof tpl.components === 'string' ? JSON.parse(tpl.components) : tpl.components;
    
    loadElements(parsedComponents);
    navigate('/generator');
    if (showToast) {
      showToast('Template loaded: ' + tpl.name);
    }
  };

  // Delete a backend template
  const deleteTemplate = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`http://localhost:8000/api/templates/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) throw new Error('Failed to delete template');
      
      if (showToast) {
        showToast('Template deleted');
      }
      fetchSavedTemplates(); // Refresh list
    } catch (error) {
      console.error('Error deleting:', error);
      if (showToast) {
        showToast('Error deleting template', 'error');
      }
    }
  };

  // Use a local ready-made template (your existing logic)
  const useLocalTemplate = (tpl) => {
    if (elements.length && !window.confirm('Loading a template replaces your current canvas. Continue?')) return;
    loadElements(tpl.build());
    navigate('/generator');
    if (showToast) {
      showToast('Template loaded: ' + tpl.name);
    }
  };

  return (
    <section className="max-w-[1180px] mx-auto px-8 py-16">
      
      {/* --- SAVED TEMPLATES SECTION (From Database) --- */}
      <div className="mb-16">
        <div className="text-center mb-11">
          <h2 className="text-4xl mb-2.5">
            My <span className="grad-text">Saved Templates</span>
          </h2>
          <p className="text-[var(--text-dim)] text-[15.5px]">Templates you've saved from the generator (including guest templates).</p>
        </div>

        {loading ? (
          <p className="text-center text-[var(--text-dim)]">Loading saved templates...</p>
        ) : savedTemplates.length === 0 ? (
          <div className="text-center py-10 glass rounded-2xl border border-white/5">
            <p className="text-[var(--text-dim)] mb-4">No saved templates yet.</p>
            <button 
              onClick={() => navigate('/generator')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Go to Generator
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {savedTemplates.map((t) => (
              <div key={t.id} className="glass overflow-hidden flex flex-col">
                <div className="h-[150px] m-3.5 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center">
                  <span className="text-4xl">💾</span>
                </div>
                <div className="px-4.5 pb-4.5 flex flex-col flex-1">
                  <h3 className="mb-1.5 text-[15.5px] font-semibold truncate" title={t.name}>{t.name}</h3>
                  <p className="mb-2 text-[12px] px-2 py-1 rounded bg-blue-500/10 text-blue-400 inline-block w-fit">
                    {t.owner === 'guest' ? '👤 Guest Template' : `👤 ${t.owner}`}
                  </p>
                  <p className="mb-3.5 text-[13px] text-[var(--text-dim)] leading-relaxed flex-1">
                    Components: {Array.isArray(t.components) ? t.components.length : 0}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => useSavedTemplate(t)} 
                      className="flex-1 bg-white/4 border border-white/8 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/8 transition-colors"
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => deleteTemplate(t.id, t.name)} 
                      className="bg-red-500/20 border border-red-500/30 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-500/40 transition-colors text-red-300"
                      title="Delete template"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- READY-MADE TEMPLATES SECTION (Local Presets) --- */}
      <div>
        <div className="text-center mb-11">
          <h2 className="text-4xl mb-2.5">
            Ready-made <span className="grad-text">templates</span>
          </h2>
          <p className="text-[var(--text-dim)] text-[15.5px]">Load a preset straight into the generator, then tweak it to make it yours.</p>
        </div>
        <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="glass overflow-hidden flex flex-col">
              <div className="h-[150px] m-3.5 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center">
                <span className="text-4xl">{t.emoji}</span>
              </div>
              <div className="px-4.5 pb-4.5">
                <h3 className="mb-1.5 text-[15.5px] font-semibold">{t.name}</h3>
                <p className="mb-3.5 text-[13px] text-[var(--text-dim)] leading-relaxed">{t.desc}</p>
                <button 
                  onClick={() => useLocalTemplate(t)} 
                  className="w-full bg-white/4 border border-white/8 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/8 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}