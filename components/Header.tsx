
import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        const res = await fetch(`${apiUrl}/`, { method: 'GET' });
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

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
        
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Tools</a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">API</a>
        </nav>
        
        <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
          Get Started
        </button>
      </div>
    </header>
  );
};
