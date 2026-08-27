import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="glass border-b border-white/10 px-8 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
          ✦
        </div>
        <span className="text-xl font-bold tracking-tight">
          Dynamic <span className="text-blue-400">UI</span>
        </span>
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
        <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Home</Link>
        <Link to="/generator" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Generator</Link>
        <Link to="/templates" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Templates</Link>
        
        {/* History - Only for logged in users */}
        {token && (
          <Link to="/history" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors text-blue-400">
            History
          </Link>
        )}
      </div>

      {/* Right Side: Login/Logout/Guest */}
      <div className="flex items-center gap-3">
        {token ? (
          // Logged In
          <>
            <span className="text-sm text-[var(--text-dim)] hidden sm:block">
              Hi, <span className="text-white font-semibold">{username || 'User'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          // Not Logged In (Guest Mode)
          <>
            <span className="text-xs text-[var(--text-dim)] hidden sm:block bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              👤 Guest Mode
            </span>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}