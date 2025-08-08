import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';

type View = 'home' | 'dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
    setSelectedShiftId(null);
  };

  const handleNavigate = (view: string, shiftId?: string) => {
    setCurrentView(view as View);
    if (view === 'sessions' && shiftId) {
      setSelectedShiftId(shiftId);
    } else if (view !== 'sessions') {
      setSelectedShiftId(null);
    }
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
        <Dashboard onNavigate={handleNavigate} selectedShiftId={selectedShiftId} />
      )}
    </div>
  );
}

export default App;