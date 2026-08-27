import { useState, useEffect } from 'react';
import { templatesAPI } from '../lib/api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await templatesAPI.getAll();
      setHistory(result.templates || []);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-[1180px] mx-auto px-8 py-16">
      <div className="text-center mb-11">
        <h2 className="text-4xl mb-2.5">
          My <span className="grad-text">History</span>
        </h2>
        <p className="text-[var(--text-dim)] text-[15.5px]">All your recently saved templates.</p>
      </div>

      {loading ? (
        <p className="text-center text-[var(--text-dim)]">Loading history...</p>
      ) : history.length === 0 ? (
        <div className="text-center py-10 glass rounded-2xl border border-white/5">
          <p className="text-[var(--text-dim)]">No history yet. Start building!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {history.map((t) => (
            <div key={t.id} className="glass overflow-hidden flex flex-col p-5 rounded-2xl border border-white/10">
              <h3 className="mb-1.5 text-[15.5px] font-semibold truncate">{t.name}</h3>
              <p className="text-[13px] text-[var(--text-dim)]">
                Saved: {new Date(t.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}