
import React, { useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/`, { method: 'GET' });
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${apiUrl}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
    }

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-gray-200 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Type Shift</span>
          </div>
          
          <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
            <div className={`w-2 h-2 rounded-full mr-2 ${isOnline === null ? 'bg-gray-400 animate-pulse' : isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {isOnline === null ? 'Checking...' : isOnline ? 'Server Live' : 'Server Offline'}
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Tools</a>
          {user ? (
            <div className="flex items-center space-x-4 border-l pl-8 border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-900">{user.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              Get Started
            </button>
          )}
        </nav>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={(userData) => setUser(userData)}
      />
    </header>
  );
};
