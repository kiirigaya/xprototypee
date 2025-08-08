import React from 'react';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn, 
  onLogin, 
  onLogout, 
  currentView, 
  onNavigate 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-[#006A71]">EmotionCare AI</h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-8">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => onNavigate('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'home' 
                      ? 'text-[#006A71] bg-[#9ACBD0]/20' 
                      : 'text-gray-600 hover:text-[#006A71]'
                  }`}
                >
                  Home
                </button>
                <button 
                  className="text-gray-600 hover:text-[#006A71] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contact
                </button>
                <button 
                  onClick={onLogin}
                  className="text-gray-600 hover:text-[#006A71] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </button>
                <button className="bg-[#006A71] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#004a51] transition-colors">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'dashboard' 
                      ? 'text-[#006A71] bg-[#9ACBD0]/20' 
                      : 'text-gray-600 hover:text-[#006A71]'
                  }`}
                >
                  Dashboard
                </button>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">Manager</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};