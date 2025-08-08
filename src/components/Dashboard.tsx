import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Activity, 
  Video, 
  ChevronRight 
} from 'lucide-react';
import { Overview } from './dashboard/Overview';
import { ServerManagement } from './dashboard/ServerManagement';
import { ShiftPlanning } from './dashboard/ShiftPlanning';
import { ShiftSessions } from './dashboard/ShiftSessions';
import { LiveSupervision } from './dashboard/LiveSupervision';

type DashboardPanel = 'overview' | 'servers' | 'shifts' | 'sessions' | 'live';

export const Dashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<DashboardPanel>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liveTrackingServerId, setLiveTrackingServerId] = useState<string | null>(null);

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'servers', name: 'Server Management', icon: Users },
    { id: 'shifts', name: 'Shift Planning', icon: Calendar },
    { id: 'sessions', name: 'Shift Sessions', icon: Activity },
    { id: 'live', name: 'Live Supervision', icon: Video },
  ];

  const handleStartLiveTracking = (serverId: string) => {
    setLiveTrackingServerId(serverId);
    setActivePanel('live');
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':
        return <Overview />;
      case 'servers':
        return <ServerManagement onStartLiveTracking={handleStartLiveTracking} />;
      case 'shifts':
        return <ShiftPlanning />;
      case 'sessions':
        return <ShiftSessions />;
      case 'live':
        return <LiveSupervision serverId={liveTrackingServerId} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7]">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-center h-16 bg-[#006A71] text-white">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activePanel === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePanel(item.id as DashboardPanel);
                      setSidebarOpen(false);
                      if (item.id !== 'live') {
                        setLiveTrackingServerId(null);
                      }
                    }}
                    className={`${
                      isActive
                        ? 'bg-[#9ACBD0] text-[#006A71] border-r-2 border-[#006A71]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#006A71]'
                    } group flex items-center w-full px-2 py-2 text-sm font-medium rounded-l-md transition-colors`}
                  >
                    <Icon
                      className={`${
                        isActive ? 'text-[#006A71]' : 'text-gray-400 group-hover:text-[#006A71]'
                      } mr-3 h-5 w-5 transition-colors`}
                    />
                    {item.name}
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed top-4 left-4 z-40 bg-[#006A71] text-white p-2 rounded-md shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Page content */}
          <main className="p-4 lg:p-8 pt-16 lg:pt-8">
            {renderPanel()}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};