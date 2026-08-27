import { useState, useEffect } from 'react';

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const API_URL = 'http://localhost:8000';
  const SECRET_KEY = 'Adhav@2004'; // Ensure this matches the backend secret key

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${API_URL}/admin/view-data?secret_key=${SECRET_KEY}`);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Admin error:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-65px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-[var(--text-dim)]">Loading Database...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[calc(100vh-65px)] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-4">
            <p className="font-semibold">Error Loading Data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1180px] mx-auto px-8 py-16 text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">🛡️ Admin Dashboard</h1>
        <p className="text-[var(--text-dim)]">Monitor users and templates in real-time</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-[var(--text-dim)] text-sm mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-blue-400">{data?.total_users || 0}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-[var(--text-dim)] text-sm mb-2">Total Templates</h3>
          <p className="text-4xl font-bold text-green-400">{data?.total_templates || 0}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-[var(--text-dim)] text-sm mb-2">Registered Users</h3>
          <p className="text-2xl font-bold text-purple-400">
            {data?.users?.filter(u => u.username !== 'guest').length || 0}
          </p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-[var(--text-dim)] text-sm mb-2">Guest Templates</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {data?.templates?.filter(t => t.owner === 'guest').length || 0}
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>👥</span> Registered Users
        </h2>
        {data?.users && data.users.length > 0 ? (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-[var(--text-dim)]">ID</th>
                    <th className="p-4 text-left text-sm font-semibold text-[var(--text-dim)]">Username</th>
                    <th className="p-4 text-left text-sm font-semibold text-[var(--text-dim)]">Account Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user, index) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm">{user.id}</td>
                      <td className="p-4 font-medium">{user.username}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300">
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl border border-white/10 text-center text-[var(--text-dim)]">
            <p>No registered users yet</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📦</span> Saved Templates
        </h2>
        {data?.templates && data.templates.length > 0 ? (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-[var(--text-dim)]">Template Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-[var(--text-dim)]">Owner</th>
                    <th className="p-4 text-left text-sm font-semibold text-[var(--text-dim)]">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.templates.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{t.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          t.owner === 'guest' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {t.owner}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--text-dim)] text-sm">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl border border-white/10 text-center text-[var(--text-dim)]">
            <p>No templates saved yet</p>
          </div>
        )}
      </div>
    </section>
  );
}