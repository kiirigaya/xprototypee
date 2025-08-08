import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';

type View = 'home' | 'dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7]">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      
      {currentView === 'home' && !isLoggedIn && (
        <HomePage onLogin={handleLogin} />
      )}
      
      {currentView === 'dashboard' && isLoggedIn && (
        <Dashboard />
      )}
    </div>
  );
}

export default App;